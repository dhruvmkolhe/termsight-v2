import type { Analysis, DeadlineItem } from '../types/contract';

export function extractContractDeadlines(analysis: Analysis, sourceText: string): DeadlineItem[] {
  const deadlines: DeadlineItem[] = [];
  const fullText = (sourceText + ' ' + analysis.clauses.map(c => `${c.title} ${c.plain_english} ${c.quote}`).join(' ')).toLowerCase();

  // 1. Cancellation & Auto-renewal Window
  const cancelMatch = fullText.match(/(\d+|one|two|three|four|five|six|seven|ten|fourteen|thirty)\s+(?:business\s+|calendar\s+)?(days?|hours?|weeks?|months?)\s+(?:prior|before|advance)/i)
    || fullText.match(/cancel(?:lation)?\s+(?:within|at least|prior to)?\s*(\d+|one|two|three|four|five|six|seven|ten|fourteen|thirty)\s+(?:business\s+|calendar\s+)?(days?|hours?|weeks?|months?)/i);

  if (cancelMatch || fullText.includes('renew') || fullText.includes('cancel')) {
    const timeStr = cancelMatch ? `${cancelMatch[1]} ${cancelMatch[2]}` : '5–7 business days';
    const quoteClause = analysis.clauses.find(c => c.title.toLowerCase().includes('renewal') || c.title.toLowerCase().includes('cancel') || c.quote.toLowerCase().includes('renew') || c.quote.toLowerCase().includes('cancel'));
    deadlines.push({
      id: 'cancel-renewal',
      title: 'Subscription Cancellation Window',
      category: 'cancellation',
      timeframe: `At least ${timeStr} before renewal`,
      daysOffset: 25,
      description: `Submit written cancellation at least ${timeStr} prior to billing cycle end to prevent automatic non-refundable renewal fees.`,
      quote: quoteClause ? quoteClause.quote : 'Subscriptions automatically renew unless cancelled within the specified advance notice window.',
      urgency: 'high',
    });
  }

  // 2. Invoice & Milestone Payment Terms
  const paymentMatch = fullText.match(/(?:pay|payment|invoice|fee|net)[^\n.]{0,40}(\d+|fifteen|thirty|forty-five|sixty|ninety)\s+(?:business\s+|calendar\s+)?(days?|months?)/i);
  if (paymentMatch || fullText.includes('payment') || fullText.includes('milestone') || fullText.includes('fee')) {
    const timeStr = paymentMatch ? `${paymentMatch[1]} ${paymentMatch[2]}` : '30–60 days';
    const quoteClause = analysis.clauses.find(c => c.title.toLowerCase().includes('payment') || c.title.toLowerCase().includes('fee') || c.quote.toLowerCase().includes('pay') || c.quote.toLowerCase().includes('fee'));
    deadlines.push({
      id: 'payment-terms',
      title: 'Invoice Settlement & Payment Term',
      category: 'payment',
      timeframe: `Within ${timeStr} of delivery`,
      daysOffset: 30,
      description: `Invoices and milestone approvals must be disbursed within ${timeStr} to avoid late delivery fees or dispute escalation.`,
      quote: quoteClause ? quoteClause.quote : 'Client shall pay project fees within the agreed milestone timeframe upon acceptance.',
      urgency: 'medium',
    });
  }

  // 3. 30-Day Mandatory Arbitration Opt-Out Deadline
  const hasArbitration = analysis.clauses.some(c => c.title.toLowerCase().includes('arbitrat') || c.quote.toLowerCase().includes('arbitrat'));
  if (hasArbitration) {
    const quoteClause = analysis.clauses.find(c => c.title.toLowerCase().includes('arbitrat') || c.quote.toLowerCase().includes('arbitrat'));
    deadlines.push({
      id: 'arbitration-optout',
      title: '30-Day Arbitration Opt-Out Window',
      category: 'dispute',
      timeframe: 'Within 30 calendar days of signing',
      daysOffset: 28,
      description: 'Under consumer arbitration rules, you must send a formal opt-out notice within 30 days to preserve your right to sue in civil court or participate in class actions.',
      quote: quoteClause ? quoteClause.quote : 'Disputes resolved exclusively via binding individual arbitration unless opted out within 30 days.',
      urgency: 'high',
    });
  }

  // 4. Data Deletion & Account Purge Window
  const purgeMatch = fullText.match(/(?:purge|delete|retention|retain|erasure|wiped?)[^\n.]{0,35}(\d+|seven|fourteen|thirty|sixty|ninety)\s+(?:business\s+|calendar\s+)?(days?|months?)/i);
  if (purgeMatch || fullText.includes('delete') || fullText.includes('retention') || fullText.includes('gdpr')) {
    const timeStr = purgeMatch ? `${purgeMatch[1]} ${purgeMatch[2]}` : '14–30 business days';
    const quoteClause = analysis.clauses.find(c => c.title.toLowerCase().includes('data') || c.title.toLowerCase().includes('privacy') || c.quote.toLowerCase().includes('delete') || c.quote.toLowerCase().includes('retain'));
    deadlines.push({
      id: 'data-purge',
      title: 'Data Purge & File Erasure Follow-up',
      category: 'privacy',
      timeframe: `Within ${timeStr} of termination`,
      daysOffset: 14,
      description: `Follow up with the provider to verify that all personal records, files, and AI training caches have been expunged within ${timeStr}.`,
      quote: quoteClause ? quoteClause.quote : 'Personal data and private content are permanently purged following verified account closure.',
      urgency: 'low',
    });
  }

  // 5. Informal Dispute Resolution Period
  const disputeMatch = fullText.match(/(?:informal|good-faith|negotiat|cure)[^\n.]{0,30}(\d+|fourteen|thirty|sixty)\s+(?:business\s+|calendar\s+)?(days?)/i);
  if (disputeMatch || fullText.includes('informal') || fullText.includes('cure period')) {
    const timeStr = disputeMatch ? `${disputeMatch[1]} ${disputeMatch[2]}` : '30 days';
    const quoteClause = analysis.clauses.find(c => c.title.toLowerCase().includes('dispute') || c.quote.toLowerCase().includes('dispute') || c.quote.toLowerCase().includes('informal'));
    deadlines.push({
      id: 'dispute-cure',
      title: 'Informal Dispute & Cure Window',
      category: 'dispute',
      timeframe: `${timeStr} good-faith period`,
      daysOffset: 30,
      description: `Mandatory ${timeStr} informal good-faith negotiation period required prior to lodging formal arbitration or court claims.`,
      quote: quoteClause ? quoteClause.quote : 'Both parties agree to first attempt informal good-faith resolution prior to formal claims.',
      urgency: 'low',
    });
  }

  return deadlines;
}

export function createGoogleCalendarUrl(item: DeadlineItem, docTitle: string): string {
  const title = encodeURIComponent(`Contract Deadline: ${item.title} (${docTitle || 'Agreement'})`);
  const details = encodeURIComponent(`${item.description}\n\nNotice Window: ${item.timeframe}\n\nVerbatim Contract Clause:\n"${item.quote}"\n\nAudited by TermSight AI.`);
  
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + (item.daysOffset || 7));
  targetDate.setHours(9, 0, 0, 0);
  const endDate = new Date(targetDate.getTime() + 60 * 60 * 1000);
  
  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const dates = `${formatDate(targetDate)}/${formatDate(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
}

export function downloadIcsCalendar(item: DeadlineItem, docTitle: string) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + (item.daysOffset || 7));
  targetDate.setHours(9, 0, 0, 0);
  const endDate = new Date(targetDate.getTime() + 60 * 60 * 1000);

  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TermSight//Legal Contract Auditor//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${item.id}@termsight.local`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(targetDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:Contract Deadline: ${item.title} (${docTitle || 'Agreement'})`,
    `DESCRIPTION:${item.description.replace(/\n/g, '\\n')} - Clause: ${item.quote.replace(/\n/g, '\\n')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 40)}_reminder.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
