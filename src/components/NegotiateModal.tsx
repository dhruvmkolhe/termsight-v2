import { useState } from 'react';
import { Check, Clipboard, Mail, X } from 'lucide-react';
import { generateNegotiationProposal } from '../utils/proposals';
import type { Clause } from '../types/contract';

export function NegotiateModal({
  clause,
  documentTitle,
  onClose,
}: {
  clause: Clause | null;
  documentTitle: string;
  onClose: () => void;
}) {
  const [copiedClause, setCopiedClause] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!clause) return null;

  const proposal = generateNegotiationProposal(clause, documentTitle);

  const copyClause = async () => {
    await navigator.clipboard.writeText(proposal.redline);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2000);
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(proposal.emailDraft);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/20 bg-[#0E0E0E] p-6 text-white shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#FFB800]">
              <Mail size={15} /> Counter-Proposal & Redline Generator
            </div>
            <h3 className="mt-1 font-display text-2xl font-black">{clause.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Original Clause Quote */}
        <div className="mb-5 bg-black/60 p-4">
          <div className="mb-1 font-mono text-[11px] font-bold uppercase text-[#FF3B3B]">Problematic Quote in Agreement:</div>
          <p className="font-mono text-xs italic text-zinc-300">“{clause.quote}”</p>
        </div>

        {/* Redline Proposal */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#00C853]">1. Fair Replacement Redline Clause:</span>
            <button
              type="button"
              onClick={copyClause}
              className="inline-flex items-center gap-1 border border-white/30 bg-white/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black"
            >
              {copiedClause ? <Check size={13} /> : <Clipboard size={13} />}
              {copiedClause ? 'Copied' : 'Copy Clause'}
            </button>
          </div>
          <div className="border border-[#00C853]/40 bg-[#00C853]/5 p-4 font-mono text-xs leading-5 text-white">
            {proposal.redline}
          </div>
        </div>

        {/* Ready Email Draft */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#38BDF8]">2. Ready-to-Send Email to Counterparty:</span>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-1 border border-white/30 bg-white/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black"
            >
              {copiedEmail ? <Check size={13} /> : <Mail size={13} />}
              {copiedEmail ? 'Copied Email' : 'Copy Email'}
            </button>
          </div>
          <textarea
            readOnly
            value={proposal.emailDraft}
            rows={8}
            className="w-full border border-white/20 bg-black p-3 font-mono text-xs leading-5 text-zinc-300 focus:outline-none"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-white/30 px-5 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white hover:text-black"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
