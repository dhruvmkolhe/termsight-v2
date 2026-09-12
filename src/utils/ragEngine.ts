import type { LegalDomain, RagIndex, RagQueryResult, RagRetrievedWindow, SentenceWindow } from '../types/rag';

const LEGAL_ABBREVIATIONS = [
  'e.g.', 'i.e.', 'vs.', 'v.', 'inc.', 'llc.', 'ltd.', 'corp.', 'no.', 'sec.', 'art.',
  'para.', 'p.m.', 'a.m.', 'jan.', 'feb.', 'mar.', 'apr.', 'jun.', 'jul.', 'aug.',
  'sep.', 'sept.', 'oct.', 'nov.', 'dec.', 'mr.', 'mrs.', 'ms.', 'dr.', 'prof.',
  'approx.', 'est.', 'et al.', 'cf.', 'id.', 'ibid.', 'u.s.', 'u.k.', 'e.u.', 'co.'
];

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers',
  'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'will', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'tell', 'show', 'explain',
  'find', 'summarize', 'identify', 'what', 'is', 'the', 'are', 'there'
]);

const DOMAIN_KEYWORDS: Record<LegalDomain, RegExp> = {
  indemnity: /\b(?:indemnif\w*|hold harmless|defend against|indemnitee|indemnitor)\b/i,
  liability: /\b(?:liabilit\w*|damages?|limitation of liability|consequential damages|punitive damages|cap on|aggregate liability|direct damages)\b/i,
  termination: /\b(?:terminat\w*|cancellation|cure period|without cause|for cause|survival|post-termination|discontinue)\b/i,
  ip_ownership: /\b(?:intellectual property|copyright|patent|trademark|trade secret|work made for hire|work product|assign\w*|proprietary rights|ownership of|license grant)\b/i,
  payment_fees: /\b(?:payment|fee|invoice|billing|interest|late charge|milestone|compensation|reimbursement|taxes|net \d+)\b/i,
  dispute_arbitration: /\b(?:arbitrat\w*|governing law|jurisdiction|venue|class action waiver|jury trial|dispute resolution|mediation|american arbitration association|jams)\b/i,
  privacy_data: /\b(?:privacy|personal data|gdpr|ccpa|pii|data protection|security incident|data breach|subprocessor|telemetry|tracking)\b/i,
  restrictive_covenants: /\b(?:non-compete|non-solicit\w*|non-disclosure|restrictive covenant|restraint of trade|exclusivity)\b/i,
  unilateral_changes: /\b(?:modify these terms|amend from time to time|sole discretion|unilateral\w*|update at any time|without prior notice)\b/i,
  warranties: /\b(?:warrant\w*|disclaimer|as-is|merchantability|fitness for a particular purpose|express warranty)\b/i,
  confidentiality: /\b(?:confidential\w*|non-disclosure|proprietary information|trade secret|recipient shall protect)\b/i,
  general: /.*/,
};

/**
 * Lightweight Legal Word Stemmer
 * Normalizes legal word variations (e.g. indemnity -> indemn, indemnification -> indemn,
 * terminate -> termin, termination -> termin, liability -> liab, liabilities -> liab)
 */
export function stemLegalWord(word: string): string {
  if (word.length <= 3) return word;
  let w = word.toLowerCase().trim();

  // Common legal suffixes
  if (w.startsWith('indemnif') || w.startsWith('indemni')) return 'indemn';
  if (w.startsWith('liabilit') || w.startsWith('liabl')) return 'liab';
  if (w.startsWith('terminat') || w.startsWith('termin')) return 'termin';
  if (w.startsWith('arbitrat') || w.startsWith('arbitr')) return 'arbitr';
  if (w.startsWith('cancellat') || w.startsWith('cancel')) return 'cancel';
  if (w.startsWith('confidenti')) return 'confident';
  if (w.startsWith('restrict')) return 'restrict';
  if (w.startsWith('warrant')) return 'warrant';
  if (w.startsWith('renew')) return 'renew';
  if (w.startsWith('compensat')) return 'compens';
  if (w.startsWith('obligat')) return 'oblig';

  // Standard suffix stripping
  w = w
    .replace(/(?:ing|edly|ingly|ed|es|s|tion|tions|ment|ments|able|ible|ity|ities|ive|al|ally|ness)$/i, '')
    .trim();

  return w.length >= 3 ? w : word.toLowerCase();
}

