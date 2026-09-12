import { describe, expect, it } from 'vitest';
import { computeFairnessScore } from '../scoring';
import type { Analysis } from '../../types/contract';

describe('computeFairnessScore (Fairness & Health Scorecard)', () => {
  it('should return Grade A (100%) for an empty clause list', () => {
    const analysis: Analysis = {
      id: 1,
      title: 'Empty Contract',
      source_text: '',
      clauses: [],
      red_count: 0,
      yellow_count: 0,
      green_count: 0,
      created_at: new Date().toISOString(),
    };

    const result = computeFairnessScore(analysis);
    expect(result.score).toBe(100);
    expect(result.grade).toBe('A');
    expect(result.label).toContain('Safe');
  });

  it('should return Grade A for 100% green standard clauses', () => {
    const analysis: Analysis = {
      id: 2,
      title: 'Clean EULA',
      source_text: '...',
      clauses: [
        { title: 'C1', plain_english: '...', risk_level: 'green', risk_label: 'Safe', what_to_do: '...', quote: '...' },
        { title: 'C2', plain_english: '...', risk_level: 'green', risk_label: 'Safe', what_to_do: '...', quote: '...' },
        { title: 'C3', plain_english: '...', risk_level: 'green', risk_label: 'Safe', what_to_do: '...', quote: '...' },
      ],
      red_count: 0,
      yellow_count: 0,
      green_count: 3,
      created_at: new Date().toISOString(),
    };

    const result = computeFairnessScore(analysis);
    expect(result.score).toBe(100);
    expect(result.grade).toBe('A');
  });

  it('should calculate weighted score accurately for mixed clauses', () => {
    // 2 green (200), 2 yellow (90), 1 red (0) = 290 / 5 = 58 -> Grade C
    const analysis: Analysis = {
      id: 3,
      title: 'Mixed Terms',
      source_text: '...',
      clauses: [
        { title: 'C1', plain_english: '...', risk_level: 'green', risk_label: 'Safe', what_to_do: '...', quote: '...' },
        { title: 'C2', plain_english: '...', risk_level: 'green', risk_label: 'Safe', what_to_do: '...', quote: '...' },
        { title: 'C3', plain_english: '...', risk_level: 'yellow', risk_label: 'Caution', what_to_do: '...', quote: '...' },
        { title: 'C4', plain_english: '...', risk_level: 'yellow', risk_label: 'Caution', what_to_do: '...', quote: '...' },
        { title: 'C5', plain_english: '...', risk_level: 'red', risk_label: 'High Risk', what_to_do: '...', quote: '...' },
      ],
      red_count: 1,
      yellow_count: 2,
      green_count: 2,
      created_at: new Date().toISOString(),
    };

    const result = computeFairnessScore(analysis);
    expect(result.score).toBe(58);
    expect(result.grade).toBe('C');
    expect(result.label).toContain('Moderate Risk');
  });

  it('should return Grade F for predatory contracts with dominant red flags', () => {
    // 0 green, 1 yellow (45), 4 red (0) = 45 / 5 = 9 -> Grade F
    const analysis: Analysis = {
      id: 4,
      title: 'Predatory Contract',
      source_text: '...',
      clauses: [
        { title: 'C1', plain_english: '...', risk_level: 'red', risk_label: 'IP Grab', what_to_do: '...', quote: '...' },
        { title: 'C2', plain_english: '...', risk_level: 'red', risk_label: 'Arbitration', what_to_do: '...', quote: '...' },
        { title: 'C3', plain_english: '...', risk_level: 'red', risk_label: 'Trap', what_to_do: '...', quote: '...' },
        { title: 'C4', plain_english: '...', risk_level: 'red', risk_label: 'Indemnity', what_to_do: '...', quote: '...' },
        { title: 'C5', plain_english: '...', risk_level: 'yellow', risk_label: 'Cap', what_to_do: '...', quote: '...' },
      ],
      red_count: 4,
      yellow_count: 1,
      green_count: 0,
      created_at: new Date().toISOString(),
    };

    const result = computeFairnessScore(analysis);
    expect(result.score).toBe(9);
    expect(result.grade).toBe('F');
    expect(result.label).toContain('Critical Hazard');
  });
});
