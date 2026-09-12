export type LegalDomain =
  | 'liability'
  | 'indemnity'
  | 'termination'
  | 'ip_ownership'
  | 'payment_fees'
  | 'dispute_arbitration'
  | 'privacy_data'
  | 'restrictive_covenants'
  | 'unilateral_changes'
  | 'warranties'
  | 'confidentiality'
  | 'general';

export interface SentenceWindow {
  id: string;
  index: number;
  focalSentence: string;
  windowText: string;
  windowSentences: string[];
  sectionTitle: string;
  startChar: number;
  endChar: number;
  lineNumber: number;
  domainCategory: LegalDomain;
}

export interface RagRetrievedWindow extends SentenceWindow {
  relevanceScore: number; // Combined hybrid score [0, 100]
  similarityScore: number; // Dense cosine similarity [0, 1]
  bm25Score: number; // Sparse lexical score
  rank: number;
  highlightedHtml?: string;
}

export interface RagIndex {
  documentTitle: string;
  fullText: string;
  sentenceCount: number;
  windowCount: number;
  windows: SentenceWindow[];
  sections: Array<{ title: string; startIndex: number; endIndex: number }>;
  indexedAt: string;
  windowRadius: number;
}

export interface RagQueryResult {
  query: string;
  answer: string;
  riskVerdict: 'SAFE' | 'CAUTION' | 'HIGH RISK';
  confidenceScore: number;
  retrievedWindows: RagRetrievedWindow[];
  keyInsights: string[];
  actionableAdvice: string;
  primaryDomain: LegalDomain;
  executionTimeMs: number;
}

export interface RagPresetContract {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  wordCount: number;
  text: string;
}

export interface QuickActionQuery {
  id: string;
  iconName: string;
  label: string;
  query: string;
  category: 'high_risk' | 'commercial' | 'disputes' | 'compliance';
  badge: string;
  domain: LegalDomain;
  description: string;
}