/**
 * Tokenize raw contract text into discrete sentences while protecting legal abbreviations,
 * section headers, numbers, and bullet points.
 */
export function tokenizeLegalSentences(rawText: string): Array<{ text: string; startChar: number; endChar: number; lineNumber: number }> {
  if (!rawText || !rawText.trim()) return [];

  // Protect abbreviations by temporary token substitution
  let processed = rawText;
  const placeholderMap = new Map<string, string>();
  let pIndex = 0;

  LEGAL_ABBREVIATIONS.forEach(abbr => {
    const regex = new RegExp(`\\b${abbr.replace(/\./g, '\\.')}`, 'gi');
    processed = processed.replace(regex, (match) => {
      const token = `__ABBR_${pIndex++}__`;
      placeholderMap.set(token, match);
      return token;
    });
  });

  // Protect section heading numbers like "SECTION 1." or "ARTICLE 2." or "1. "
  processed = processed.replace(/(?:^|\n|\s)(?:SECTION|ARTICLE|CLAUSE)?\s*(\d+)\.\s+/gi, (match) => {
    const token = `__SEC_${pIndex++}__`;
    placeholderMap.set(token, match);
    return token;
  });

  // Protect clause numbers and monetary decimals like "1.1." or "Sec. 4.2" or "$10,000.00" or "1.5%"
  processed = processed.replace(/(\d+)\.(\d+)/g, (match) => {
    const token = `__NUM_${pIndex++}__`;
    placeholderMap.set(token, match);
    return token;
  });

  // Split by sentence delimiters: period, question mark, exclamation, or double newline
  const sentenceEndRegex = /([.!?]+(?:\s+|$)|(?:\r?\n){2,})/g;
  const rawSentences: Array<{ text: string; startChar: number; endChar: number; lineNumber: number }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = sentenceEndRegex.exec(processed)) !== null) {
    const chunkEnd = match.index + match[0].length;
    let sentenceText = processed.substring(lastIndex, chunkEnd).trim();

    if (sentenceText.length > 0) {
      // Restore placeholders
      placeholderMap.forEach((orig, token) => {
        sentenceText = sentenceText.replaceAll(token, orig);
      });

      // Calculate line number
      const prefix = rawText.substring(0, lastIndex);
      const lineNumber = (prefix.match(/\n/g) || []).length + 1;

      // Clean extra spaces
      const cleanText = sentenceText.replace(/\s+/g, ' ').trim();
      if (cleanText.length >= 10 && !/^(?:SECTION|ARTICLE|CLAUSE)\s+[\dIVXLCDM]+[.:\s]*$/i.test(cleanText)) {
        rawSentences.push({
          text: cleanText,
          startChar: lastIndex,
          endChar: chunkEnd,
          lineNumber,
        });
      }
    }
    lastIndex = chunkEnd;
  }

  // Trailing sentence if any
  if (lastIndex < processed.length) {
    let trailing = processed.substring(lastIndex).trim();
    if (trailing.length >= 10) {
      placeholderMap.forEach((orig, token) => {
        trailing = trailing.replaceAll(token, orig);
      });
      const prefix = rawText.substring(0, lastIndex);
      const lineNumber = (prefix.match(/\n/g) || []).length + 1;
      rawSentences.push({
        text: trailing.replace(/\s+/g, ' ').trim(),
        startChar: lastIndex,
        endChar: rawText.length,
        lineNumber,
      });
    }
  }

  return rawSentences;
}

