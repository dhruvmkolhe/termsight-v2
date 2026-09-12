import { AlertTriangle, GitCompare } from 'lucide-react';
import { riskStyles } from '../constants/contracts';
import { computeFairnessScore } from '../utils/scoring';
import type { Analysis } from '../types/contract';

export function ContractDiffView({
  originalAnalysis,
  updatedAnalysis,
}: {
  originalAnalysis: Analysis;
  updatedAnalysis: Analysis;
}) {
  const origScore = computeFairnessScore(originalAnalysis);
  const updatedScore = computeFairnessScore(updatedAnalysis);
  const scoreDiff = updatedScore.score - origScore.score;

  return (
    <section className="mt-10 border border-white/20 bg-white/[0.02] p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#38BDF8]">
        <GitCompare size={16} /> Contract Version Comparison (Diff)
      </div>

      {/* Score Shift Header */}
      <div className="grid grid-cols-1 gap-6 border-b border-white/15 pb-8 md:grid-cols-3">
        <div className="border border-white/15 bg-black/40 p-5">
          <span className="font-mono text-xs text-zinc-400 uppercase">Version 1 (Original)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-display text-3xl font-black ${origScore.color}`}>{origScore.score}</span>
            <span className="text-sm font-bold text-zinc-400">/ 100 ({origScore.grade})</span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">{originalAnalysis.clauses.length} clauses · {originalAnalysis.red_count} Red Flags</p>
        </div>

        <div className="border border-white/15 bg-black/40 p-5">
          <span className="font-mono text-xs text-zinc-400 uppercase">Version 2 (Renewal / Updated)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-display text-3xl font-black ${updatedScore.color}`}>{updatedScore.score}</span>
            <span className="text-sm font-bold text-zinc-400">/ 100 ({updatedScore.grade})</span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">{updatedAnalysis.clauses.length} clauses · {updatedAnalysis.red_count} Red Flags</p>
        </div>

        <div className="flex flex-col justify-center border border-white/15 bg-black/60 p-5">
          <span className="font-mono text-xs text-zinc-400 uppercase">Fairness Shift</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-display text-3xl font-black ${scoreDiff <= 0 ? 'text-[#FF3B3B]' : 'text-[#00C853]'}`}>
              {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}%
            </span>
            <span className="text-xs font-bold text-zinc-300">
              {scoreDiff < 0 ? 'Worse for Consumer' : scoreDiff === 0 ? 'Unchanged' : 'Improved Fairness'}
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-400">
            {updatedAnalysis.red_count > originalAnalysis.red_count ? (
              <span className="inline-flex items-center gap-1 font-medium text-[#FF3B3B]">
                <AlertTriangle size={12} className="shrink-0" />
                Added {updatedAnalysis.red_count - originalAnalysis.red_count} new high-risk red flags
              </span>
            ) : (
              'No new red flags added'
            )}
          </div>
        </div>
      </div>

      {/* Side-by-Side Clause Breakdown */}
      <div className="mt-8">
        <h4 className="mb-4 font-display text-lg font-black uppercase tracking-wider">New & Modified Risk Clauses in Updated Terms:</h4>
        <div className="space-y-4">
          {updatedAnalysis.clauses.map((clause, idx) => {
            const style = riskStyles[clause.risk_level];
            return (
              <div key={idx} className={`border-l-[5px] ${style.border} bg-[#141414] p-5 text-white`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`${style.badge} px-2 py-0.5 font-mono text-[10px] font-black uppercase text-white`}>
                    {clause.risk_label}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">Updated Section {idx + 1}</span>
                </div>
                <h5 className="font-display text-lg font-bold">{clause.title}</h5>
                <p className="mt-1 text-sm text-zinc-300">{clause.plain_english}</p>
                <blockquote className="mt-3 border-l border-white/20 pl-3 font-mono text-xs italic text-zinc-400">
                  “{clause.quote}”
                </blockquote>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
