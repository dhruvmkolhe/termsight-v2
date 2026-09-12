import type { DiffSample, RiskLevel, SampleContract } from '../types/contract';

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'sneaky-ai',
    name: 'Sneaky AI SaaS',
    badgeText: 'Sneaky AI SaaS (IP Grab & Auto-renewal)',
    risk: 'red',
    riskClass: 'border-[#FF3B3B]/50 bg-[#FF3B3B]/10 text-[#FF3B3B] hover:bg-[#FF3B3B]/20',
    description: 'Overreaching IP transfer, auto-renewal trap, unilateral price hikes, and binding arbitration.',
    text: `TERMS OF SERVICE - SYNTHETICVOX AI INC.
Last Updated: January 15, 2025

1. ACCEPTANCE AND ELIGIBILITY
By accessing or using the SyntheticVox AI platform, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.

2. USER CONTENT AND INTELLECTUAL PROPERTY ASSIGNMENT
You retain nominal ownership of raw prompts uploaded to the service. However, by uploading, generating, or processing any content, audio files, designs, voice models, code, or materials through the platform ("User Content"), you hereby grant SyntheticVox AI Inc., its subsidiaries, and affiliates a perpetual, irrevocable, worldwide, royalty-free, transferable, and fully sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, publicly perform, train foundation machine learning models upon, commercialize, and display such User Content in any and all media now known or hereafter devised, without any requirement of attribution, notice, or compensation to you.

3. SUBSCRIPTION BILLING AND AUTOMATIC RENEWAL TRAP
Subscriptions automatically renew at the conclusion of each billing period (monthly or annually) at the prevailing list price unless cancelled by you at least five (5) full business days prior to the expiration of the current billing cycle. Cancellations submitted within five (5) days of renewal will take effect at the end of the subsequent billing cycle. ALL SUBSCRIPTION CHARGES, SETUP FEES, AND IN-APP CREDITS ARE NON-REFUNDABLE UNDER ALL CIRCUMSTANCES, INCLUDING ACCIDENTAL RENEWALS OR SERVICE INTERRUPTIONS.

4. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SYNTHETICVOX AI INC. BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF PROFITS, DATA LOSS, SYSTEM DOWNTIME, OR BUSINESS INTERRUPTION. THE COMPANY'S AGGREGATE CUMULATIVE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR YOUR USE OF THE SERVICE SHALL BE STRICTLY CAPPED AT THE LESSER OF FIFTY U.S. DOLLARS ($50.00) OR THE AMOUNT ACTUALLY PAID BY YOU IN THE PRECEDING ONE (1) MONTH.

5. INDEMNIFICATION FOR COMPANY'S OWN NEGLIGENCE
You agree to defend, indemnify, and hold harmless SyntheticVox AI Inc., its officers, directors, employees, and contractors from and against any third-party claims, liabilities, damages, and legal expenses arising out of your use of the platform, even if such claims arise from or are alleged to arise from the contributory negligence or standard negligence of SyntheticVox AI Inc.

6. BINDING ARBITRATION AND CLASS ACTION WAIVER
You and SyntheticVox AI Inc. agree that any legal dispute, claim, or controversy shall be resolved exclusively through individual binding arbitration administered by the American Arbitration Association in Dover, Delaware. YOU HEREBY KNOWINGLY AND VOLUNTARILY WAIVE ANY RIGHT TO COMMENCE OR PARTICIPATE IN ANY CLASS ACTION, CLASS ARBITRATION, OR REPRESENTATIVE PROCEEDING. Notwithstanding this section, the Company reserves the sole right to seek equitable, injunctive, or monetary relief against you in any court of competent jurisdiction for intellectual property violations or unpaid fees.

7. UNILATERAL MODIFICATIONS
The Company reserves the right to revise these Terms, adjust subscription pricing, and deprecate platform features at any time in its sole discretion. Continued use of the platform after the posting of revised terms constitutes your binding acceptance.`,
  },
  {
    id: 'freelance-agreement',
    name: 'Freelance Client Agreement',
    badgeText: 'Freelance Client Agreement',
    risk: 'yellow',
    riskClass: 'border-[#FFB800]/50 bg-[#FFB800]/10 text-[#FFB800] hover:bg-[#FFB800]/20',
    description: 'Ambiguous revision loops, 60-day payment delays, late penalties, and asymmetric liability.',
    text: `INDEPENDENT CONTRACTOR SERVICE AGREEMENT
Effective Date: March 1, 2025

1. SERVICES AND SCOPE OF WORK
Contractor agrees to perform the digital design, development, and consulting services specified in Statement of Work #1. Client may request modifications, additional revisions, or changes to deliverables at any time. Contractor shall incorporate reasonable revisions requested by Client without requiring separate written amendments or adjustments to the fixed project fee.

2. PAYMENT TERMS AND MILESTONES
Client shall pay Contractor the total project fee within 60 business days of final milestone delivery and Client acceptance. If Client determines in its sole judgment that any deliverable does not satisfy Client standards, Client reserves the right to withhold up to 50% of the milestone payment until revised deliverables are submitted and approved.

3. INTELLECTUAL PROPERTY AND WORK PRODUCT
Upon Contractor's receipt of full and final payment, Contractor assigns to Client all right, title, and interest in deliverables specifically created for Client. Contractor retains pre-existing tools, libraries, and proprietary design frameworks, granting Client a non-exclusive license to use such background IP solely in connection with the project deliverables.

4. DELAYS AND PENALTIES
Time is of the essence. If Contractor fails to deliver complete deliverables by the agreed milestone date for reasons not caused by Client delay, Client may deduct a late delivery penalty of 2% of the project fee per business day of delay, up to a maximum penalty of 20%.

5. TERMINATION FOR CONVENIENCE
Client may terminate this Agreement at any time with or without cause by providing five (5) calendar days written notice. In the event of early termination, Client shall pay Contractor for hours documented and approved prior to notice of termination. Contractor may terminate this Agreement only upon thirty (30) days prior written notice.

6. LIMITATION OF LIABILITY AND INDEMNITY
Contractor agrees to indemnify Client against third-party claims alleging infringement of intellectual property in the deliverables. Total cumulative liability of either party under this Agreement shall not exceed the total compensation paid by Client to Contractor in the three (3) months preceding the claim.

7. GOVERNING LAW AND VENUE
This Agreement shall be governed by and construed in accordance with the laws of the State of New York.`,
  },
  {
    id: 'fair-saas',
    name: 'Fair Clean EULA',
    badgeText: 'Fair Open Source / Clean EULA',
    risk: 'green',
    riskClass: 'border-[#00C853]/50 bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20',
    description: 'Full data ownership, 1-click cancellation, 30-day refund guarantee, and mutual liability limits.',
    text: `TERMS OF SERVICE - LIBREFLOW PLATFORM
Effective Date: February 1, 2025

1. WELCOME TO LIBREFLOW
LibreFlow provides privacy-first, open-source productivity tools. We believe software terms should be straightforward, honest, and respectful of user autonomy.

2. YOUR CONTENT AND COMPLETE DATA OWNERSHIP
You own 100% of all data, files, text, and intellectual property you create or upload to LibreFlow. We do not sell your data, use your private files to train artificial intelligence models, or claim any copyright over your work. You grant LibreFlow only the minimal technical permission necessary to transmit, backup, and store your files on your behalf.

3. SIMPLE CANCELLATION AND FAIR REFUNDS
You can cancel your subscription at any time with one click inside your account settings. If you cancel, your account remains active until the end of your current paid billing period without surprise renewal charges. If you are dissatisfied with the service within your first 30 days, contact support for a full, no-questions-asked refund.

4. ACCOUNT DELETION AND DATA EXPORT
You can export all your project data in open standard formats (JSON, CSV, ZIP) at any time. When you request account deletion, all personal information and private content are permanently purged from our active databases within 14 business days.

5. SECURITY AND SERVICE COMMITMENT
We maintain industry-standard end-to-end encryption for data in transit and at rest. We commit to a 99.9% uptime target for paid tiers and provide public, transparent post-mortems for any unexpected service disruptions.

6. MUTUAL LIABILITY LIMITS
Neither party shall be liable for indirect, punitive, or consequential damages. Each party's maximum aggregate liability to the other under this agreement is limited to the total fees paid by you to LibreFlow during the preceding twelve (12) months.

7. DISPUTE RESOLUTION AND GOVERNING LAW
If an issue arises, both parties agree to first attempt informal, good-faith resolution for thirty (30) days. Any remaining disputes shall be governed by the laws of the user's home state or country, and both parties preserve their full rights to access standard courts of law.`,
  },
];