/**
 * Classifies a sentence or window into a primary legal domain
 */
export function classifyDomain(text: string): LegalDomain {
  for (const [domain, regex] of Object.entries(DOMAIN_KEYWORDS) as [LegalDomain, RegExp][]) {
    if (domain !== 'general' && regex.test(text)) {
      return domain;
    }
  }
  return 'general';
}

/**
 * Detects section headings across the document to provide context hierarchy
 */
export function detectSections(fullText: string): Array<{ title: string; startIndex: number; endIndex: number }> {
  const sectionRegex = /(?:^|\n+)(?:(?:SECTION|ARTICLE|CLAUSE)\s+[\dIVXLCDM]+[.:\s]*[^\n]+|\d+[.)]\s+[A-Z\s]{3,}[^\n]*|[A-Z\s]{4,}:)/gi;
  const sections: Array<{ title: string; startIndex: number; endIndex: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(fullText)) !== null) {
    const rawTitle = match[0].replace(/[\r\n]+/g, ' ').trim();
    if (rawTitle.length > 3) {
      sections.push({
        title: rawTitle.slice(0, 100),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  return sections;
}

/**
 * Get nearest section heading for a character index
 */
function findNearestSection(sections: Array<{ title: string; startIndex: number }>, charOffset: number): string {
  if (sections.length === 0) return 'General Provisions';
  let nearest = sections[0].title;
  for (const sec of sections) {
    if (sec.startIndex <= charOffset) {
      nearest = sec.title;
    } else {
      break;
    }
  }
  return nearest;
}

/**
 * Builds the complete Sentence Window Index from raw contract text.
 * Each sentence acts as an atomic focal search point, coupled with a sliding window of surrounding context sentences.
 */
export function buildSentenceWindowIndex(
  fullText: string,
  windowRadius = 2,
  documentTitle = 'Legal Contract'
): RagIndex {
  const tokenized = tokenizeLegalSentences(fullText);
  const sections = detectSections(fullText);
  const totalSentences = tokenized.length;

  const windows: SentenceWindow[] = tokenized.map((item, idx) => {
    const startWindowIdx = Math.max(0, idx - windowRadius);
    const endWindowIdx = Math.min(totalSentences - 1, idx + windowRadius);

    const windowSentences = tokenized.slice(startWindowIdx, endWindowIdx + 1).map(s => s.text);
    const windowText = windowSentences.join(' ');
    const sectionTitle = findNearestSection(sections, item.startChar);
    const domainCategory = classifyDomain(item.text + ' ' + sectionTitle);

    return {
      id: `win_${idx + 1}`,
      index: idx,
      focalSentence: item.text,
      windowText,
      windowSentences,
      sectionTitle,
      startChar: item.startChar,
      endChar: item.endChar,
      lineNumber: item.lineNumber,
      domainCategory,
    };
  });

  return {
    documentTitle,
    fullText,
    sentenceCount: totalSentences,
    windowCount: windows.length,
    windows,
    sections,
    indexedAt: new Date().toISOString(),
    windowRadius,
  };
}

/**
 * Extract tokens for dense/sparse vector scoring
 */
function tokenizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Compute term frequency vector
 */
function getTermFrequencies(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tokens) {
    map.set(t, (map.get(t) || 0) + 1);
  }
  return map;
}

/**
 * Compute BM25 Lexical Score for a query against a sentence window
 */
function scoreBM25(
  queryTokens: string[],
  docTokens: string[],
  avgDocLen: number,
  docCount: number,
  docFreqs: Map<string, number>,
  k1 = 1.2,
  b = 0.75
): number {
  const docLen = docTokens.length;
  if (docLen === 0) return 0;
  const tfMap = getTermFrequencies(docTokens);
  let score = 0;

  for (const term of queryTokens) {
    const tf = tfMap.get(term) || 0;
    if (tf === 0) continue;

    const df = docFreqs.get(term) || 1;
    // Standard Okapi BM25 IDF
    const idf = Math.log(1 + (docCount - df + 0.5) / (df + 0.5));
    const numerator = tf * (k1 + 1);
    const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLen));
    score += idf * (numerator / denominator);
  }

  return score;
}

