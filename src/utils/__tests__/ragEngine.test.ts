import { describe, expect, it } from 'vitest';
import {
  buildSentenceWindowIndex,
  classifyDomain,
  detectSections,
  searchSentenceWindows,
  synthesizeRagAnswer,
  tokenizeLegalSentences,
} from '../ragEngine';

const SAMPLE_LEGAL_TEXT = `
SECTION 1. DEFINITIONS AND SCOPE
This Master Agreement is entered into by CloudCorp Inc. and Customer. The platform is provided as an enterprise service.

SECTION 2. FEES AND PAYMENT TERMS
Customer shall pay all subscription fees within thirty (30) days of invoice date. Any overdue payments shall accrue interest at 1.5% per month. Late fees apply immediately.

SECTION 3. INDEMNIFICATION AND LIABILITIES
Customer shall defend, indemnify, and hold harmless CloudCorp Inc. against all third-party claims, liabilities, and defense legal costs. CloudCorp's aggregate liability under this agreement shall be strictly capped at $100.00.

SECTION 4. TERM AND TERMINATION
Either party may terminate this agreement upon sixty (60) days written notice. Upon termination, all licenses granted hereunder shall immediately cease.
`;

describe('RAG Engine & Sentence Window Parsing', () => {
  it('should tokenize sentences without breaking on abbreviations or clause numbers', () => {
    const text = 'CloudCorp Inc. provides services under Sec. 4.1 for $5,000.00 per month. Customer agrees to pay promptly.';
    const sentences = tokenizeLegalSentences(text);
    expect(sentences.length).toBe(2);
    expect(sentences[0].text).toContain('CloudCorp Inc.');
    expect(sentences[0].text).toContain('$5,000.00');
    expect(sentences[1].text).toContain('Customer agrees to pay promptly.');
  });

  it('should detect legal section headings accurately', () => {
    const sections = detectSections(SAMPLE_LEGAL_TEXT);
    expect(sections.length).toBeGreaterThanOrEqual(4);
    expect(sections[0].title).toContain('SECTION 1');
    expect(sections[1].title).toContain('SECTION 2');
  });

  it('should classify legal domains correctly', () => {
    expect(classifyDomain('Customer shall indemnify and hold harmless the company.')).toBe('indemnity');
    expect(classifyDomain('The total cumulative liability is capped at $500.')).toBe('liability');
    expect(classifyDomain('Either party may terminate this agreement with 30 days notice.')).toBe('termination');
    expect(classifyDomain('Invoices are payable net 30 days with interest.')).toBe('payment_fees');
    expect(classifyDomain('All disputes shall be settled by binding arbitration in New York.')).toBe('dispute_arbitration');
  });

  it('should build sentence window index with focal and surrounding context', () => {
    const index = buildSentenceWindowIndex(SAMPLE_LEGAL_TEXT, 2, 'Test Contract');
    expect(index.sentenceCount).toBeGreaterThanOrEqual(7);
    expect(index.windows.length).toBe(index.sentenceCount);

    const firstWindow = index.windows[0];
    expect(firstWindow.focalSentence).toBeDefined();
    expect(firstWindow.windowText).toBeDefined();
    expect(firstWindow.windowSentences.length).toBeGreaterThanOrEqual(1);
    expect(firstWindow.lineNumber).toBeGreaterThanOrEqual(1);
  });

  it('should execute hybrid retrieval for termination queries', () => {
    const index = buildSentenceWindowIndex(SAMPLE_LEGAL_TEXT, 2, 'Test Contract');
    const results = searchSentenceWindows('Summarize the termination clause and cancellation notice', index, 3);

    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.domainCategory).toBe('termination');
    expect(topResult.focalSentence.toLowerCase()).toContain('terminate');
    expect(topResult.relevanceScore).toBeGreaterThan(50);
  });

  it('should execute hybrid retrieval for indemnity queries', () => {
    const index = buildSentenceWindowIndex(SAMPLE_LEGAL_TEXT, 2, 'Test Contract');
    const results = searchSentenceWindows('Identify indemnity liabilities and hold harmless', index, 3);

    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.domainCategory).toBe('indemnity');
    expect(topResult.focalSentence.toLowerCase()).toContain('indemnif');
  });

  it('should synthesize legal answers with risk verdict and actionable advice', () => {
    const index = buildSentenceWindowIndex(SAMPLE_LEGAL_TEXT, 2, 'Test Contract');
    const results = searchSentenceWindows('What are the indemnity obligations?', index, 3);
    const synthesized = synthesizeRagAnswer('What are the indemnity obligations?', results, 'Test Contract', performance.now());

    expect(synthesized.riskVerdict).toBeDefined();
    expect(synthesized.answer).toContain('Indemnity');
    expect(synthesized.actionableAdvice).toBeDefined();
    expect(synthesized.keyInsights.length).toBeGreaterThan(0);
  });
});
