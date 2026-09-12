import type { QuickActionQuery, RagPresetContract } from '../types/rag';

export const QUICK_ACTION_QUERIES: QuickActionQuery[] = [
  {
    id: 'qa_termination',
    iconName: 'DoorOpen',
    label: 'Summarize the termination clause',
    query: 'Summarize the termination clause, cancellation notice window, and breach remedies.',
    category: 'high_risk',
    badge: 'High Priority',
    domain: 'termination',
    description: 'Finds cancellation notice timelines, early termination fees, and post-termination obligations.',
  },
  {
    id: 'qa_indemnity',
    iconName: 'ShieldAlert',
    label: 'Identify indemnity liabilities',
    query: 'Identify indemnity liabilities, defense obligations, and hold harmless provisions.',
    category: 'high_risk',
    badge: 'Critical Trap',
    domain: 'indemnity',
    description: 'Detects one-sided indemnification clauses, third-party claim liabilities, and defense costs.',
  },
  {
    id: 'qa_liability_caps',
    iconName: 'Scale',
    label: 'Evaluate limitation of liability caps',
    query: 'Evaluate the limitation of liability, aggregate liability caps, and consequential damages exclusions.',
    category: 'high_risk',
    badge: 'Financial Risk',
    domain: 'liability',
    description: 'Inspects monetary damage ceilings, waiver of consequential damages, and carve-outs.',
  },
  {
    id: 'qa_payment_terms',
    iconName: 'DollarSign',
    label: 'Explain payment terms & late fees',
    query: 'Explain payment terms, invoice dispute procedures, late payment interest, and billing penalties.',
    category: 'commercial',
    badge: 'Commercial',
    domain: 'payment_fees',
    description: 'Extracts payment deadlines (Net 30/60), late fee percentages, and milestone withholding rules.',
  },
  {
    id: 'qa_ip_ownership',
    iconName: 'Sparkles',
    label: 'Who owns intellectual property?',
    query: 'Who owns the intellectual property, deliverables, customer data, and feedback creations?',
    category: 'commercial',
    badge: 'IP Rights',
    domain: 'ip_ownership',
    description: 'Checks work-for-hire provisions, perpetual license grants, and proprietary asset transfers.',
  },
  {
    id: 'qa_arbitration',
    iconName: 'Gavel',
    label: 'Find dispute resolution & arbitration',
    query: 'Find mandatory arbitration rules, class action waivers, jury trial waivers, and governing law venue.',
    category: 'disputes',
    badge: 'Legal Rights',
    domain: 'dispute_arbitration',
    description: 'Pinpoints binding arbitration venues, waiver of court litigation, and governing jurisdiction.',
  },
  {
    id: 'qa_noncompete',
    iconName: 'Lock',
    label: 'Detect non-compete & restrictive covenants',
    query: 'Detect non-compete restrictions, non-solicitation of clients/employees, and exclusivity covenants.',
    category: 'compliance',
    badge: 'Restrictions',
    domain: 'restrictive_covenants',
    description: 'Scans for geographic restrictions, employee poaching bans, and exclusivity covenants.',
  },
  {
    id: 'qa_unilateral_mods',
    iconName: 'RefreshCw',
    label: 'Detect unilateral modification rights',
    query: 'Can the company modify terms, pricing, or features unilaterally without prior written consent?',
    category: 'high_risk',
    badge: 'Sneaky Terms',
    domain: 'unilateral_changes',
    description: 'Uncovers clauses allowing one-sided terms or price changes via website postings.',
  },
  {
    id: 'qa_data_privacy',
    iconName: 'EyeOff',
    label: 'Analyze data privacy & transfers',
    query: 'Analyze personal data privacy obligations, subprocessor usage, telemetry tracking, and security breaches.',
    category: 'compliance',
    badge: 'Compliance',
    domain: 'privacy_data',
    description: 'Examines GDPR/CCPA data handling, breach notification hours, and tracking disclosures.',
  },
  {
    id: 'qa_deadlines',
    iconName: 'Clock',
    label: 'Extract critical deadlines & notice periods',
    query: 'Extract all critical notice periods, auto-renewal cancellation windows, and cure period deadlines.',
    category: 'commercial',
    badge: 'Deadlines',
    domain: 'termination',
    description: 'Identifies all strict calendar deadlines and cure periods to prevent accidental breaches.',
  },
];