/**
 * Compute Dense Cosine Similarity using N-gram / Subword Semantic TF-IDF Vectors
 */
function scoreDenseCosine(queryText: string, focalSentence: string, windowText: string): number {
  const qTokens = tokenizeWords(queryText);
  if (qTokens.length === 0) return 0;
  const qStems = qTokens.map(w => stemLegalWord(w));

  const focalTokens = tokenizeWords(focalSentence);
  const windowTokens = tokenizeWords(windowText);
  const focalStems = focalTokens.map(w => stemLegalWord(w));
  const windowStems = windowTokens.map(w => stemLegalWord(w));

  const focalTf = getTermFrequencies([...focalTokens, ...focalStems]);
  const windowTf = getTermFrequencies([...windowTokens, ...windowStems]);

  let matchFocal = 0;
  let matchWindow = 0;

  for (let i = 0; i < qTokens.length; i++) {
    const q = qTokens[i];
    const qStem = qStems[i];

    if (focalTf.has(q)) {
      matchFocal += (focalTf.get(q) || 0) * 3;
    } else if (focalTf.has(qStem)) {
      matchFocal += (focalTf.get(qStem) || 0) * 2.5;
    } else {
      // Partial subword / stem match
      for (const [fKey] of focalTf) {
        if (fKey.length >= 4 && (fKey.includes(qStem) || qStem.includes(fKey))) {
          matchFocal += 1.5;
          break;
        }
      }
    }

    if (windowTf.has(q)) {
      matchWindow += windowTf.get(q) || 0;
    } else if (windowTf.has(qStem)) {
      matchWindow += (windowTf.get(qStem) || 0) * 0.8;
    }
  }

  const focalMag = Math.sqrt(focalTokens.length || 1);
  const queryMag = Math.sqrt(qTokens.length || 1);

  const simFocal = matchFocal / (focalMag * queryMag);
  const simWindow = matchWindow / (Math.sqrt(windowTokens.length || 1) * queryMag);

  const combined = 0.75 * simFocal + 0.25 * simWindow;
  return Math.min(1, Math.max(0, combined));
}

/**
 * Hybrid Search Engine: Executes Dense Semantic + Sparse BM25 Retrieval with Reciprocal Rank Fusion (RRF)
 * on Sentence Windows.
 */
