import { describe, expect, it } from 'vitest';
import { generateNegotiationProposal } from '../proposals';
import type { Clause } from '../../types/contract';

describe('generateNegotiationProposal (Counter-Clause & Redlines)', () => {
  it('should generate balanced IP ownership redline for perpetual license clause', () => {
    const clause: Clause = {
      title: 'Perpetual Content License & IP Assignment',
      plain_english: 'Company owns all uploaded user content forever.',
      risk_level: 'red',
      risk_label: 'IP Grab',
      what_to_do: 'Refuse perpetual license.',
      quote: 'You grant company a perpetual, irrevocable, worldwide license to use and train AI on all user content.',
    };

    const result = generateNegotiationProposal(clause, 'CreativeSaaS Terms');

    expect(result.redline).toContain('User retains all right, title, and interest in and to User Content');
    expect(result.rationale).toContain('perpetual and broad rights');
    expect(result.emailDraft).toContain('Subject: Proposed Amendment to Perpetual Content License & IP Assignment');
    expect(result.emailDraft).toContain('CreativeSaaS Terms');
  });

  it('should generate reasonable auto-renewal redline for tight cancellation traps', () => {
    const clause: Clause = {
      title: 'Auto-Renewal & Strict Non-Refundable Billing',
      plain_english: 'Non-refundable automatic renewals.',
      risk_level: 'red',
      risk_label: 'Auto-Renewal',
      what_to_do: 'Demand 30-day notice.',
      quote: 'Subscriptions auto-renew and all charges are strictly non-refundable.',
    };

    const result = generateNegotiationProposal(clause, 'Billing Terms');

    expect(result.redline).toContain('Subscriptions may be cancelled at any time');
    expect(result.redline).toContain('pro-rata refund');
    expect(result.emailDraft).toContain('Proposed Replacement Language:');
  });

  it('should generate balanced liability cap redline for severe $50 disclaimers', () => {
    const clause: Clause = {
      title: 'Limitation of Liability ($50 Cap)',
      plain_english: 'Liability capped at $50.',
      risk_level: 'yellow',
      risk_label: 'Severe Cap',
      what_to_do: 'Negotiate 12-month fee cap.',
      quote: 'Cumulative liability shall not exceed fifty dollars ($50.00).',
    };

    const result = generateNegotiationProposal(clause, 'Client Agreement');

    expect(result.redline).toContain('twelve (12) months preceding the incident');
    expect(result.rationale).toContain('nominal liability cap');
  });
});
