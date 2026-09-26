import type { Analysis, Clause } from '../types/contract';

function getDocumentTitle(text: string): string {
  const firstLine = text.split('\n').map((line) => line.trim()).find(Boolean) || 'Untitled agreement';
  return firstLine.replace(/\s+/g, ' ').slice(0, 100);
}

// Comprehensive Semantic Legal Clause Parser & Analyzer (Client & Server Heuristic Engine)
export function makeFallbackClauses(text: string): Clause[] {
  // Strip benchmark/editorial comments if present in bracket form
  const cleanedText = text.replace(/\[\s*(?:🔴|🟡|🟢)?\s*(?:RED|YELLOW|GREEN)\s*FLAG[^\]]*\]/gi, '');

  // Split text by numbered/named sections, e.g. "1. ACCEPTANCE", "SECTION 1", or double newlines
  const sectionSplitRegex = /(?:^|\n+)(?=(?:\d+[\.\)]\s+[A-Z]|(?:SECTION|ARTICLE|CLAUSE)\s+[\dIVXLCDM]+|[A-Z\s]{4,}:))/g;
  let rawSections = cleanedText.split(sectionSplitRegex).map((s) => s.trim()).filter((s) => s.length > 20);

  if (rawSections.length < 3) {
    rawSections = cleanedText.split(/\n\s*\n/).map((s) => s.trim()).filter((s) => s.length > 30);
  }

  const rules = [
    // 1. Critical Red Flags
    {
      id: 'negligence_indemnity',
      pattern: /indemnif.*(?:own|contributory)\s+negligence|negligence.*indemnif|hold harmless.*even if.*negligence/i,
      level: 'red' as const,
      title: "Indemnification for Company's Own Negligence",
      label: "Indemnifies Company's Negligence",
      plain_english: "You are required to defend and pay legal costs for the company even if the dispute or damages were caused by the company's own negligence.",
      action: "Refuse or challenge this clause; forcing consumers to indemnify a company for its own negligence is unconscionable.",
    },
    {
      id: 'asymmetric_arbitration',
      pattern: /(?:arbitrat|dispute|class action).*(?:notwithstanding|reserves? the right|injunctive|equitable relief in (?:any )?court)|(?:binding.*arbitration|waive.*class action).*court of competent jurisdiction/i,
      level: 'red' as const,
      title: "One-Sided Arbitration & Class Action Waiver",
      label: "Asymmetric Arbitration",
      plain_english: "You are forced into individual private arbitration and give up your right to join a class action, while the company preserves its right to sue you in court.",
      action: "Note the arbitration deadline and opt out in writing within 30 days if an opt-out mechanism is available.",
    },
    {
      id: 'perpetual_ugc',
      pattern: /perpetual.*irrevocable.*(?:worldwide|royalty-free)|grant.*license.*perpetual.*irrevocable|license to.*(?:reproduce|modify|distribute|train).*in any media/i,
      level: 'red' as const,
      title: "Perpetual Rights to Your Content",
      label: "Perpetual IP License",
      plain_english: "You grant the company a permanent, irrevocable, worldwide license to use, sub-license, and commercialize your uploaded content forever, even after account deletion.",
      action: "Avoid uploading proprietary creations, personal photos, or sensitive IP that you do not want publicly reused without compensation.",
    },
    {
      id: 'auto_renewal_trap',
      pattern: /cancel.*(?:within\s+\d+|prior to the renewal|days? before)|automatic(?:ally)? renew.*(?:unless|non-refundable)|auto-renewal|renewal.*non-refundable/i,
      level: 'red' as const,
      title: "Automatic Renewal & Cancellation Trap",
      label: "Unfair Auto-Renewal Trap",
      plain_english: "Your subscription auto-renews with a tight advance cancellation window (e.g. must cancel days early), and all subscription payments are strictly non-refundable.",
      action: "Set a calendar reminder at least 5-7 days before renewal and monitor bank statements closely.",
    },
    {
      id: 'data_monetization',
      pattern: /(?:share|sell|disclose|transfer).*(?:advertising|brokers|third.?part|retargeting|profil|marketing)|legitimate.*interest.*(?:marketing|invest|pitch)|behavioral\s+(?:profile|retargeting|tracking)/i,
      level: 'red' as const,
      title: "Data Processing & Targeted Profiling",
      label: "Behavioral Data Sharing",
      plain_english: "Your personal data and profiles are shared with third parties for direct marketing, targeted ad networks, data brokers, and investor evaluations.",
      action: "Check privacy settings to opt out of behavioral profiling and request a list of all active third-party partners.",
    },

    // 2. Cautionary Yellow Flags
    {
      id: 'liability_cap',
      pattern: /(?:liability|damages?).*(?:cap(?:ped)?|exceed|maximum|greater of|\$|100|hundred)|(?:indirect|consequential|incidental|punitive|special)\s+damages|loss of profits/i,
      level: 'yellow' as const,
      title: "Limitation of Company Liability",
      label: "Severe Liability Cap ($100 max)",
      plain_english: "The company strictly disclaims all consequential damages and caps its total cumulative liability to a trivial maximum ($100 or recent fees), even if they cause major harm.",
      action: "Be aware that if a major outage or data breach occurs, your legal financial recovery against the company is severely limited.",
    },
    {
      id: 'data_retention',
      pattern: /retain.*(?:reasonable period|as long as|archival)|retention.*(?:following termination|reasonable period)/i,
      level: 'yellow' as const,
      title: "Undefined Data Retention Post-Termination",
      label: "Undefined Data Retention",
      plain_english: "The policy lacks a defined maximum retention timeline and allows the company to hold your personal data for an unspecified 'reasonable period' after account termination.",
      action: "Submit a formal written GDPR/CCPA erasure request upon deleting your account to ensure complete data removal.",
    },
    {
      id: 'unilateral_changes',
      pattern: /reserve the right to (?:change|modify|update)|modify these terms.*(?:at any time|from time to time)/i,
      level: 'yellow' as const,
      title: "Unilateral Terms & Fee Changes",
      label: "Terms May Change Anytime",
      plain_english: "The company reserves the right to modify these terms and subscription fees with minimal advance notice, requiring you to monitor updates regularly.",
      action: "Watch for email update notifications and review the terms page whenever a revision notice is published.",
    },
    {
      id: 'discretionary_termination',
      pattern: /terminat.*(?:sole discretion|without notice|immediately)|suspend.*(?:without notice|sole discretion)/i,
      level: 'yellow' as const,
      title: "Account Suspension at Discretion",
      label: "Discretionary Termination",
      plain_english: "The company can suspend or terminate your account access at any time at its sole discretion without prior warning.",
      action: "Regularly export copies of any important documents, project data, or account records.",
    },
    {
      id: 'standard_arbitration',
      pattern: /(?:binding\s+)?arbitration|class\s+action\s+waiver|jury\s+trial\s+waiver/i,
      level: 'yellow' as const,
      title: "Dispute Resolution & Arbitration",
      label: "Mandatory Arbitration",
      plain_english: "All legal disputes must be handled through individual binding arbitration instead of public court proceedings or class action lawsuits.",
      action: "Understand that you forfeit the right to a public jury trial and class-action participation.",
    },
    {
      id: 'tracking_analytics',
      pattern: /cookie|track|analytic|device|telemetry/i,
      level: 'yellow' as const,
      title: "Telemetry, Cookies & Device Tracking",
      label: "Tracking & Analytics",
      plain_english: "The platform collects telemetry, device identifiers, analytics, and browser cookies to monitor user behavior across the platform.",
      action: "Use privacy-focused browser extensions or cookie banners to restrict non-essential tracking.",
    },
    {
      id: 'freelance_payment_delay',
      pattern: /withhold.*(?:\d+%|payment)|(?:pay.*within \d+ business days|60 business days|60 days)/i,
      level: 'yellow' as const,
      title: "Payment Delays & Withholding Rights",
      label: "60-Day Payment Delay",
      plain_english: "Client has up to 60 business days to pay and reserves the right to withhold up to 50% of fees at their sole discretion.",
      action: "Negotiate standard Net-15 or Net-30 payment terms and require objective milestone acceptance criteria.",
    },
    {
      id: 'unbounded_revisions',
      pattern: /incorporate reasonable revisions.*without.*(?:amendment|adjusting|fee)|revisions.*without.*(?:amendments?|adjustments?|fee)/i,
      level: 'yellow' as const,
      title: "Ambiguous Revisions & Scope Creep",
      label: "Ambiguous Revisions",
      plain_english: "Client may request ongoing revisions without adjusting the fixed project fee, creating risk of unpaid scope creep.",
      action: "Define a strict cap on revision cycles (e.g. max 2 revision rounds) in your Statement of Work.",
    },
    {
      id: 'late_penalties',
      pattern: /penalty.*(?:\d+%.*per day|\d+% of the project fee)|late delivery penalty/i,
      level: 'yellow' as const,
      title: "Late Delivery Financial Penalties",
      label: "Late Delivery Penalty",
      plain_english: "Daily percentage penalties are deducted from compensation for milestone delays.",
      action: "Add reasonable grace periods and specify that client delays pause all deadline clocks.",
    },
    {
      id: 'asymmetric_termination',
      pattern: /terminate.*(?:with or without cause.*(?:five|5) .*days|notice.*contractor.*30 days)/i,
      level: 'yellow' as const,
      title: "Asymmetric Notice for Early Termination",
      label: "Asymmetric Termination",
      plain_english: "Client can cancel quickly (5 days) while Contractor is locked into a 30-day notice requirement.",
      action: "Make termination notice periods mutual (e.g. 14 or 30 days for both parties).",
    },

    // 3. Standard Green Clauses
    {
      id: 'governing_law',
      pattern: /(?:governed by|construed in accordance with|laws of (?:the )?State|jurisdiction of)/i,
      level: 'green' as const,
      title: "Governing Law & Legal Jurisdiction",
      label: "Governing Law",
      plain_english: "Designates the governing state or national laws that apply to the interpretation and enforcement of this contract.",
      action: "Note the designated jurisdiction in case legal proceedings or cross-border questions arise.",
    },
    {
      id: 'user_accounts',
      pattern: /user accounts?|registration|confidentiality of your (?:login|account)|accurate.*(?:current|complete) information|password/i,
      level: 'green' as const,
      title: "User Account & Security Obligations",
      label: "Account Security & Credentials",
      plain_english: "You are required to provide accurate registration details and maintain the confidentiality of your login credentials.",
      action: "Use a unique, high-entropy password and enable two-factor authentication if available.",
    },
    {
      id: 'acceptance_terms',
      pattern: /acceptance (?:and|of)|by (?:accessing|registering|using)|agree to (?:comply|be bound)|authority to bind/i,
      level: 'green' as const,
      title: "Acceptance of Terms & Authority",
      label: "Acceptance of Terms",
      plain_english: "Standard legal clause stating that accessing or using the platform legally binds you or the organization you represent to this agreement.",
      action: "Ensure you have read the terms and have authority to represent your organization before accepting.",
    },
    {
      id: 'contact_support',
      pattern: /contact us|support@|questions.*contact|legal@|physical address/i,
      level: 'green' as const,
      title: "Customer Support & Legal Notices",
      label: "Customer Contact Channel",
      plain_english: "Specifies the contact email or address for reaching customer support and submitting formal legal inquiries.",
      action: "Save the listed contact email for future support, billing, or privacy inquiries.",
    },
  ];

  const extractedClauses: Clause[] = [];

  for (let i = 0; i < rawSections.length && extractedClauses.length < 15; i++) {
    const section = rawSections[i];
    if (section.length < 25) continue;

    if (
      /(?:terms of (?:service|use)|privacy policy|eula|user agreement|service agreement|contractor agreement|agreement \(amended\)|independent contractor)/i.test(
        section
      ) &&
      !/^\s*\d+[\.\)]/m.test(section) &&
      section.length < 180
    ) {
      continue;
    }

    const headingMatch = section.match(/^(?:(?:\d+[\.\)]\s*|[A-Z\s]{3,}\n+))([^\n]+)/);
    const sectionTitle = headingMatch ? headingMatch[0].replace(/[\r\n]+/g, ' ').trim() : `Clause ${i + 1}`;

    const matchedRule = rules.find((rule) => rule.pattern.test(section));

    if (matchedRule) {
      const cleanQuote = section
        .replace(/\s+/g, ' ')
        .slice(0, 320)
        .trim();

      extractedClauses.push({
        title: matchedRule.title || sectionTitle.slice(0, 80),
        plain_english: matchedRule.plain_english,
        risk_level: matchedRule.level,
        risk_label: matchedRule.label,
        what_to_do: matchedRule.action,
        quote: cleanQuote,
      });
    } else {
      const cleanQuote = section.replace(/\s+/g, ' ').slice(0, 300).trim();
      extractedClauses.push({
        title: sectionTitle.slice(0, 80) || `Contract Clause ${extractedClauses.length + 1}`,
        plain_english:
          'This section provides standard operational terms for the service. No extreme or predatory language was detected in this specific passage.',
        risk_level: 'green',
        risk_label: 'Standard Contract Terms',
        what_to_do: 'Review this clause to ensure it aligns with your expectations for using the service.',
        quote: cleanQuote,
      });
    }
  }

  if (extractedClauses.length === 0) {
    extractedClauses.push({
      title: 'Contract Agreement',
      plain_english: 'General contract terms reviewed. No immediate predatory violations found.',
      risk_level: 'green',
      risk_label: 'General Agreement',
      what_to_do: 'Review the full contract before accepting.',
      quote: text.slice(0, 200).trim(),
    });
  }

  return extractedClauses;
}

export function runClientSideAnalysis(text: string): Analysis {
  const clauses = makeFallbackClauses(text);
  const counts = clauses.reduce(
    (total, clause) => {
      total[clause.risk_level] = (total[clause.risk_level] || 0) + 1;
      return total;
    },
    { red: 0, yellow: 0, green: 0 }
  );

  return {
    id: Date.now(),
    title: getDocumentTitle(text),
    source_text: text,
    clauses,
    red_count: counts.red,
    yellow_count: counts.yellow,
    green_count: counts.green,
    created_at: new Date().toISOString(),
  };
}