export const RAG_PRESET_CONTRACTS: RagPresetContract[] = [
  {
    id: 'enterprise_saas_msa',
    name: 'Enterprise Cloud SaaS Master Services Agreement (MSA) & SLA',
    category: 'Cloud Software & B2B SaaS',
    badge: 'Massive B2B MSA (18 Clauses)',
    description: 'Comprehensive 18-section enterprise cloud agreement featuring sneaky AI training grants, asymmetric indemnity, tight auto-renewal cancellation windows, and strict liability caps.',
    wordCount: 3850,
    text: `MASTER SERVICES AGREEMENT AND CLOUD SERVICE LEVEL AGREEMENT (SLA)
Effective Date: January 15, 2025
Document Reference: MSA-ENT-2025-08492
Parties: CloudScale Technologies Inc. ("Provider") and Enterprise Customer ("Customer")

RECITALS
WHEREAS, Provider operates a proprietary enterprise cloud analytics and artificial intelligence platform (the "Service"); and
WHEREAS, Customer desires to subscribe to and utilize the Service in accordance with the terms, conditions, and covenants set forth in this Master Services Agreement.
NOW, THEREFORE, in consideration of the mutual covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

SECTION 1. DEFINITIONS AND INTERPRETATION
1.1. "Authorized User" means each individual employee, contractor, or agent of Customer who is assigned a unique credential to access the Cloud Platform.
1.2. "Customer Data" means all electronic data, files, text, images, database schemas, and proprietary materials uploaded, stored, or processed by Customer through the Service.
1.3. "Documentation" means the official user manuals, API reference specifications, and technical guides published by Provider from time to time.
1.4. "Order Form" means any written transaction schedule or digital subscription order entered into by the parties referencing this Agreement.
1.5. "Service Level Target" means the monthly uptime percentage commitment set forth in Section 6 of this Agreement.
1.6. "Derived Model Data" means all statistical parameters, analytical weights, aggregated behavioral vectors, and mathematical inferences derived from usage of the Cloud Service.

SECTION 2. SUBSCRIPTION GRANT AND USAGE RESTRICTIONS
2.1. License Grant. Subject to Customer’s continuous compliance with all terms of this Agreement and timely payment of all applicable Subscription Fees, Provider hereby grants to Customer a non-exclusive, non-transferable, non-sublicensable, revocable right during the Subscription Term to access and utilize the Cloud Service solely for Customer's internal business operations.
2.2. Restrictions on Use. Customer covenants that it shall not, directly or indirectly: (a) reverse engineer, decompile, disassemble, or attempt to derive the underlying source code or algorithms of the Cloud Platform; (b) copy, frame, mirror, or create derivative works based upon the Service; (c) resell, sub-license, time-share, or distribute access to any unauthorized third party; (d) bypass, disable, or circumvent any security verification mechanism, quota restriction, or rate-limiting gateway; (e) introduce any malicious software, automated scrapers, or Denial of Service attack vectors into the infrastructure; or (f) utilize the Service to develop or benchmark a competitive product or service offering.
2.3. User Accountability. Customer is solely responsible for maintaining the absolute confidentiality of all administrative and user credentials and assumes full liability for all actions conducted under Customer accounts.

SECTION 3. INTELLECTUAL PROPERTY AND ARTIFICIAL INTELLIGENCE RIGHTS
3.1. Provider Proprietary Rights. Provider and its licensors retain all right, title, and interest, including all patent rights, copyrights, trade secrets, trademarks, know-how, and moral rights in and to the Cloud Platform, underlying software, Documentation, APIs, and all system enhancements and improvements.
3.2. Customer Data Ownership. As between the parties, Customer retains all proprietary ownership rights in Customer Data. Customer hereby grants to Provider a worldwide, royalty-free, non-exclusive license to host, copy, process, transmit, and display Customer Data solely to the extent necessary to operate, maintain, and provide the Service to Customer.
3.3. Artificial Intelligence Model Training Grant. Customer expressly agrees that Provider may aggregate, anonymize, and process Customer Data, prompt inputs, and system usage telemetry to train, refine, calibrate, optimize, and fine-tune Provider’s proprietary machine learning models, neural networks, and generative artificial intelligence algorithms. This training license shall be perpetual, irrevocable, worldwide, and royalty-free, surviving any termination or expiration of this Agreement.
3.4. Feedback Assignment. Any feedback, suggestions, enhancements, or ideas provided by Customer regarding the Service shall become the exclusive property of Provider without any requirement for accounting, attribution, or compensation.

SECTION 4. FEES, INVOICING, AND PAYMENT TERMS
4.1. Subscription Fees. Customer shall pay all subscription fees, usage overage charges, and implementation costs set forth in each applicable Order Form. Unless expressly stated otherwise, all payment obligations are non-cancelable and all fees paid are strictly non-refundable.
4.2. Invoicing and Payment Deadlines. Provider shall issue invoices electronically on an annual advance basis. Customer shall pay all invoiced amounts in full within thirty (30) calendar days of the invoice date (Net 30). All payments shall be made in United States Dollars via ACH transfer or wire payment.
4.3. Late Payment Penalties and Interest. Any invoiced amount not received by Provider by the due date shall accrue interest at the rate of one and one-half percent (1.5%) per month, or the maximum rate permitted by applicable law, whichever is lower, calculated daily and compounded monthly from the date due until paid in full.
4.4. Suspension for Non-Payment. If Customer's account remains delinquent for more than fifteen (15) calendar days following written notice of non-payment, Provider reserves the right, without liability, to immediately suspend Customer's access to the Service until all outstanding balances, accrued interest, and collection fees are satisfied in full.
4.5. Taxes. All quoted fees are exclusive of federal, state, municipal, sales, value-added (VAT), use, or withholding taxes. Customer shall be solely responsible for the payment of all such taxes associated with its purchase, excluding taxes based on Provider's net income.

SECTION 5. CONFIDENTIALITY AND NON-DISCLOSURE
5.1. Scope of Confidential Information. "Confidential Information" means all non-public, proprietary, or business information disclosed by one party ("Disclosing Party") to the other party ("Receiving Party"), whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure. Confidential Information includes, but is not limited to, pricing schedules, technical roadmaps, source code, security audit reports, and customer lists.
5.2. Protection Obligations. The Receiving Party agrees: (a) to protect the Disclosing Party's Confidential Information with the same degree of care it uses for its own confidential assets, but in no event less than reasonable care; (b) not to disclose Confidential Information to any person or entity except to its employees, contractors, and legal advisors who have a strict need to know and are bound by confidentiality obligations at least as restrictive as those herein; and (c) not to use Confidential Information for any purpose outside the scope of this Agreement.
5.3. Exclusions. Confidential Information does not include information that: (a) is or becomes publicly known through no breach by Receiving Party; (b) was already known to Receiving Party prior to disclosure without restriction; (c) is independently developed without reference to Disclosing Party's information; or (d) is required to be disclosed pursuant to a valid judicial subpoena, provided prompt written notice is given to Disclosing Party.

SECTION 6. SERVICE LEVEL AGREEMENT (SLA) AND UPTIME COMMITMENTS
6.1. Availability Commitment. Provider covenants that the Cloud Service shall achieve a Monthly Uptime Percentage of not less than ninety-nine and nine-tenths percent (99.9%) during each calendar month of the Subscription Term ("Service Level Target").
6.2. Calculation of Uptime. Monthly Uptime Percentage is calculated as follows: (Total Minutes in Month - Downtime Minutes) / Total Minutes in Month * 100%. Downtime excludes Scheduled Maintenance windows (not to exceed 4 hours per month, announced 48 hours in advance) and Force Majeure events.
6.3. SLA Service Credits. In the event Provider fails to meet the Service Level Target, Customer's sole and exclusive remedy, and Provider's entire liability, shall be the issuance of a service credit against Customer's next renewal invoice, as follows:
(a) Uptime between 99.0% and 99.89%: 5% service credit of monthly pro-rated fee;
(b) Uptime between 95.0% and 98.99%: 15% service credit of monthly pro-rated fee;
(c) Uptime below 95.0%: 25% service credit of monthly pro-rated fee.
6.4. Credit Claim Procedure. Customer must submit a formal written credit request within thirty (30) days of the end of the month in which the downtime occurred; failure to do so waives all rights to credits for that outage. Service credits are non-transferable and may not be redeemed for cash or refunded.

SECTION 7. DATA PROTECTION, SECURITY, AND PRIVACY COMPLIANCE
7.1. Technical and Organizational Safeguards. Provider shall implement and maintain commercially reasonable administrative, physical, and technical safeguards designed to preserve the confidentiality, integrity, and availability of Customer Data, including encryption of data at rest (AES-256) and in transit (TLS 1.3).
7.2. Security Breach Notification. In the event Provider confirms an unauthorized access, acquisition, or disclosure of unencrypted Customer Data ("Security Incident"), Provider shall notify Customer in writing within seventy-two (72) hours of confirmed discovery and shall take reasonable steps to mitigate effects of the incident.
7.3. Subprocessors. Customer grants Provider general written authorization to engage third-party subprocessors (including cloud infrastructure providers such as AWS and Google Cloud) to deliver the Service. Provider shall remain liable for acts and omissions of its subprocessors.
7.4. Telemetry and Analytics. Provider collects operational telemetry, query latency statistics, device metadata, and system logs to ensure reliability. Customer consents to such telemetry processing.

SECTION 8. WARRANTIES AND STATUTORY DISCLAIMERS
8.1. Mutual Representations. Each party represents and warrants that it has the full corporate power, legal right, and authority to enter into and execute this Agreement.
8.2. Service Performance Warranty. Provider warrants that during the Subscription Term, the Service will perform substantially in conformance with the published Documentation under normal operating conditions.
8.3. General Statutory Disclaimer. EXCEPT AS EXPRESSLY PROVIDED HEREIN, PROVIDER DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING ALL WARRANTIES OF MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. PROVIDER DOES NOT WARRANT THAT THE SERVICE WILL BE COMPLETELY UNINTERRUPTED, BUG-FREE, OR FREE FROM HARMFUL VULNERABILITIES, OR THAT ALL OUTPUTS FROM ARTIFICIAL INTELLIGENCE MODELS WILL BE ACCURATE, UNBIASED, OR RELIABLE.

SECTION 9. INDEMNIFICATION AND DEFENSE OF CLAIMS
9.1. Provider IP Infringement Indemnification. Provider shall defend Customer against any third-party legal claim alleging that Customer's authorized use of the Cloud Platform directly infringes a valid United States patent or registered copyright, and shall indemnify Customer for damages final judgment awarded by a court of competent jurisdiction against Customer. Provider's defense obligation is strictly contingent upon Customer: (a) giving prompt written notice within ten (10) business days; (b) granting sole control of defense and settlement to Provider; and (c) providing full cooperation.
9.2. Customer Broad Indemnification. Customer shall defend, indemnify, and hold harmless Provider, its corporate affiliates, officers, directors, employees, and agents from and against any and all third-party claims, lawsuits, regulatory proceedings, liabilities, penalties, legal fees, and settlement expenses arising out of or relating to: (a) Customer Data; (b) Customer's breach of Section 2.2 usage restrictions; (c) any violation of privacy, intellectual property, or export laws; or (d) any claims alleging Customer's or its Authorized Users' contributory negligence, misconduct, or unauthorized integrations.

SECTION 10. LIMITATION OF LIABILITY AND DAMAGE EXCLUSIONS
10.1. Exclusion of Consequential Damages. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL EITHER PARTY OR ITS AFFILIATES BE LIABLE TO THE OTHER PARTY FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, EXEMPLARY, OR COVER DAMAGES, INCLUDING LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF GOODWILL, LOSS OF DATA, REPUTATIONAL DAMAGE, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT OR THE SERVICE, REGARDLESS OF THE THEORY OF LIABILITY (WHETHER IN CONTRACT, TORT, STRICT LIABILITY, NEGLIGENCE, OR OTHERWISE), EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
10.2. Aggregate Liability Cap. PROVIDER’S TOTAL CUMULATIVE AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT, UNDER ALL CLAIMS AND CAUSES OF ACTION COMBINED, SHALL BE STRICTLY CAPPED AT AND SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY CUSTOMER TO PROVIDER UNDER THE SPECIFIC ORDER FORM GIVING RISE TO THE CLAIM IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY, OR FIVE THOUSAND DOLLARS ($5,000.00), WHICHEVER AMOUNT IS LESS.

SECTION 11. TERM, AUTO-RENEWAL, AND TERMINATION
11.1. Agreement Term. This Agreement commences on the Effective Date and shall continue in full force and effect until all Order Forms have expired or been terminated in accordance with this Section 11.
11.2. Automatic Subscription Renewal. Each Order Form shall specify an initial subscription term of one (1) year ("Initial Term"). UPON THE EXPIRATION OF THE INITIAL TERM, THE SUBSCRIPTION SHALL AUTOMATICALLY RENEW FOR SUCCESSIVE PERIODS OF ONE (1) YEAR EACH ("RENEWAL TERM"), UNLESS EITHER PARTY PROVIDES AFFIRMATIVE WRITTEN NOTICE OF NON-RENEWAL AT LEAST SIXTY (60) CALENDAR DAYS PRIOR TO THE EXPIRATION OF THE THEN-CURRENT TERM. All renewal terms shall be subject to standard annual price adjustments not to exceed eight percent (8%).
11.3. Termination for Material Breach. Either party may terminate this Agreement and any active Order Form upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) calendar days following receipt of detailed written notice specifying the breach.
11.4. Termination for Insolvency. Either party may terminate this Agreement immediately upon written notice if the other party becomes insolvent, enters into receivership, makes an assignment for the benefit of creditors, or files for bankruptcy protection.
11.5. Effects of Termination. Upon expiration or termination of this Agreement for any reason: (a) all licenses and rights granted to Customer shall immediately cease; (b) Customer shall immediately discontinue all access to the Cloud Service; (c) all unpaid fees shall become immediately due and payable; and (d) Provider shall retain Customer Data for thirty (30) days for export, after which Provider may permanently purge Customer Data from its production storage systems.
11.6. Survival. Sections 1, 3, 4, 5, 8.3, 9, 10, 11.5, 12, and 13 shall survive any termination or expiration of this Agreement.

SECTION 12. DISPUTE RESOLUTION AND MANDATORY ARBITRATION
12.1. Informal Executive Resolution. Prior to initiating any formal legal proceeding, executive representatives of each party shall meet in good faith within fifteen (15) business days of written notice to attempt to resolve the dispute amicably.
12.2. Binding Arbitration. Any unresolved dispute, controversy, or claim arising out of or relating to this Agreement, its breach, validity, or termination, shall be resolved exclusively through final and binding individual arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall be conducted by a single neutral arbitrator in New York, New York. Judgment on the award rendered by the arbitrator may be entered in any court having competent jurisdiction thereof.
12.3. Class Action Waiver. CUSTOMER EXPRESSLY WAIVES ANY RIGHT TO COMMENCE, JOIN, CONSOLIDATE, OR PARTICIPATE AS A CLASS REPRESENTATIVE OR CLASS MEMBER IN ANY CLASS ACTION, COLLECTIVE ACTION, PRIVATE ATTORNEY GENERAL ACTION, OR REPRESENTATIVE PROCEEDING AGAINST PROVIDER.
12.4. Exception for Equitable Relief. Notwithstanding the mandatory arbitration covenant above, Provider reserves the right to seek preliminary injunctive relief or specific performance in any state or federal court located in New York County, New York, to prevent unauthorized disclosure of Confidential Information or infringement of intellectual property rights.

SECTION 13. MISCELLANEOUS PROVISIONS
13.1. Governing Law and Venue. This Agreement and all claims arising hereunder shall be governed by, interpreted, and construed in accordance with the laws of the State of New York, without regard to its conflict of laws principles. The United Nations Convention on Contracts for the International Sale of Goods shall not apply.
13.2. Unilateral Amendments and Updates. Provider reserves the right to modify, amend, or update these terms and conditions from time to time. Provider shall notify Customer of material modifications by posting an updated version on its website or transmitting an email notice. Customer’s continued access or use of the Service after thirty (30) days following notice shall constitute full acceptance of the updated terms.
13.3. Entire Agreement. This Agreement, together with all executed Order Forms, Schedules, and referenced policies, constitutes the complete, final, and exclusive agreement between the parties regarding the subject matter hereof, superseding all prior oral or written agreements, proposals, negotiations, and representations.
13.4. Severability. If any provision of this Agreement is held by a court or arbitrator of competent jurisdiction to be invalid, unlawful, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid, and the remaining provisions shall remain in full force and effect.
13.5. Force Majeure. Neither party shall be liable for any delay or failure in performance resulting from causes beyond its reasonable control, including acts of God, war, terrorism, strikes, pandemics, regional utility outages, or failure of telecommunication networks.
13.6. Notices. All formal legal notices shall be delivered in writing via certified mail or internationally recognized courier with tracking to the corporate addresses designated in the Order Form.

IN WITNESS WHEREOF, the parties hereto have caused this Master Services Agreement to be executed by their duly authorized corporate officers as of the Effective Date.`,
  },
  {
    id: 'vc_term_sheet',
    name: 'Venture Capital Series Seed Term Sheet & Investor Rights Agreement',
    category: 'Venture Capital & Corporate Finance',
    badge: 'Investor Rights (14 Clauses)',
    description: 'Complex venture financing agreement containing liquidation preferences, 1x participating rights, pro-rata super-rights, drag-along covenants, and founder restrictive non-compete covenants.',
    wordCount: 2950,
    text: `SERIES SEED PREFERRED STOCK FINANCING TERM SHEET AND INVESTOR RIGHTS COVENANT
Date of Issuance: February 10, 2025
Company: Apex Robotics Inc., a Delaware Corporation (the "Company")
Lead Investor: Vanguard Horizon Ventures Fund IV, L.P. ("Investor")

1. FINANCING SECURITIES AND VALUATION
1.1. Investment Amount: Aggregate investment of $4,000,000.00 (Four Million US Dollars) for Series Seed Preferred Stock.
1.2. Pre-Money Valuation: The pre-money valuation of the Company is agreed at $16,000,000.00, resulting in a post-money valuation of $20,000,000.00.
1.3. Unallocated Option Pool: Prior to closing, the Company shall expand its unallocated employee stock option pool to equal fifteen percent (15.0%) of the fully diluted capitalization post-financing.

2. LIQUIDATION PREFERENCE AND PARTICIPATION RIGHTS
2.1. Senior Liquidation Preference. In the event of any liquidation, dissolution, winding up, merger, acquisition, sale of substantially all assets, or change of control of the Company ("Deemed Liquidation Event"), the holders of Series Seed Preferred Stock shall be entitled to receive, prior and in preference to the holders of Common Stock, an amount per share equal to one times (1.0x) the Original Issue Price plus all declared but unpaid dividends.
2.2. Full Participation Rights. After the payment of the 1.0x preferential amount, the remaining assets and proceeds of the Company shall be distributed pro-rata to all holders of Common Stock and Series Seed Preferred Stock on an as-converted basis, without any monetary cap on total participation.

3. VOTING RIGHTS AND PROTECTIVE PROVISIONS
3.1. General Voting. The Series Seed Preferred Stock shall vote together with the Common Stock on an as-converted basis on all matters submitted to a stockholder vote.
3.2. Protective Veto Rights. So long as at least twenty-five percent (25%) of the Series Seed Preferred Stock remains outstanding, the Company shall not, without the prior affirmative written consent of the holders of a majority of the outstanding Series Seed Preferred Stock:
(a) Alter, amend, or waive any provision of the Certificate of Incorporation that adversely affects the rights, preferences, or privileges of the Series Seed Preferred Stock;
(b) Create, authorize, or issue any new class or series of stock having rights senior to or on parity with the Series Seed Preferred Stock;
(c) Consummate any Deemed Liquidation Event, merger, reorganization, or sale of substantial intellectual property;
(d) Repurchase or redeem any shares of Common Stock or options, except pursuant to standard founder vesting agreements;
(e) Incur any commercial debt or line of credit in excess of $250,000.00; or
(f) Change the authorized number of directors on the Board of Directors.

4. BOARD OF DIRECTORS AND GOVERNANCE
4.1. Board Composition. The Board of Directors shall consist of three (3) members: (a) one director designated by the Lead Investor; (b) one director designated by the Founder Common Stockholders; and (c) one independent industry director mutually agreed upon by the Investor and Founder.
4.2. Board Meetings. The Board of Directors shall convene at least quarterly. The Investor director shall receive reimbursement for all reasonable travel and accommodation expenses incurred in attending board meetings.

5. INFORMATION AND INSPECTION RIGHTS
5.1. Financial Reporting. The Company shall deliver to each Major Investor (defined as an investor holding at least 500,000 shares of Preferred Stock): (a) unaudited monthly financial statements within thirty (30) days after month-end; (b) unaudited quarterly financial statements within forty-five (45) days after quarter-end; (c) annual audited financial statements prepared in accordance with GAAP within ninety (90) days after fiscal year-end; and (d) an annual operating budget and business plan thirty (30) days prior to the start of each fiscal year.
5.2. Inspection and Audit Rights. Major Investors shall have the right, at their own expense during normal business hours, to inspect the facilities, books, and records of the Company and discuss corporate affairs with executive officers and independent accountants.

6. PRO-RATA AND PREEMPTIVE RIGHTS
6.1. Preemptive Right to Future Issuances. Each Major Investor shall have a right of first offer to purchase its pro-rata share of all new equity securities, convertible notes, or warrants that the Company may issue in future financing rounds, based on the ratio of common stock equivalents held by the Investor to the total fully diluted shares.
6.2. Super Pro-Rata Allocation. The Lead Investor shall have the right to purchase up to two times (2.0x) its pro-rata entitlement in the next Qualified Equity Financing of the Company.

7. RIGHT OF FIRST REFUSAL AND CO-SALE (ROFR)
7.1. Company Right of First Refusal. If any Founder or key common stockholder desires to sell, transfer, or pledge any shares of capital stock of the Company, the Company shall have the primary right of first refusal to purchase such shares on the same terms.
7.2. Investor Secondary ROFR and Co-Sale. If the Company declines to exercise its ROFR, the Investors shall have a secondary right of first refusal. If the transfer is not fully purchased under the ROFR, each Investor shall have the right to participate in the sale ("Tag-Along / Co-Sale Right") on a pro-rata basis on identical terms.

8. DRAG-ALONG RIGHTS
8.1. Drag-Along Threshold. If the Board of Directors and the holders of a majority of the outstanding Preferred Stock and a majority of the Common Stock approve a bona fide third-party acquisition or merger ("Approved Sale"), all remaining stockholders covenant and agree to vote all shares in favor of the transaction, execute all required acquisition agreements, and sell their shares on the approved terms.
8.2. Stockholder Waiver. Each stockholder waives all appraisal, dissenters', or valuation rights under Delaware General Corporation Law in connection with an Approved Sale.

9. FOUNDER VESTING AND REVERSE DILUTION
9.1. Four-Year Vesting Schedule. All Common Stock held by the Founders shall be subject to a four-year reverse vesting schedule commencing on the Closing Date: twenty-five percent (25%) shall vest on the first anniversary (1-year cliff), and the remaining seventy-five percent (75%) shall vest in equal monthly installments over the following thirty-six (36) months, contingent upon continued full-time service.
9.2. Acceleration. Unvested founder shares shall be subject to Double-Trigger Acceleration: fifty percent (50%) of unvested shares shall accelerate if the Company undergoes a Change of Control AND the Founder is terminated without Cause within twelve (12) months following the transaction.

10. RESTRICTIVE COVENANTS AND FOUNDER NON-COMPETE
10.1. Non-Competition Covenant. During their employment and for a period of twenty-four (24) months following the termination of service with the Company for any reason, each Founder covenants that they shall not, directly or indirectly, engage in, advise, invest in, or provide services to any business entity that competes with the Company's robotics or AI product lines within North America and Europe.
10.2. Non-Solicitation. For a period of twenty-four (24) months post-termination, Founders shall not solicit, recruit, or hire any employee or contractor of the Company.

11. INTELLECTUAL PROPERTY ASSIGNMENT
11.1. Assignment of Prior Inventions. Each Founder and employee represents and warrants that all intellectual property, patent applications, trade secrets, software code, and inventions developed prior to closing relating to the Company's business have been fully and irrevocably assigned to the Company without encumbrance.
11.2. Proprietary Information Agreement. All current and future employees and contractors shall execute the Company’s standard Invention Assignment and Confidentiality Agreement as a condition of employment.

12. EXPENSES AND TRANSACTION COUNSEL
12.1. Legal Expense Reimbursement. The Company shall reimburse the Lead Investor for all reasonable legal fees, due diligence costs, and out-of-pocket expenses incurred in connection with negotiating and drafting the financing documentation, up to a maximum aggregate amount of $45,000.00 at closing.

13. CONFIDENTIALITY AND PUBLIC ANNOUNCEMENTS
13.1. Non-Disclosure. The existence, terms, and conditions of this Term Sheet and all related discussions shall remain strictly confidential, except to the extent disclosed to professional legal and tax advisors.
13.2. Press Releases. No public press release or marketing announcement regarding the financing shall be made without the prior written approval of both the Company and the Lead Investor.

14. GOVERNING LAW AND EXCLUSIVITY
14.1. Governing Law. This Term Sheet and all definitive agreements shall be governed by and construed in accordance with the laws of the State of Delaware.
14.2. Exclusivity Covenant. In consideration of the significant time and expense devoted by the Investor, the Company agrees that for a period of forty-five (45) days following execution, the Company will not solicit, encourage, or engage in negotiations with any other third party regarding an investment or acquisition.`,
  },
  {
    id: 'commercial_lease_nnn',
    name: 'Commercial Real Estate & Industrial Triple Net (NNN) Lease',
    category: 'Real Estate & Facility Operations',
    badge: 'Triple Net Lease (16 Clauses)',
    description: 'Commercial facility lease with full NNN operating expense pass-throughs, continuous operations covenant, landlord indemnification, environmental remediation, and accelerated rent upon default.',
    wordCount: 3100,
    text: `COMMERCIAL INDUSTRIAL TRIPLE NET (NNN) LEASE AGREEMENT
Effective Date: March 1, 2025
Premises: 104,000 sq ft Logistics Warehouse, Industrial Park Boulevard, Dallas, TX
Landlord: Highline Industrial Holdings LLC ("Landlord")
Tenant: SwiftLogix Global Distribution Inc. ("Tenant")

1. LEASED PREMISES AND TERM
1.1. Demised Premises. Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the industrial warehouse building consisting of approximately 104,000 rentable square feet, together with exclusive parking lots, truck staging aprons, and dock levelers.
1.2. Initial Term. The term of this Lease shall be for one hundred twenty (120) consecutive calendar months (10 years), commencing on April 1, 2025 ("Commencement Date") and expiring on March 31, 2035 ("Expiration Date").
1.3. Renewal Options. Tenant shall have two (2) consecutive options to renew this Lease for five (5) years each, provided Tenant gives written notice at least nine (9) months prior to expiration and is not in default.

2. BASE RENT AND ANNUAL ESCALATIONS
2.1. Base Rent Schedule. Tenant shall pay to Landlord annual Base Rent of $1,248,000.00 ($12.00/sq ft), payable in equal monthly installments of $104,000.00 in advance on the first (1st) day of each calendar month.
2.2. Annual Rent Escalation. On each anniversary of the Commencement Date, the monthly Base Rent shall increase by three and one-half percent (3.5%) over the prior year's Base Rent.
2.3. Late Charges. If any rent installment is not received by Landlord within five (5) calendar days of the due date, Tenant shall pay a late charge equal to five percent (5.0%) of the overdue installment plus interest at 10% per annum.

3. TRIPLE NET (NNN) OPERATING EXPENSES
3.1. Absolute Triple Net Lease. This is an absolute Triple Net (NNN) lease. Base Rent is net of all operating costs. Tenant shall pay all Real Estate Taxes, Property Insurance Premiums, and Common Area Maintenance (CAM) charges incurred in connection with the Premises.
3.2. Common Area Maintenance (CAM). CAM expenses include all costs of maintenance, exterior roof repairs, asphalt resurfacing, storm water retention, landscaping, security systems, management fees (capped at 5% of gross revenues), and amortized capital replacements.
3.3. Reconciliation. Landlord shall provide an annual reconciliation statement within ninety (90) days after each calendar year. Tenant shall pay any deficiency within thirty (30) days of receipt.

4. SECURITY DEPOSIT AND LETTER OF CREDIT
4.1. Deposit Amount. Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $312,000.00 (equivalent to 3 months Base Rent) as security for the faithful performance of all covenants herein.
4.2. Application of Deposit. If Tenant defaults in any rent payment or repair obligation, Landlord may apply all or any portion of the deposit to satisfy the delinquency. Tenant shall replenish the deposit within ten (10) days of written notice.

5. PERMITTED USE AND CONTINUOUS OPERATION
5.1. Permitted Use. The Premises shall be used exclusively for warehousing, commercial logistics, light assembly, and administrative offices, and for no other purpose without Landlord's prior written consent.
5.2. Continuous Operation Covenant. Tenant covenants that it shall continuously occupy and actively conduct its logistics operations throughout the entire Initial Term. Vacating or leaving the Premises dark for more than thirty (30) consecutive days shall constitute an immediate non-curable Event of Default.

6. MAINTENANCE, REPAIRS, AND STRUCTURAL OBLIGATIONS
6.1. Tenant Maintenance Obligations. Tenant shall, at its sole cost and expense, keep and maintain all portions of the Premises in first-class order and condition, including heating, ventilation, and air conditioning (HVAC) systems, electrical switchgear, plumbing, overhead dock doors, and fire suppression sprinklers. Tenant must maintain a continuous quarterly HVAC service maintenance contract with a certified contractor.
6.2. Roof and Foundation. Landlord shall maintain the structural slab and load-bearing walls; provided, however, that the cost of roof membrane replacement shall be included in operating expenses amortized over its useful life and paid by Tenant.

7. ALTERATIONS AND IMPROVEMENTS
7.1. Alteration Consent. Tenant shall make no structural alterations, roof penetrations, or electrical expansions exceeding $25,000.00 without Landlord’s prior written approval.
7.2. Surrender and Removal. Upon expiration of the Lease, Landlord may require Tenant, at Tenant’s sole expense, to remove any alterations, office partitions, or specialized conveyor systems and restore the building to its original vanilla shell condition.

8. ENVIRONMENTAL LAWS AND HAZARDOUS SUBSTANCES
8.1. Hazardous Materials Restriction. Tenant shall not cause or permit any Hazardous Materials, toxic wastes, battery acid, or petroleum pollutants to be brought upon, stored, or discharged at the Premises, except in strict compliance with federal environmental laws (CERCLA, RCRA, OSHA).
8.2. Environmental Indemnity. Tenant shall defend, indemnify, and hold Landlord harmless from any claims, cleanup orders, remediation costs, fines, and legal fees arising from environmental contamination occurring during Tenant’s occupancy. This environmental indemnity survives lease termination.

9. INSURANCE AND WAIVER OF SUBROGATION
9.1. Tenant Required Coverages. Tenant shall maintain at all times: (a) Commercial General Liability Insurance with limits of not less than $3,000,000.00 per occurrence and $5,000,000.00 aggregate; (b) All-Risk Property Insurance covering 100% replacement value of Tenant fixtures; and (c) Statutory Workers' Compensation Insurance.
9.2. Additional Insured. Landlord and its mortgage lender shall be named as Additional Insureds on all liability policies.
9.3. Mutual Waiver of Subrogation. Landlord and Tenant each waive all rights of recovery against each other for loss or damage covered by their respective property insurance policies.

10. INDEMNIFICATION AND LANDLORD LIABILITY EXCLUSIONS
10.1. Tenant Broad Indemnification. Tenant shall defend, indemnify, and hold harmless Landlord and its managing agents from and against all claims, liabilities, lawsuits, and damages arising from: (a) any accident or injury occurring on the Premises; (b) any breach of this Lease by Tenant; or (c) any act or omission of Tenant, its employees, or truck drivers.
10.2. Limitation of Landlord Liability. Landlord shall not be liable to Tenant for any property damage, loss of business, or water leak damage caused by roof failure, pipe bursts, or electrical outages, even if resulting from Landlord's ordinary negligence. Tenant’s sole recourse against Landlord is limited to Landlord’s equity interest in the building.

11. ASSIGNMENT AND SUBLETTING
11.1. Consent Required. Tenant shall not assign, sublet, mortgage, or transfer this Lease or any interest in the Premises without Landlord’s prior written consent, which consent may not be unreasonably withheld or delayed.
11.2. Landlord Recapture Right. If Tenant requests consent to sublease more than fifty percent (50%) of the Premises, Landlord shall have the option to terminate this Lease as to that portion and recapture the space.
11.3. Excess Sublease Profits. Tenant shall pay to Landlord fifty percent (50%) of any rent or premium received from a subtenant in excess of the Base Rent payable under this Lease.

12. DEFAULTS AND REMEDIES
12.1. Events of Default. Each of the following shall constitute an Event of Default by Tenant:
(a) Failure to pay any Base Rent or NNN expense within five (5) days after written notice of delinquency;
(b) Failure to perform any other covenant or obligation herein within thirty (30) days after written notice;
(c) Abandonment or vacating of the Premises;
(d) Bankruptcy or insolvency proceedings initiated by or against Tenant.
12.2. Landlord Remedies and Accelerated Rent. Upon the occurrence of an Event of Default, Landlord may, in its sole discretion:
(a) Terminate Tenant’s right to possession without terminating the Lease and relet the space;
(b) Terminate this Lease immediately and declare the entire balance of all remaining unpaid Base Rent for the remainder of the 10-year term immediately accelerated and due in full, discounted to present value at 4%;
(c) Re-enter the Premises and remove all property at Tenant's expense.

13. CASUALTY AND CONDEMNATION
13.1. Damage and Repair. If the building is damaged by fire or casualty, Landlord shall repair the damage with reasonable diligence. If the damage exceeds forty percent (40%) of replacement value or occurs in the final eighteen (18) months of the term, either party may terminate this Lease upon thirty (30) days notice.
13.2. Total Condemnation. If the entire Premises are taken under power of eminent domain, this Lease shall terminate as of the date of taking. All condemnation awards belong exclusively to Landlord.

14. SUBORDINATION, ATTORNMENT, AND ESTOPPEL
14.1. Subordination to Mortgages. This Lease is subject and subordinate to all existing and future ground leases and mortgages placed upon the property by Landlord.
14.2. Estoppel Certificates. Tenant shall, within ten (10) business days following request by Landlord, deliver an executed estoppel certificate confirming the validity, rent amount, and absence of defaults under this Lease.

15. HOLDING OVER AND TENANCY AT SUFFERANCE
15.1. Holdover Penalty. If Tenant retains possession of the Premises after expiration of the term without Landlord’s express consent, Tenant shall pay holdover rent equal to one hundred fifty percent (150%) of the Base Rent in effect immediately prior to expiration, calculated on a monthly basis.

16. GOVERNING LAW AND JURY WAIVER
16.1. Texas Law and Venue. This Lease shall be governed by and construed in accordance with the laws of the State of Texas. Venue for any dispute shall be in Dallas County, Texas.
16.2. Jury Trial Waiver. LANDLORD AND TENANT EACH HEREBY UNCONDITIONALLY AND IRREVOCABLY WAIVES ALL RIGHTS TO A TRIAL BY JURY IN ANY ACTION, LAWSUIT, OR PROCEEDING ARISING OUT OF OR RELATING TO THIS LEASE.`,
  },
  {
    id: 'executive_employment_covenants',
    name: 'Executive Employment & Restrictive Covenants Agreement',
    category: 'Employment & Executive Compensation',
    badge: 'Executive Covenants (12 Clauses)',
    description: 'Executive contract with 24-month worldwide non-compete, invention assignment, non-solicitation of clients, incentive bonus clawback, and mandatory binding arbitration.',
    wordCount: 2800,
    text: `EXECUTIVE EMPLOYMENT, CONFIDENTIALITY, AND RESTRICTIVE COVENANTS AGREEMENT
Effective Date: April 15, 2025
Company: NexaCore Solutions Inc., a Delaware Corporation ("Company")
Executive: Alexander Wright ("Executive")

1. POSITION, DUTIES, AND EXCLUSIVITY OF SERVICE
1.1. Appointment as Chief Technology Officer (CTO). The Company hereby employs Executive as Chief Technology Officer. Executive shall report directly to the Chief Executive Officer and Board of Directors.
1.2. Full-Time Devotion. Executive agrees to devote one hundred percent (100%) of business time, attention, skill, and energy to the business and affairs of the Company and shall not engage in any other business activities or board directorships without prior written Board approval.

2. COMPENSATION, BONUS, AND EQUITY GRANTS
2.1. Base Salary. The Company shall pay Executive an annual base salary of $385,000.00, payable in accordance with the Company’s regular payroll schedule.
2.2. Annual Performance Bonus. Executive shall be eligible to receive an annual discretionary target performance bonus of up to fifty percent (50%) of Base Salary, based on achievement of key performance indicators (KPIs) established by the Compensation Committee.
2.3. Incentive Clawback Policy. Any performance bonus or incentive equity paid to Executive shall be subject to mandatory repayment and clawback if the Company is required to prepare an accounting restatement due to material non-compliance with financial reporting requirements.

3. BENEFITS, VACATION, AND EXPENSES
3.1. Executive Benefits. Executive shall be entitled to participate in all health insurance, retirement 401(k), disability, and life insurance plans maintained by the Company for senior executives.
3.2. Paid Time Off. Executive shall be entitled to twenty-five (25) days of paid time off (PTO) annually in accordance with Company policy.
3.3. Business Expenses. The Company shall reimburse Executive for all reasonable and documented travel and business expenses incurred in the performance of duties.

4. TERMINATION OF EMPLOYMENT
4.1. At-Will Employment. Executive’s employment is at-will and may be terminated by either party at any time, with or without Cause, subject to the severance provisions herein.
4.2. Termination for Cause. The Company may terminate Executive’s employment immediately for Cause upon written notice. "Cause" means: (a) willful failure or refusal to perform material duties; (b) indictment or conviction of a felony; (c) fraud, embezzlement, or misappropriation of Company property; (d) material breach of this Agreement; or (e) violation of the Company’s code of ethics.
4.3. Termination Without Cause / Resignation for Good Reason. If Executive is terminated without Cause or resigns for Good Reason, Executive shall receive twelve (12) months Base Salary continuation, twelve (12) months COBRA health premium subsidy, and pro-rata bonus, contingent upon executing an irrevocable general release of all claims.

5. CONFIDENTIALITY AND PROPRIETARY INFORMATION
5.1. Non-Disclosure. Executive recognizes that employment creates a relationship of trust and confidence. Executive shall not at any time, during or after employment, disclose, publish, or use any Confidential Information or Trade Secrets of the Company for personal benefit or the benefit of any competitor.
5.2. Return of Company Property. Upon termination of employment for any reason, Executive shall immediately return all laptops, mobile devices, source code repositories, customer lists, and financial records to the Company.

6. ASSIGNMENT OF INVENTIONS AND INTELLECTUAL PROPERTY
6.1. Work Made for Hire. All software code, algorithms, architectural designs, patents, trademarks, discoveries, and improvements created, conceived, or reduced to practice by Executive during employment ("Inventions") shall be deemed a "work made for hire" and are the sole and exclusive property of the Company.
6.2. Irrevocable Assignment. To the extent any Invention does not qualify as a work made for hire, Executive hereby irrevocably assigns to the Company all right, title, and interest in and to such Invention throughout the world.
6.3. Power of Attorney. Executive irrevocably appoints the Company as attorney-in-fact to execute any patent or copyright applications if Executive is unable or unwilling to do so.

7. RESTRICTIVE COVENANTS: NON-COMPETITION
7.1. Non-Compete Scope. Executive agrees that during employment and for a period of twenty-four (24) months following termination of employment for any reason ("Restricted Period"), Executive shall not, directly or indirectly, own, manage, operate, join, control, consult with, or be employed by any enterprise that develops, markets, or sells cloud infrastructure or automated analytics software in competition with the Company anywhere in North America and Western Europe.
7.2. Acknowledgement of Reasonableness. Executive acknowledges that the geographic scope and 24-month duration of this covenant are fair and necessary to protect the Company's valuable goodwill and trade secrets.

8. NON-SOLICITATION OF CUSTOMERS AND EMPLOYEES
8.1. Customer Non-Solicitation. During the Restricted Period, Executive shall not solicit, divert, or attempt to divert any client, customer, or prospective account of the Company with whom Executive had contact during the last twelve (12) months of employment.
8.2. Employee Non-Solicitation. During the Restricted Period, Executive shall not solicit, recruit, hire, or encourage to leave employment any employee, contractor, or consultant of the Company.

9. NON-DISPARAGEMENT
9.1. Mutual Covenant. Executive agrees not to make any negative, derogatory, or disparaging public statements regarding the Company, its products, officers, or board members. The Company agrees to instruct its executive officers not to make disparaging statements regarding Executive.

10. INJUNCTIVE RELIEF AND ENFORCEMENT
10.1. Irreparable Harm. Executive acknowledges that any breach of Sections 5, 6, 7, or 8 would cause irreparable harm to the Company for which monetary damages alone would be inadequate.
10.2. Specific Performance. In the event of an actual or threatened breach, the Company shall be entitled to seek temporary and permanent injunctive relief and specific performance in any court of competent jurisdiction without the requirement of posting a bond.

11. MANDATORY ARBITRATION AND WAIVER
11.1. JAMS Arbitration. Any legal controversy or claim arising out of or relating to Executive’s employment or termination shall be resolved by confidential, final, and binding arbitration administered by JAMS under its Employment Arbitration Rules in San Francisco, California.
11.2. Waiver of Class Action. Executive and the Company agree that arbitration shall proceed solely on an individual basis and waive all rights to initiate or join class or collective actions.

12. GOVERNING LAW AND SEVERABILITY
12.1. Delaware Law. This Agreement shall be governed by and construed in accordance with the internal laws of the State of Delaware.
12.2. Blue-Penciling and Modification. If any court or arbitrator finds the non-compete covenant overly broad in duration or territory, the covenant shall be reformed and enforced to the maximum extent permitted by law.`,
  },
];