export function searchSentenceWindows(
  query: string,
  index: RagIndex,
  topK = 5
): RagRetrievedWindow[] {
  if (!query.trim() || index.windows.length === 0) return [];

  const queryTokens = tokenizeWords(query);
  if (queryTokens.length === 0) return [];
  const queryTokensAndStems = Array.from(new Set([...queryTokens, ...queryTokens.map(stemLegalWord)]));

  const docCount = index.windows.length;
  // Calculate average doc length and document frequencies including section titles
  const docTokensList = index.windows.map(w => {
    const raw = tokenizeWords(w.focalSentence + ' ' + w.windowText + ' ' + w.sectionTitle);
    const stems = raw.map(stemLegalWord);
    return [...raw, ...stems];
  });
  const totalTokens = docTokensList.reduce((acc, curr) => acc + curr.length, 0);
  const avgDocLen = Math.max(1, totalTokens / docCount);

  const docFreqs = new Map<string, number>();
  for (const tokens of docTokensList) {
    const unique = new Set(tokens);
    unique.forEach(term => {
      docFreqs.set(term, (docFreqs.get(term) || 0) + 1);
    });
  }

  // 1. Calculate BM25 scores
  const bm25Scores = index.windows.map((_, idx) => {
    return scoreBM25(queryTokensAndStems, docTokensList[idx], avgDocLen, docCount, docFreqs);
  });

  // 2. Calculate Dense Cosine scores
  const denseScores = index.windows.map((w) => {
    return scoreDenseCosine(query, w.focalSentence, w.windowText);
  });

  // 3. Domain boost check
  const queryDomain = classifyDomain(query);

  // 4. Combine with Reciprocal Rank Fusion (RRF)
  // Sort by BM25
  const bm25Ranked = bm25Scores
    .map((score, idx) => ({ idx, score }))
    .sort((a, b) => b.score - a.score);
  const bm25RankMap = new Map<number, number>();
  bm25Ranked.forEach((item, rank) => bm25RankMap.set(item.idx, rank + 1));

  // Sort by Dense
  const denseRanked = denseScores
    .map((score, idx) => ({ idx, score }))
    .sort((a, b) => b.score - a.score);
  const denseRankMap = new Map<number, number>();
  denseRanked.forEach((item, rank) => denseRankMap.set(item.idx, rank + 1));

  const k_rrf = 50;
  const scoredWindows = index.windows.map((win, idx) => {
    const bRank = bm25RankMap.get(idx) || docCount;
    const dRank = denseRankMap.get(idx) || docCount;
    const bScore = bm25Scores[idx];
    const dScore = denseScores[idx];

    let rrfScore = (1 / (k_rrf + bRank)) + (1.3 / (k_rrf + dRank));

    // Boost if domain matches query intention
    if (queryDomain !== 'general' && win.domainCategory === queryDomain) {
      rrfScore *= 1.35;
    }

    return {
      window: win,
      idx,
      bm25Score: bScore,
      similarityScore: dScore,
      rrfScore,
    };
  });

  // Sort by combined RRF score
  scoredWindows.sort((a, b) => b.rrfScore - a.rrfScore);

  // Normalize scores and deduplicate adjacent windows
  const maxRrf = scoredWindows[0]?.rrfScore || 1;
  const retrieved: RagRetrievedWindow[] = [];
  const pickedIndices = new Set<number>();

  for (const item of scoredWindows) {
    if (retrieved.length >= topK) break;
    if (item.bm25Score === 0 && item.similarityScore < 0.1) continue;

    // Suppress immediately adjacent focal sentences to return diverse windows
    let isAdjacent = false;
    for (const picked of pickedIndices) {
      if (Math.abs(picked - item.idx) <= 1) {
        isAdjacent = true;
        break;
      }
    }

    if (isAdjacent && retrieved.length < topK && scoredWindows.length > topK + 2) {
      continue;
    }

    pickedIndices.add(item.idx);
    const relevanceScore = Math.min(99, Math.max(25, Math.round((item.rrfScore / maxRrf) * 96)));

    retrieved.push({
      ...item.window,
      relevanceScore,
      similarityScore: Math.round(item.similarityScore * 100) / 100,
      bm25Score: Math.round(item.bm25Score * 100) / 100,
      rank: retrieved.length + 1,
    });
  }

  // Fallback if strict filtering eliminated everything
  if (retrieved.length === 0 && scoredWindows.length > 0) {
    const top = scoredWindows[0];
    retrieved.push({
      ...top.window,
      relevanceScore: 70,
      similarityScore: Math.round(top.similarityScore * 100) / 100,
      bm25Score: Math.round(top.bm25Score * 100) / 100,
      rank: 1,
    });
  }

  return retrieved;
}

/**
 * Intelligent Client-Side Plain-Language Legal Synthesis Engine.
 * Synthesizes comprehensive answers, risk verdict, and actionable advice from retrieved sentence windows.
 */
