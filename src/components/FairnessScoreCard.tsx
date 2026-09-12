import { computeFairnessScore } from '../utils/scoring';
import type { Analysis } from '../types/contract';

export function FairnessScoreCard({ analysis }: { analysis: Analysis }) {
  const meta = computeFairnessScore(analysis);

  return (
    <div className="mb-8 border border-white/20 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className={`flex h-20 w-20 shrink-0 items-center justify-center border-2 ${meta.border} bg-black font-display text-4xl font-black ${meta.color} shadow-lg sm:h-24 sm:w-24 sm:text-5xl`}>
            {meta.grade}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300">Fairness Rating</span>
              <span className={`border px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${meta.badgeBg}`}>
                {meta.label}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">{meta.score}</span>
              <span className="text-sm font-bold text-zinc-400">/ 100 Health Score</span>
            </div>
            <p className="mt-1 max-w-xl text-xs font-medium text-zinc-300 sm:text-sm">{meta.summary}</p>
          </div>
        </div>

        {/* Visual score bar */}
        <div className="w-full md:max-w-xs">
          <div className="mb-2 flex justify-between text-[11px] font-mono font-bold uppercase text-zinc-400">
            <span>Score Meter</span>
            <span className={meta.color}>{meta.score}%</span>
          </div>
          <div className="h-3.5 w-full overflow-hidden bg-white/10 p-0.5">
            <div
              className={`h-full ${meta.bg} transition-all duration-700`}
              style={{ width: `${meta.score}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-zinc-400">
            <span>0 (Hazard)</span>
            <span>50 (Caution)</span>
            <span>100 (Clean)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
