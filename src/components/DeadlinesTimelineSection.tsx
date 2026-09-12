import { useMemo } from 'react';
import { Calendar, Clock, Download } from 'lucide-react';
import { createGoogleCalendarUrl, downloadIcsCalendar, extractContractDeadlines } from '../utils/deadlines';
import type { Analysis } from '../types/contract';

export function DeadlinesTimelineSection({
  analysis,
}: {
  analysis: Analysis;
}) {
  const deadlines = useMemo(() => extractContractDeadlines(analysis, analysis.source_text || ''), [analysis]);

  if (deadlines.length === 0) return null;

  return (
    <div className="mb-8 border border-white/20 bg-white/[0.03] p-6 sm:p-7">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#38BDF8]">
            <Clock size={16} /> Key Deadlines & Calendar Reminders
          </div>
          <h3 className="mt-1 font-display text-xl font-black text-white">
            Time-Sensitive Obligations ({deadlines.length} Detected)
          </h3>
        </div>
        <p className="text-xs font-medium text-zinc-400">
          1-click export to Google Calendar or Apple/Outlook (.ics)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {deadlines.map((item) => {
          const urgencyBadge =
            item.urgency === 'high'
              ? 'bg-[#FF3B3B]/15 text-[#FF3B3B] border-[#FF3B3B]/40'
              : item.urgency === 'medium'
              ? 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40'
              : 'bg-[#00C853]/15 text-[#00C853] border-[#00C853]/40';

          const gcalUrl = createGoogleCalendarUrl(item, analysis.title);

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between border border-white/15 bg-black/60 p-5 transition hover:border-white/30"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${urgencyBadge}`}>
                    {item.timeframe}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-zinc-500">{item.category}</span>
                </div>
                <h4 className="font-display text-base font-bold text-white">{item.title}</h4>
                <p className="mt-2 text-xs font-medium leading-5 text-zinc-300">{item.description}</p>
                <blockquote className="mt-3 border-l-2 border-white/20 pl-2.5 font-mono text-[11px] italic text-zinc-400">
                  “{item.quote.slice(0, 160)}...”
                </blockquote>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-white/30 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
                >
                  <Calendar size={13} /> Google Calendar
                </a>
                <button
                  type="button"
                  onClick={() => downloadIcsCalendar(item, analysis.title)}
                  className="inline-flex items-center gap-1.5 border border-white/20 bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Download size={13} /> Apple / iCal (.ics)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
