import type { Clause } from '../types/contract';

export type NegotiationProposal = {
  redline: string;
  emailDraft: string;
  rationale: string;
};

// Generate fair counter-clause phrasing and email draft
export function generateNegotiationProposal(clause: Clause, documentTitle: string): NegotiationProposal {
  let redline = '';
  let rationale = '';

  const lowerTitle = clause.title.toLowerCase();
  const lowerQuote = clause.quote.toLowerCase();

  if (lowerTitle.includes('ip') || lowerTitle.includes('content') || lowerQuote.includes('perpetual') || lowerQuote.includes('license')) {
    redline = `"User retains all right, title, and interest in and to User Content. User grants Company a limited, non-exclusive, revocable license solely to host and display User Content as necessary to provide the Service to User. Company shall not sell, license, or use User Content to train AI or machine learning models without express affirmative written consent."`;
    rationale = `The existing clause grants perpetual and broad rights to user-created content. Standard commercial practice grants only the limited license necessary to host the content.`;
  } else if (lowerTitle.includes('auto-renewal') || lowerTitle.includes('cancellation') || lowerQuote.includes('renew')) {
    redline = `"Subscriptions may be cancelled at any time via account settings with immediate effect for future billing periods. Company shall provide email notice at least thirty (30) days prior to any renewal with price changes. If User cancels within seven (7) days of renewal, a pro-rata refund shall be issued upon request."`;
    rationale = `Strict non-refundable terms and narrow cancellation windows violate modern consumer protection norms (e.g., FTC/ROSCA rules).`;
  } else if (lowerTitle.includes('arbitration') || lowerTitle.includes('dispute') || lowerQuote.includes('arbitrat')) {
    redline = `"In the event of a dispute, the parties agree to first engage in good-faith informal negotiations for 30 days. If unresolved, disputes may be submitted to standard judicial courts in the user's home jurisdiction or mutually agreed upon neutral arbitration with costs split equally."`;
    rationale = `Mandatory one-sided arbitration and remote forums place an unreasonable financial hurdle on consumers/contractors.`;
  } else if (lowerTitle.includes('negligence') || lowerTitle.includes('indemnif')) {
    redline = `"Each party shall indemnify and hold harmless the other party against third-party claims arising strictly from the indemnifying party's gross negligence, willful misconduct, or material breach of this Agreement. In no event shall either party indemnify the other for the other party's own negligence."`;
    rationale = `Forcing a user to indemnify a provider for the provider's own negligence is legally unconscionable and unenforceable in many jurisdictions.`;
  } else if (lowerTitle.includes('liability') || lowerQuote.includes('cap') || lowerQuote.includes('$')) {
    redline = `"Except for gross negligence or willful misconduct, each party's maximum aggregate liability arising out of or related to this Agreement shall be limited to the total amounts paid or payable by User under this Agreement in the twelve (12) months preceding the incident giving rise to liability."`;
    rationale = `A nominal liability cap of $50-$100 completely leaves the user unprotected against significant data breaches or service failures.`;
  } else {
    redline = `"The parties agree to amend this section so that all rights, notice periods, and obligations apply mutually and reasonably to both Company and User with at least thirty (30) days advance written notice for any material modifications."`;
    rationale = `Standard contract fairness requires bilateral notice and reasonable terms.`;
  }

  const emailDraft = `Subject: Proposed Amendment to ${clause.title} - ${documentTitle || 'Agreement'}

Dear Legal / Contracting Team,

I have reviewed the agreement and would like to propose a standard revision to the "${clause.title}" section.

Currently, the clause states:
"${clause.quote.slice(0, 200)}..."

Issue:
${rationale}

Proposed Replacement Language:
${redline}

This adjustment ensures mutual fairness and standard commercial protection while allowing our engagement to proceed smoothly. Please let me know if this amendment is acceptable.

Best regards,
[Your Name / Organization]`;

  return { redline, emailDraft, rationale };
}
