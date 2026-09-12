import { useMemo, useState } from 'react';
import { Ban, Check, Clipboard, Printer, Scale, Trash2, X } from 'lucide-react';
import { generateLegalNotice, type NoticeType } from '../utils/legalNotices';
import type { Analysis } from '../types/contract';

export function LegalNoticesModal({
  isOpen,
  onClose,
  analysis,
}: {
  isOpen: boolean;
  onClose: () => void;
  analysis: Analysis | null;
}) {
  const [activeType, setActiveType] = useState<NoticeType>('arbitration');
  const detectedCompany = useMemo(() => {
    return analysis?.title ? analysis.title.replace(/terms of service|privacy policy|contract|agreement/gi, '').trim() : '';
  }, [analysis]);

  const [companyName, setCompanyName] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !analysis) return null;

  const effectiveCompany = companyName !== null ? companyName : detectedCompany;
  const notice = generateLegalNotice(activeType, analysis.title, effectiveCompany, userName, analysis.clauses);

  const copyNotice = async () => {
    await navigator.clipboard.writeText(notice.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printNotice = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${notice.title}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; line-height: 1.6; padding: 40px; color: #000; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; }
          </style>
        </head>
        <body>
          <pre>${notice.body}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-white/20 bg-[#0E0E0E] p-6 text-white shadow-2xl sm:p-8">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#38BDF8]">
              <Scale size={16} /> 1-Click Formal Legal Notices Generator
            </div>
            <h3 className="mt-1 font-display text-2xl font-black text-white">{notice.title}</h3>
            <p className="mt-1 text-xs text-zinc-400">{notice.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveType('arbitration')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
              activeType === 'arbitration' ? 'border-b-2 border-[#FF3B3B] text-[#FF3B3B]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scale size={14} /> 30-Day Arbitration Opt-Out
          </button>
          <button
            type="button"
            onClick={() => setActiveType('datapurge')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
              activeType === 'datapurge' ? 'border-b-2 border-[#38BDF8] text-[#38BDF8]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Trash2 size={14} /> GDPR / CCPA Data Purge
          </button>
          <button
            type="button"
            onClick={() => setActiveType('cancellation')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
              activeType === 'cancellation' ? 'border-b-2 border-[#FFB800] text-[#FFB800]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Ban size={14} /> Formal Cancellation
          </button>
        </div>

        {/* Customization Inputs */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 bg-white/[0.03] p-3 border border-white/10">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-zinc-400">Company / Counterparty</label>
            <input
              type="text"
              value={effectiveCompany}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. SyntheticVox AI Inc."
              className="mt-1 w-full border border-white/20 bg-black px-3 py-1.5 text-xs text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-zinc-400">Your Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="mt-1 w-full border border-white/20 bg-black px-3 py-1.5 text-xs text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>

        {/* Formatted Letter */}
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-zinc-400">Ready Formal Document:</span>
            <span className="font-mono text-[10px] text-zinc-500">Subject: {notice.subject}</span>
          </div>
          <textarea
            readOnly
            value={notice.body}
            rows={12}
            className="w-full border border-white/20 bg-black p-4 font-mono text-xs leading-5 text-zinc-200 focus:outline-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyNotice}
              className="inline-flex items-center gap-1.5 border-2 border-white bg-white px-5 py-2 font-display text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
            >
              {copied ? <Check size={14} /> : <Clipboard size={14} />}
              {copied ? 'Copied to Clipboard!' : 'Copy Notice'}
            </button>
            <button
              type="button"
              onClick={printNotice}
              className="inline-flex items-center gap-1.5 border border-white/30 bg-white/5 px-4 py-2 font-display text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
            >
              <Printer size={14} /> Print Letter
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/20 px-4 py-2 text-xs font-bold uppercase text-zinc-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
