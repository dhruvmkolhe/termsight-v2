import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, FileText, Layers, ShieldAlert, Sparkles, Target } from 'lucide-react';
import type { RagRetrievedWindow } from '../types/rag';

interface Props {
  window: RagRetrievedWindow;
  index: number;
  onJumpToDocument?: (startChar: number, endChar: number) => void;
  onOpenNegotiate?: (clauseTitle: string, quote: string) => void;
}

export function SentenceWindowCard({
  window: item,
  index,
  onJumpToDocument,
  onOpenNegotiate,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `[${item.sectionTitle} - Line ${item.lineNumber}]\nFocal Sentence: "${item.focalSentence}"\nFull Window Context: "${item.windowText}"`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const domainLabels: Record<string, { label: string; color: string; border: string }> = {
    indemnity: { label: 'Indemnity & Defense', color: 'bg-rose-500/15 text-rose-400', border: 'border-rose-500/40' },
    liability: { label: 'Liability & Damages', color: 'bg-amber-500/15 text-amber-400', border: 'border-amber-500/40' },
    termination: { label: 'Termination & Cancellation', color: 'bg-orange-500/15 text-orange-400', border: 'border-orange-500/40' },
    ip_ownership: { label: 'IP & AI Rights', color: 'bg-purple-500/15 text-purple-400', border: 'border-purple-500/40' },
    payment_fees: { label: 'Payment & Financials', color: 'bg-emerald-500/15 text-emerald-400', border: 'border-emerald-500/40' },
    dispute_arbitration: { label: 'Disputes & Arbitration', color: 'bg-cyan-500/15 text-cyan-400', border: 'border-cyan-500/40' },
    privacy_data: { label: 'Data Privacy & GDPR', color: 'bg-blue-500/15 text-blue-400', border: 'border-blue-500/40' },
    restrictive_covenants: { label: 'Restrictive Covenants', color: 'bg-yellow-500/15 text-yellow-400', border: 'border-yellow-500/40' },
    unilateral_changes: { label: 'Unilateral Modifications', color: 'bg-red-500/15 text-red-400', border: 'border-red-500/40' },
    general: { label: 'Contract Clause', color: 'bg-zinc-800 text-zinc-300', border: 'border-white/20' },
  };

  const domainInfo = domainLabels[item.domainCategory] || domainLabels.general;

  return (
    <div className="border border-white/20 bg-black/60 transition hover:border-[#38BDF8]/60">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#38BDF8]/20 font-mono text-xs font-black text-[#38BDF8]">
            #{index + 1}
          </span>
          <span className="font-display text-sm font-black text-white">
            {item.sectionTitle}
          </span>
          <span className={`border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${domainInfo.color} ${domainInfo.border}`}>
            {domainInfo.label}
          </span>
        </div>

        {/* Scores & Metadata */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400" title="Hybrid Score = Dense Cosine + BM25 Lexical + Reciprocal Rank Fusion">
            <Sparkles size={13} className="text-[#38BDF8]" />
            <span className="font-bold text-[#38BDF8]">{item.relevanceScore}% Match</span>
          </div>
          <span className="hidden sm:inline font-mono text-[11px] text-zinc-500">
            Line {item.lineNumber}
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-400 hover:text-white"
            title={isExpanded ? 'Collapse Context Window' : 'Expand Context Window'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5">
        {/* Focal Sentence (Target of Embedding & Match) */}
        <div className="mb-3 border-l-4 border-[#38BDF8] bg-[#38BDF8]/10 p-3.5 sm:p-4">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-black uppercase tracking-wider text-[#38BDF8]">
            <Target size={13} /> Target Focal Sentence (Indexed Unit)
          </div>
          <p className="font-mono text-xs sm:text-sm font-semibold leading-relaxed text-white">
            "{item.focalSentence}"
          </p>
        </div>

        {/* Surrounding Context Window */}
        {isExpanded && (
          <div className="mt-3 border border-white/10 bg-black/40 p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-zinc-400">
                <Layers size={13} className="text-zinc-300" />
                <span>Expanded Sentence Window ({item.windowSentences.length} sentences context)</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">
                Chars {item.startChar}–{item.endChar}
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-zinc-300">
              {item.windowSentences.map((s, sIdx) => {
                const isFocal = s.trim() === item.focalSentence.trim();
                return (
                  <span
                    key={sIdx}
                    className={
                      isFocal
                        ? 'bg-[#38BDF8]/20 font-bold text-white px-1 py-0.5 rounded'
                        : 'text-zinc-400'
                    }
                  >
                    {s}{' '}
                  </span>
                );
              })}
            </p>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            {onJumpToDocument && (
              <button
                type="button"
                onClick={() => onJumpToDocument(item.startChar, item.endChar)}
                className="inline-flex items-center gap-1.5 border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-mono text-zinc-300 transition hover:border-white hover:text-white"
              >
                <FileText size={12} /> Jump to Document
              </button>
            )}
            {onOpenNegotiate && (
              <button
                type="button"
                onClick={() => onOpenNegotiate(item.sectionTitle, item.focalSentence)}
                className="inline-flex items-center gap-1.5 border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2.5 py-1 text-xs font-mono text-[#38BDF8] transition hover:bg-[#38BDF8]/20"
              >
                <ShieldAlert size={12} /> Counter-Draft
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white"
          >
            {copied ? <Check size={12} className="text-[#00C853]" /> : <Copy size={12} />}
            {copied ? 'Citation Copied' : 'Copy Citation'}
          </button>
        </div>
      </div>
    </div>
  );
}
