import type { Clause } from '../types/contract';

export type NoticeType = 'arbitration' | 'datapurge' | 'cancellation';

export type LegalNoticeResult = {
  title: string;
  subtitle: string;
  subject: string;
  body: string;
};

export function generateLegalNotice(
  type: NoticeType,
  docTitle: string,
  companyName: string,
  userName: string,
  clauses: Clause[]
): LegalNoticeResult {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const comp = companyName || 'Company / Service Provider';
  const user = userName || '[Your Full Name]';

  if (type === 'arbitration') {
    const arbClause = clauses.find(c => c.title.toLowerCase().includes('arbitrat') || c.quote.toLowerCase().includes('arbitrat'));
    return {
      title: 'Formal 30-Day Mandatory Arbitration Opt-Out Notice',
      subtitle: 'Exercises your statutory right under consumer arbitration rules to preserve civil court and class-action litigation rights.',
      subject: `FORMAL NOTICE: Opt-Out of Mandatory Arbitration - ${docTitle || 'Terms of Service'}`,
      body: `DATE: ${dateStr}

TO:
Legal & Compliance Department
${comp}

FROM:
${user}
[Your Contact Email / Account Identifier]
[Your Physical Address]

RE: FORMAL NOTICE OF ARBITRATION OPT-OUT AND PRESERVATION OF JUDICIAL RIGHTS

Dear Legal Department,

I am writing to provide formal, timely notice under the ${docTitle || 'Terms of Service'} (including any dispute resolution, mandatory binding arbitration, or class-action waiver provisions) that I hereby REJECT and OPT OUT of all mandatory arbitration procedures and class-action waivers.

1. REJECTION OF ARBITRATION:
In accordance with standard consumer protection rights and any 30-day opt-out provisions under your Agreement, I explicitly elect to resolve any past, present, or future disputes, claims, or controversies through standard civil judicial courts of competent jurisdiction rather than private binding arbitration.

2. PRESERVATION OF RIGHTS:
This notice constitutes my full and unequivocal reservation of all constitutional and statutory rights to participate in class actions, jury trials, and ordinary judicial proceedings.

${arbClause ? `Reference to Agreement Clause:\n"${arbClause.quote}"\n` : ''}
Please confirm receipt and record this opt-out in your active customer records for my account within ten (10) business days.

Sincerely,

__________________________________________
${user}
Account Identifier / Email: [Your Email Here]`
    };
  }

  if (type === 'datapurge') {
    return {
      title: 'GDPR / CCPA Data Erasure & AI Training Revocation Request',
      subtitle: 'Demands immediate deletion of uploaded personal data and revokes any license to train AI/ML models on your content.',
      subject: `DATA ERASURE & AI TRAINING REVOCATION REQUEST - ${user}`,
      body: `DATE: ${dateStr}

TO:
Data Protection Officer (DPO) / Privacy Team
${comp}

FROM:
${user}
[Your Contact Email / User ID]

RE: REQUEST FOR ERASURE OF PERSONAL DATA & REVOCATION OF AI/ML TRAINING LICENSES
(Pursuant to GDPR Article 17, Article 21, and CCPA Cal. Civ. Code § 1798.105)

Dear Privacy Officer,

I am formally submitting this request pursuant to applicable data protection regulations (including the EU/UK GDPR Article 17 "Right to Erasure", GDPR Article 21 "Right to Object", and California Consumer Privacy Act § 1798.105).

1. PERMANENT DATA ERASURE:
I request the immediate, permanent deletion and purging of all personal data, user-generated content, audio files, uploaded source code, biometric telemetry, prompt histories, and account identifiers associated with my account from all active databases, backups, and third-party processors.

2. AI / ML MODEL TRAINING REVOCATION:
To the extent that any terms purported to grant a license to use my content or telemetry for training machine learning, foundation, or artificial intelligence models, I hereby REVOKE and WITHDRAW all consent and licenses for such training with immediate effect.

3. CONFIRMATION OF DESTRUCTION:
Please provide written confirmation within thirty (30) days verifying that all requested data has been permanently deleted and that no ongoing data processing or derivative AI training continues.

Sincerely,

__________________________________________
${user}
Account Identifier / Email: [Your Email Here]`
    };
  }

  // cancellation
  return {
    title: 'Formal Contract Cancellation & Billing Revocation Notice',
    subtitle: 'Formally terminates the recurring subscription and revokes credit card / continuous payment authorizations.',
    subject: `FORMAL SUBSCRIPTION TERMINATION & BILLING REVOCATION - ${docTitle || 'Agreement'}`,
    body: `DATE: ${dateStr}

TO:
Billing, Accounts & Customer Support
${comp}

FROM:
${user}
[Your Contact Email / Account Identifier]

RE: FORMAL NOTICE OF IMMEDIATE CONTRACT TERMINATION & REVOCATION OF BILLING AUTHORIZATION

Dear Customer Support & Billing Department,

Please accept this letter as formal written notice of the immediate termination and non-renewal of my subscription and agreement for ${docTitle || 'the service'} associated with account identifier [Your Email / Customer ID].

1. CANCELLATION OF SERVICE:
I hereby exercise my right to cancel all recurring subscription plans, maintenance packages, and ancillary service tiers. No further billing periods or automatic renewals are authorized.

2. REVOCATION OF PAYMENT AUTHORIZATION:
In accordance with FTC rules and payment card network regulations, I explicitly REVOKE all pre-authorized continuous payment authorities, credit card billing mandates, and ACH debit permissions associated with this account. Any subsequent charge will be treated as an unauthorized transaction.

3. CONFIRMATION REQUEST:
Please provide written confirmation of zero remaining balance, confirmation of account cancellation, and verification that no future charges will occur.

Sincerely,

__________________________________________
${user}
Account Identifier / Email: [Your Email Here]`
  };
}
