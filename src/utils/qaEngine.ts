import type { Analysis, Clause } from '../types/contract';

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
  'why', 'will', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'pls', 'please', 'tell'
]);

export type QaResult = {
  answer: string;
  matchedClause: Clause | null;
  riskVerdict: 'Safe' | 'Caution' | 'High Risk';
  suggestedPrompts?: string[];
};

// Ask This Contract Semantic Engine
export function answerContractQuestion(question: string, analysis: Analysis): QaResult {
  const q = question.trim().toLowerCase();
  if (!q) {
    return {
      answer: 'Ask any question about cancellations, copyright, fees, liability, or privacy to get an instant cited answer.',
      matchedClause: null,
      riskVerdict: 'Safe',
    };
  }

  // 1. Overall Evaluation / Best / Worst / Summary
  if (/^(what is the |what's the )?(best|good|positive|fair|safest|pro|advantage)/i.test(q) || q === 'best' || q === 'best thing' || q.includes('best part') || q.includes('best thing')) {
    const greenClauses = analysis.clauses.filter(c => c.risk_level === 'green');
    if (greenClauses.length > 0) {
      const topGreen = greenClauses[0];
      return {
        answer: `The fairest provision in this agreement is "${topGreen.title}": ${topGreen.plain_english} Overall, this document contains ${analysis.green_count} standard/consumer-friendly clauses.`,
        matchedClause: topGreen,
        riskVerdict: 'Safe',
      };
    }
    return {
      answer: `This contract contains heavily one-sided terms with 0 standard green clauses. We found ${analysis.red_count} high-risk red flags and ${analysis.yellow_count} caution areas.`,
      matchedClause: analysis.clauses[0] || null,
      riskVerdict: 'High Risk',
    };
  }

  if (/^(what is the |what's the )?(worst|bad|dangerous|riskiest|trap|catch|con|negative)/i.test(q) || q === 'worst' || q === 'worst thing' || q.includes('worst part') || q.includes('biggest risk')) {
    const redClauses = analysis.clauses.filter(c => c.risk_level === 'red');
    const yellowClauses = analysis.clauses.filter(c => c.risk_level === 'yellow');
    const topRisk = redClauses[0] || yellowClauses[0];
    if (topRisk) {
      return {
        answer: `The primary risk in this agreement is "${topRisk.title}" [${topRisk.risk_label.toUpperCase()}]: ${topRisk.plain_english} What to do: ${topRisk.what_to_do}`,
        matchedClause: topRisk,
        riskVerdict: topRisk.risk_level === 'red' ? 'High Risk' : 'Caution',
      };
    }
    return {
      answer: `Good news: No high-risk predatory traps were flagged in this contract. All ${analysis.clauses.length} audited clauses follow standard consumer practices.`,
      matchedClause: null,
      riskVerdict: 'Safe',
    };
  }

  if (/^(summary|overview|explain this contract|is it safe|should i sign)/i.test(q) || q === 'summary') {
    const verdict = analysis.red_count > 0 ? 'High Risk' : analysis.yellow_count > 1 ? 'Caution' : 'Safe';
    return {
      answer: `Contract Audit for ${analysis.title}: Identified ${analysis.red_count} Red Flags, ${analysis.yellow_count} Caution areas, and ${analysis.green_count} Standard clauses. ${analysis.red_count > 0 ? 'Proceed with caution and review highlighted red flags before signing.' : 'The contract terms are reasonably balanced.'}`,
      matchedClause: null,
      riskVerdict: verdict,
    };
  }

  // 2. Specific Semantic Topics with High-Precision Filters
  const topicMap = [
    {
      regex: /cancel|cancellation|refund|renew|renewal|subscription|auto-renew|quit|exit|unsubscribe/i,
      filter: /renew|cancel|refund|subscription|billing/i,
      topicName: 'Cancellation, Refunds & Renewal',
      notFoundMsg: 'No aggressive cancellation traps or tight renewal deadlines were flagged in the audited sections.',
    },
    {
      regex: /payment|milestone|withhold|fee|price|cost|billing|invoice|rate|paid|pay|compensation|salary|money/i,
      filter: /payment|milestone|withhold|fee|price|cost|billing|invoice|compensation|paid|pay/i,
      topicName: 'Payment Terms & Milestone Billing',
      notFoundMsg: 'Standard payment terms apply. No predatory withholding or penalty provisions were flagged.',
    },
    {
      regex: /deliver|delivery|deadline|late|penalty|penalties/i,
      filter: /penalty|delay|late|milestone|deliver|deadline/i,
      topicName: 'Delivery Deadlines & Penalties',
      notFoundMsg: 'No aggressive late penalties or tight delivery clauses were detected.',
    },
    {
      regex: /ip|intellectual property|own|ownership|copyright|content|code|design|upload|license|perpetual|assign|deliverables|work product|derivative|portfolio|model|train/i,
      filter: /ip|content|copyright|license|perpetual|assign|deliverables|work product|proprietary|portfolio|training/i,
      topicName: 'Intellectual Property & Content Ownership',
      notFoundMsg: 'Standard IP provisions detected. No extreme perpetual content grab was flagged in the audited sections.',
    },
    {
      regex: /data|privacy|tracking|share|sell|telemetry|cookies|profiling|broker|gdpr|ccpa|retention/i,
      filter: /data|privacy|tracking|share|sell|telemetry|cookies|profil|retention/i,
      topicName: 'Data Privacy & Tracking',
      notFoundMsg: 'No behavioral data selling or aggressive tracking clauses were flagged in this document.',
    },
    {
      regex: /liability|damage|damages|cap|sue|court|arbitrat|dispute|indemnif|negligence|loss|lawsuit|penalty/i,
      filter: /liability|damages|arbitrat|dispute|court|negligence|indemnif|penalty|cap|delays/i,
      topicName: 'Liability, Indemnity & Legal Disputes',
      notFoundMsg: 'Standard governing law and dispute procedures apply. No asymmetric waivers or harsh liability caps were detected.',
    },
    {
      regex: /revision|scope|amend|modify|change|update|notice/i,
      filter: /revision|scope|amend|modify|change|update|unilateral/i,
      topicName: 'Revisions & Modifications',
      notFoundMsg: 'No unilateral modification traps were identified in this agreement.',
    },
    {
      regex: /terminat|suspend|ban|close|forfeit|exit/i,
      filter: /terminat|suspend|convenience|notice|exit/i,
      topicName: 'Termination & Account Suspension',
      notFoundMsg: 'Standard termination procedures apply.',
    },
  ];

  for (const topic of topicMap) {
    if (topic.regex.test(q)) {
      const match = analysis.clauses.find(c => topic.filter.test(c.title + ' ' + c.plain_english + ' ' + c.quote + ' ' + c.risk_label));
      if (match) {
        const riskVerdict = match.risk_level === 'red' ? 'High Risk' : match.risk_level === 'yellow' ? 'Caution' : 'Safe';
        return {
          answer: `Regarding ${topic.topicName.toLowerCase()} in "${match.title}": ${match.plain_english} What to do: ${match.what_to_do}`,
          matchedClause: match,
          riskVerdict,
        };
      } else {
        return {
          answer: `Regarding ${topic.topicName.toLowerCase()}: ${topic.notFoundMsg}`,
          matchedClause: null,
          riskVerdict: 'Safe',
        };
      }
    }
  }

  // 3. Keyword Scoring across all clauses
  const tokens = q
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  if (tokens.length > 0) {
    let bestClause: Clause | null = null;
    let bestScore = 0;

    for (const clause of analysis.clauses) {
      let score = 0;
      const titleLower = clause.title.toLowerCase();
      const plainLower = clause.plain_english.toLowerCase();
      const quoteLower = clause.quote.toLowerCase();
      const labelLower = clause.risk_label.toLowerCase();

      for (const t of tokens) {
        if (titleLower.includes(t)) score += 5;
        if (labelLower.includes(t)) score += 4;
        if (plainLower.includes(t)) score += 3;
        if (quoteLower.includes(t)) score += 2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestClause = clause;
      }
    }

    if (bestClause && bestScore >= 3) {
      const riskVerdict = bestClause.risk_level === 'red' ? 'High Risk' : bestClause.risk_level === 'yellow' ? 'Caution' : 'Safe';
      return {
        answer: `Based on clause "${bestClause.title}" [${bestClause.risk_label.toUpperCase()}]: ${bestClause.plain_english} What to do: ${bestClause.what_to_do}`,
        matchedClause: bestClause,
        riskVerdict,
      };
    }
  }

  // 4. Graceful Fallback with Suggested Topics
  const sampleSuggestions = analysis.clauses.slice(0, 3).map(c => `"${c.title}"`).join(', ');
  return {
    answer: `No specific clause in this agreement directly addresses "${question}". The analyzed contract covers: ${sampleSuggestions}. Try asking about cancellations, IP rights, payment terms, or liability limits.`,
    matchedClause: null,
    riskVerdict: 'Caution',
    suggestedPrompts: [
      'Who owns the intellectual property I create?',
      'Can I cancel anytime without penalty?',
      'What are the liability limits if something breaks?',
      'What is the biggest risk in this contract?',
    ],
  };
}
