import { useState } from 'react';
import { Check, Clipboard, Share2, X } from 'lucide-react';
import { computeFairnessScore } from '../utils/scoring';
import type { Analysis } from '../types/contract';

export function ShareModal({
  isOpen,
  onClose,
  analysis,
}: {
  isOpen: boolean;
  onClose: () => void;
  analysis: Analysis | null;
}) {
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  if (!isOpen || !analysis) return null;

  const scoreInfo = computeFairnessScore(analysis);

  const markdownSummary = `### TermSight Contract Audit: ${analysis.title}
- **Fairness Grade**: ${scoreInfo.grade} (${scoreInfo.score}/100)
- **Risk Breakdown**: ${analysis.red_count} Red Flags, ${analysis.yellow_count} Caution, ${analysis.green_count} Standard
- **Audited**: ${new Date(analysis.created_at).toLocaleDateString()}

${analysis.clauses.map((c, i) => `${i + 1}. **${c.title}** [${c.risk_label.toUpperCase()}]\n${c.plain_english}\n*Action*: ${c.what_to_do}`).join('\n\n')}`;

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdownSummary);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg border border-white/20 bg-[#0E0E0E] p-6 text-white shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-[#38BDF8]" />
            <h3 className="font-display text-xl font-black uppercase">Share Audit Summary</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 bg-white/[0.04] p-4">
          <h4 className="font-display font-bold text-white">{analysis.title}</h4>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Score: <strong className={scoreInfo.color}>{scoreInfo.score}/100 (Grade {scoreInfo.grade})</strong> · {analysis.clauses.length} clauses reviewed
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={copyMarkdown}
            className="flex w-full items-center justify-center gap-2 border-2 border-white bg-white py-3 font-display text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
          >
            {copiedMarkdown ? <Check size={16} /> : <Clipboard size={16} />}
            {copiedMarkdown ? 'Markdown Copied!' : 'Copy Formatted Markdown Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