export const DIFF_PRESET: DiffSample = {
  id: 'saas-renewal-change',
  name: 'SaaS Agreement (2024 Clean vs 2025 Updated Terms)',
  originalText: `TERMS OF SERVICE 2024 - CREATIVEHUB
1. USER CONTENT OWNERSHIP
You retain full ownership of all designs, illustrations, and code uploaded to CreativeHub. We never license, sell, or train AI models on your work.

2. CANCELLATION & REFUNDS
You may cancel your subscription at any time. If you cancel within the first 14 days, you receive a full refund.

3. LIMITATION OF LIABILITY
Each party's maximum liability is limited to fees paid during the prior 12 months.

4. DISPUTE RESOLUTION
Any disputes shall be resolved in ordinary civil courts in the user's jurisdiction.`,
  updatedText: `TERMS OF SERVICE 2025 - CREATIVEHUB (UPDATED)
1. USER CONTENT AND AI TRAINING LICENSE
You grant CreativeHub a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify, distribute, and train proprietary machine learning and AI generative models on all uploaded user content without further notice or compensation.

2. CANCELLATION WINDOW AND NO REFUNDS
Subscriptions auto-renew each month. Cancellations must be made at least 7 days before billing. All fees are strictly non-refundable.

3. SEVERE LIABILITY CAP
CreativeHub's total aggregate liability for any reason is strictly limited to $25.00.

4. MANDATORY BINDING ARBITRATION
All disputes must be resolved through binding individual arbitration in Delaware with an absolute waiver of class-action rights.`,
};

export const riskStyles: Record<RiskLevel, { border: string; badge: string; ink: string; name: string }> = {
  red: { border: 'border-l-[#FF3B3B]', badge: 'bg-[#FF3B3B]', ink: 'text-[#FF3B3B]', name: 'Red' },
  yellow: { border: 'border-l-[#FFB800]', badge: 'bg-[#FFB800]', ink: 'text-[#FFB800]', name: 'Yellow' },
  green: { border: 'border-l-[#00C853]', badge: 'bg-[#00C853]', ink: 'text-[#00C853]', name: 'Green' },
};
