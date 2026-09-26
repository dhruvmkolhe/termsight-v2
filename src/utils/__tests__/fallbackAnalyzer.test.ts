import { describe, it, expect } from 'vitest';
import { runClientSideAnalysis, makeFallbackClauses } from '../fallbackAnalyzer';

describe('fallbackAnalyzer', () => {
  it('detects red flag clauses in text', () => {
    const text = `
    1. ARBITRATION & CLASS ACTION WAIVER
    All disputes shall be settled by binding arbitration and user waives right to class action. Notwithstanding the foregoing, Company reserves the right to seek injunctive or equitable relief in any court of competent jurisdiction.
    
    2. INDEMNIFICATION
    User agrees to defend, indemnify and hold harmless Company for Company's own negligence.
    `;

    const clauses = makeFallbackClauses(text);
    expect(clauses.length).toBeGreaterThan(0);
    const redClauses = clauses.filter((c) => c.risk_level === 'red');
    expect(redClauses.length).toBeGreaterThan(0);
  });

  it('generates complete Analysis payload structure', () => {
    const text = 'This is a sample contract for testing purposes with sufficient characters to meet minimum requirements. Standard governing law of California applies. User agrees to maintain account credentials.';
    const analysis = runClientSideAnalysis(text);

    expect(analysis).toHaveProperty('id');
    expect(analysis).toHaveProperty('title');
    expect(analysis).toHaveProperty('clauses');
    expect(analysis).toHaveProperty('red_count');
    expect(analysis).toHaveProperty('yellow_count');
    expect(analysis).toHaveProperty('green_count');
    expect(Array.isArray(analysis.clauses)).toBe(true);
  });
});