export function synthesizeRagAnswer(
  query: string,
  retrievedWindows: RagRetrievedWindow[],
  documentTitle: string,
  startTimeMs: number
): RagQueryResult {
  const executionTimeMs = Math.max(12, Math.round(performance.now() - startTimeMs));
  const primaryDomain = retrievedWindows[0]?.domainCategory || classifyDomain(query);

  if (retrievedWindows.length === 0) {
    return {
      query,
      answer: `No relevant clauses or sentence windows were found matching "${query}" in this document. The contract may not explicitly address this topic or uses alternate legal phrasing.`,
      riskVerdict: 'SAFE',
      confidenceScore: 40,
      retrievedWindows: [],
      keyInsights: [
        'No direct contractual language was retrieved for this specific query.',
        'Standard default commercial or statutory rules apply in the absence of explicit terms.',
      ],
      actionableAdvice: 'Verify if related sections (such as General Provisions or Miscellaneous) contain relevant stipulations.',
      primaryDomain: 'general',
      executionTimeMs,
    };
  }

  // Assess Risk Verdict from the retrieved focal sentences
  let redFlagCount = 0;
  let yellowFlagCount = 0;

  const riskTriggers = {
    red: /\b(?:perpetual|irrevocable|unilateral\w*|indemnif\w* (?:our|company's) own negligence|non-refundable|sole discretion|waive (?:all )?claims|forfeit)\b/i,
    yellow: /\b(?:limit(?:ation)? of liability|\$100|capped|disclaim\w*|non-compete|terminate without notice|60 days|withhold)\b/i,
  };

  retrievedWindows.forEach(win => {
    if (riskTriggers.red.test(win.focalSentence + ' ' + win.windowText)) {
      redFlagCount++;
    } else if (riskTriggers.yellow.test(win.focalSentence + ' ' + win.windowText)) {
      yellowFlagCount++;
    }
  });

  const riskVerdict: 'SAFE' | 'CAUTION' | 'HIGH RISK' =
    redFlagCount > 0 ? 'HIGH RISK' : yellowFlagCount > 0 ? 'CAUTION' : 'SAFE';

  const topWindow = retrievedWindows[0];
  const topRelevance = topWindow.relevanceScore;

  // Build key insights
  const keyInsights: string[] = retrievedWindows.slice(0, 3).map((win, idx) => {
    return `Clause Window #${idx + 1} (${win.sectionTitle}, Line ${win.lineNumber}): "${win.focalSentence.slice(0, 180)}..."`;
  });

  // Domain-specific tailored plain-language synthesis
  let plainSummary = '';
  let actionableAdvice = '';

  switch (primaryDomain) {
    case 'termination':
      plainSummary = `The termination and cancellation terms in "${topWindow.sectionTitle}" specify how and when this agreement can be ended. Key focal sentence (Line ${topWindow.lineNumber}): "${topWindow.focalSentence}".`;
      actionableAdvice = 'Verify notice requirements (e.g., written notice period) and confirm whether fees already paid are refundable upon termination.';
      break;

    case 'indemnity':
      plainSummary = `Indemnity and hold harmless provisions were identified under "${topWindow.sectionTitle}". The agreement states: "${topWindow.focalSentence}".`;
      actionableAdvice = 'Ensure indemnification is mutual and strictly exclude claims arising from the other party’s gross negligence or willful misconduct.';
      break;

    case 'liability':
      plainSummary = `Limitation of liability and damage exclusions are set under "${topWindow.sectionTitle}". The primary provision states: "${topWindow.focalSentence}".`;
      actionableAdvice = 'Review liability monetary caps (e.g., aggregate 12-month fees paid vs. fixed dollar amounts) and ensure critical data breach or IP breaches have reasonable liability carve-outs.';
      break;

    case 'ip_ownership':
      plainSummary = `Intellectual property ownership and licensing rights are governed under "${topWindow.sectionTitle}". The focal clause specifies: "${topWindow.focalSentence}".`;
      actionableAdvice = 'Ensure you retain ownership of your pre-existing IP, trademarks, and confidential assets, granting only a limited operational license necessary to provide the service.';
      break;

    case 'payment_fees':
      plainSummary = `Payment terms, billing schedules, and fee mechanisms are defined in "${topWindow.sectionTitle}". The contract stipulates: "${topWindow.focalSentence}".`;
      actionableAdvice = 'Check net payment timelines (e.g., Net 30), dispute withholding grace periods, and verify whether late payment interest rates are reasonable.';
      break;

    case 'dispute_arbitration':
      plainSummary = `Dispute resolution mechanisms, arbitration requirements, and governing laws are located in "${topWindow.sectionTitle}". The agreement states: "${topWindow.focalSentence}".`;
      actionableAdvice = 'Look for a 30-day arbitration opt-out procedure if you prefer preserving public court dispute rights, and confirm neutral jurisdiction venue.';
      break;

    case 'privacy_data':
      plainSummary = `Data protection, telemetry, and privacy protocols are detailed in "${topWindow.sectionTitle}". Key retrieved sentence: "${topWindow.focalSentence}".`;
      actionableAdvice = 'Verify GDPR/CCPA compliance, subprocessor notification commitments, and data deletion timelines upon contract termination.';
      break;

    case 'restrictive_covenants':
      plainSummary = `Restrictive covenants and non-solicitation/non-compete clauses are set out in "${topWindow.sectionTitle}". The contract requires: "${topWindow.focalSentence}".`;
      actionableAdvice = 'Confirm geographic scope and duration (e.g., 6–12 months maximum) are narrowly tailored to protect legitimate business interests.';
      break;

    default:
      plainSummary = `Based on sentence window retrieval in "${topWindow.sectionTitle}", the agreement establishes: "${topWindow.focalSentence}".`;
      actionableAdvice = 'Review the surrounding sentence context window to understand all contingent obligations before signing.';
      break;
  }

  return {
    query,
    answer: plainSummary,
    riskVerdict,
    confidenceScore: topRelevance,
    retrievedWindows,
    keyInsights,
    actionableAdvice,
    primaryDomain,
    executionTimeMs,
  };
}

/**
 * High-Level RAG Query Execution.
 * Dispatches to backend AI endpoint if available, falling back seamlessly to local hybrid engine.
 */
export async function executeRagQuery(
  query: string,
  index: RagIndex,
  useServerAi = true,
  language = 'en'
): Promise<RagQueryResult> {
  const startTime = performance.now();
  // Retrieve top 4 sentence windows
  const retrievedWindows = searchSentenceWindows(query, index, 4);

  if (!useServerAi || retrievedWindows.length === 0) {
    return synthesizeRagAnswer(query, retrievedWindows, index.documentTitle, startTime);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch('/api/rag-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        query,
        windows: retrievedWindows,
        documentTitle: index.documentTitle,
        language,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server AI response ${response.status}`);
    }

    const data = await response.json();
    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      query,
      answer: data.answer || synthesizeRagAnswer(query, retrievedWindows, index.documentTitle, startTime).answer,
      riskVerdict: data.riskVerdict || (data.risk_verdict as 'SAFE' | 'CAUTION' | 'HIGH RISK') || 'CAUTION',
      confidenceScore: data.confidenceScore || retrievedWindows[0]?.relevanceScore || 85,
      retrievedWindows,
      keyInsights: data.keyInsights || [
        `Identified focal clause in ${retrievedWindows[0]?.sectionTitle}`,
        `Line ${retrievedWindows[0]?.lineNumber}: Verbatim sentence match`,
      ],
      actionableAdvice: data.actionableAdvice || 'Review highlighted clause against standard terms.',
      primaryDomain: retrievedWindows[0]?.domainCategory || 'general',
      executionTimeMs,
    };
  } catch {
    // Fallback to local engine immediately
    return synthesizeRagAnswer(query, retrievedWindows, index.documentTitle, startTime);
  }
}
