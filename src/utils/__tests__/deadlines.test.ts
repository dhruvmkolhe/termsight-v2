import { describe, expect, it } from 'vitest';
import { createGoogleCalendarUrl, extractContractDeadlines } from '../deadlines';
import type { Analysis } from '../../types/contract';

describe('extractContractDeadlines & Calendar Integration', () => {
  it('should detect arbitration 30-day opt-out deadline when arbitration clause exists', () => {
    const analysis: Analysis = {
      id: 'arb-test',
      title: 'SaaS Agreement',
      source_text: 'All disputes shall be resolved via binding individual arbitration.',
      clauses: [
        {
          title: 'Mandatory Binding Arbitration',
          plain_english: 'Disputes resolved by arbitration.',
          risk_level: 'red',
          risk_label: 'Arbitration',
          what_to_do: 'Opt out within 30 days.',
          quote: 'Disputes resolved exclusively via binding individual arbitration.',
        },
      ],
      red_count: 1,
      yellow_count: 0,
      green_count: 0,
      created_at: new Date().toISOString(),
    };

    const deadlines = extractContractDeadlines(analysis, analysis.source_text);
    const arbDeadline = deadlines.find(d => d.id === 'arbitration-optout');

    expect(arbDeadline).toBeDefined();
    expect(arbDeadline?.title).toContain('Arbitration Opt-Out');
    expect(arbDeadline?.urgency).toBe('high');
  });

  it('should detect cancellation & auto-renewal window', () => {
    const source = 'Subscriptions automatically renew unless cancelled at least 5 business days prior to renewal.';
    const analysis: Analysis = {
      id: 'renew-test',
      title: 'Auto-Renew Contract',
      source_text: source,
      clauses: [
        {
          title: 'Auto-Renewal Terms',
          plain_english: 'Must cancel 5 days before renewal.',
          risk_level: 'red',
          risk_label: 'Renewal',
          what_to_do: 'Set reminder.',
          quote: source,
        },
      ],
      red_count: 1,
      yellow_count: 0,
      green_count: 0,
      created_at: new Date().toISOString(),
    };

    const deadlines = extractContractDeadlines(analysis, source);
    const cancelDeadline = deadlines.find(d => d.id === 'cancel-renewal');

    expect(cancelDeadline).toBeDefined();
    expect(cancelDeadline?.category).toBe('cancellation');
  });

  it('should generate a valid Google Calendar URL with encoded parameters', () => {
    const item = {
      id: 'test-item',
      title: 'Cancel Subscription',
      category: 'cancellation' as const,
      timeframe: '5 days before',
      daysOffset: 25,
      description: 'Cancel before renewal cycle.',
      quote: 'Must cancel 5 days prior.',
      urgency: 'high' as const,
    };

    const gcalUrl = createGoogleCalendarUrl(item, 'CloudSaaS Agreement');

    expect(gcalUrl).toContain('https://calendar.google.com/calendar/render');
    expect(gcalUrl).toContain('action=TEMPLATE');
    expect(gcalUrl).toContain(encodeURIComponent('Contract Deadline: Cancel Subscription (CloudSaaS Agreement)'));
    expect(gcalUrl).toContain('dates=');
  });
});
