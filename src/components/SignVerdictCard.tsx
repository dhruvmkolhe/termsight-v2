import { useMemo, useState } from 'react';
import { CheckSquare, Mail, ShieldAlert, ShieldCheck, ShieldX, Square } from 'lucide-react';
import { computeFairnessScore } from '../utils/scoring';
import { useLanguage } from '../context/LanguageContext';
import type { Analysis, Clause, RiskLevel } from '../types/contract';

export function SignVerdictCard({
  analysis,
  onOpenNegotiate,
}: {
  analysis: Analysis;
  onOpenNegotiate: (clause: Clause) => void;
}) {
  const { t } = useLanguage();
  const scoreMeta = computeFairnessScore(analysis);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Generate actionable pre-signing checklist items
  const checklist = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      risk: RiskLevel;
      action: string;
      clause?: Clause;
    }> = [];

    // Red flag items
    analysis.clauses
      .filter((c) => c.risk_level === 'red')
      .forEach((c, idx) => {
        items.push({
          id: `red-${idx}`,
          title: `Demand amendment on "${c.title}" [${c.risk_label.toUpperCase()}]`,
          risk: 'red',
          action: c.what_to_do,
          clause: c,
        });
      });

    // Yellow flag items
    analysis.clauses
      .filter((c) => c.risk_level === 'yellow')
      .forEach((c, idx) => {
        items.push({
          id: `yellow-${idx}`,
          title: `Clarify terms on "${c.title}" [${c.risk_label.toUpperCase()}]`,
          risk: 'yellow',
          action: c.what_to_do,
          clause: c,
        });
      });

    // Safeguard baseline item
    items.push({
      id: 'general-save',
      title: 'Download and archive a timestamped copy of this audit report',
      risk: 'green',
      action: 'Always retain a copy of the exact terms in effect at the time you sign or accept.',
    });

    return items;
  }, [analysis.clauses]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedCount = checkedItems.size;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  // Verdict calculation
  const isDoNotSign = analysis.red_count >= 2 || scoreMeta.score < 50;
  const isNegotiate = !isDoNotSign && (analysis.red_count === 1 || analysis.yellow_count >= 2 || scoreMeta.score < 85);

  const verdictConfig = isDoNotSign
    ? {
        verdict: t('verdictDoNotSign', 'DO NOT SIGN'),
        badge: 'bg-[#FF3B3B] text-white border-[#FF3B3B]',
        border: 'border-[#FF3B3B]',
        icon: <ShieldX className="text-[#FF3B3B]" size={36} />,
        headline: 'Do Not Sign Without Key Amendments',
        detail:
          'Critical predatory clauses detected that strip intellectual property rights, impose one-sided arbitration, or trap you in non-refundable recurring renewals.',
      }
    : isNegotiate
    ? {
        verdict: t('verdictNegotiate', 'NEGOTIATE FIRST'),
        badge: 'bg-[#FFB800] text-black border-[#FFB800]',
        border: 'border-[#FFB800]',
        icon: <ShieldAlert className="text-[#FFB800]" size={36} />,
        headline: 'Proceed With Caution (Negotiate 2–3 Terms)',
        detail:
          'Generally commercial terms overall, but contains specific unfavorable liability, cancellation, or data retention clauses that require pushback before signing.',
      }
    : {
        verdict: t('verdictSafe', 'SAFE TO SIGN'),
        badge: 'bg-[#00C853] text-white border-[#00C853]',
        border: 'border-[#00C853]',
        icon: <ShieldCheck className="text-[#00C853]" size={36} />,
        headline: 'Safe & Consumer-Friendly Agreement',
        detail:
          'Standard, fair contract terms with clean data ownership, reasonable liability limits, and no hidden predatory traps identified.',
      };

  return (
    <div className={`mb-8 border-2 ${verdictConfig.border} bg-[#111111] p-6 sm:p-8`}>
      {/* Verdict Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-1 bg-black/40 rounded-sm">{verdictConfig.icon}</div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                {t('verdictTitle', 'Executive Action Verdict')}
              </span>
              <span className={`border px-3 py-0.5 text-xs font-black uppercase tracking-wider ${verdictConfig.badge}`}>
                {verdictConfig.verdict}
              </span>
            </div>
            <h3 className="mt-1 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
              {verdictConfig.headline}
            </h3>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-zinc-300">
              {verdictConfig.detail}
            </p>
          </div>
        </div>

        {/* Progress Box */}
        <div className="shrink-0 border border-white/15 bg-black/60 p-4 sm:min-w-[200px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 uppercase">Review Progress</span>
            <span className="font-bold text-white">{completedCount}/{totalCount} Done</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden bg-white/10">
            <div
              className="h-full bg-[#00C853] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 text-right font-mono text-[10px] text-zinc-400">{progressPercent}% Addressed</div>
        </div>
      </div>

      {/* Interactive Action Checklist */}
      <div className="mt-7 border-t border-white/15 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-white">
            <CheckSquare size={16} className="text-[#38BDF8]" /> Pre-Signing Action Checklist ({checklist.length} items)
          </h4>
          <div className="flex gap-2 text-[11px] font-mono text-zinc-400">
            <button
              type="button"
              onClick={() => setCheckedItems(new Set(checklist.map((i) => i.id)))}
              className="hover:text-white underline"
            >
              Check All
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setCheckedItems(new Set())}
              className="hover:text-white underline"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => {
            const isChecked = checkedItems.has(item.id);
            const riskColor =
              item.risk === 'red'
                ? 'border-l-[#FF3B3B] bg-[#FF3B3B]/5'
                : item.risk === 'yellow'
                ? 'border-l-[#FFB800] bg-[#FFB800]/5'
                : 'border-l-[#00C853] bg-[#00C853]/5';

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex cursor-pointer items-start justify-between gap-3 border border-white/10 border-l-4 ${riskColor} p-3.5 transition hover:bg-white/[0.04] ${
                  isChecked ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    aria-label={isChecked ? 'Mark uncompleted' : 'Mark completed'}
                    className="mt-0.5 shrink-0 text-white"
                  >
                    {isChecked ? <CheckSquare size={18} className="text-[#00C853]" /> : <Square size={18} className="text-zinc-500" />}
                  </button>
                  <div>
                    <span className={`text-sm font-bold ${isChecked ? 'line-through text-zinc-400' : 'text-white'}`}>
                      {item.title}
                    </span>
                    <p className="mt-0.5 text-xs text-zinc-400">{item.action}</p>
                  </div>
                </div>

                {item.clause && item.risk !== 'green' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenNegotiate(item.clause!);
                    }}
                    className="shrink-0 inline-flex items-center gap-1 border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black"
                  >
                    <Mail size={11} /> Redline
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
