import { useMemo, useState } from 'react';
import { Check, Clipboard, Download, FileSearch, RotateCcw, Scale, Search, Share2, X } from 'lucide-react';
import { AskContractSection } from './AskContractSection';
import { ClauseCard } from './ClauseCard';
import { DeadlinesTimelineSection } from './DeadlinesTimelineSection';
import { FairnessScoreCard } from './FairnessScoreCard';
import { SignVerdictCard } from './SignVerdictCard';
import { useLanguage } from '../context/LanguageContext';
import type { Analysis, Clause, RiskLevel } from '../types/contract';

export function Results({
  analysis,
  copied,
  onCopy,
  onOpenNegotiate,
  onOpenShare,
  onOpenNotices,
}: {
  analysis: Analysis;
  copied: boolean;
  onCopy: () => void;
  onOpenNegotiate: (clause: Clause) => void;
  onOpenShare: () => void;
  onOpenNotices: () => void;
}) {
  const { t } = useLanguage();
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const total = analysis.clauses.length;

  const filteredClauses = useMemo(() => {
    return analysis.clauses.filter((clause) => {
      if (selectedRisk !== 'all' && clause.risk_level !== selectedRisk) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          clause.title.toLowerCase().includes(query) ||
          clause.plain_english.toLowerCase().includes(query) ||
          clause.quote.toLowerCase().includes(query) ||
          clause.risk_label.toLowerCase().includes(query) ||
          clause.what_to_do.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [analysis.clauses, selectedRisk, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="results" className="scroll-mt-6 border-t border-white/15 pt-10 sm:pt-14">
      <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-200">
            <FileSearch size={15} /> {t('resultsComplete', 'Contract read complete')}
          </div>
          <h2 className="font-display text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">
            {total} {t('resultsClauses', 'clauses. No fog.')}
          </h2>
        </div>

        {/* Action Buttons: Copy, PDF Export, Legal Notices, Share */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-white bg-white px-4 font-display text-xs font-black uppercase tracking-[0.08em] text-black transition hover:bg-black hover:text-white focus:outline-none"
          >
            {copied ? <Check size={16} strokeWidth={3} /> : <Clipboard size={16} strokeWidth={2.5} />}
            {copied ? t('copied', 'Copied') : t('copySummary', 'Copy summary')}
          </button>
          <button
            type="button"
            onClick={onOpenNotices}
            title="Generate Formal Legal Letters (Arbitration Opt-out, GDPR purge, Cancellation)"
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#38BDF8]/50 bg-[#38BDF8]/10 px-4 font-display text-xs font-black uppercase tracking-[0.08em] text-[#38BDF8] transition hover:bg-[#38BDF8] hover:text-black focus:outline-none"
          >
            <Scale size={15} /> {t('legalNotices', 'Legal Notices')}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            title="Download / Print 1-Page Summary PDF"
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/30 bg-white/5 px-4 font-display text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-white hover:text-black focus:outline-none"
          >
            <Download size={15} /> {t('printPdf', 'Print / Save PDF')}
          </button>
          <button
            type="button"
            onClick={onOpenShare}
            title="Share Audit Report"
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/30 bg-white/5 px-3 font-display text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-white hover:text-black focus:outline-none"
          >
            <Share2 size={15} /> {t('shareReport', 'Share')}
          </button>
        </div>
      </div>

      {/* Feature 1: "Sign or Don't Sign" Verdict & Interactive Action Checklist */}
      <SignVerdictCard analysis={analysis} onOpenNegotiate={onOpenNegotiate} />

      {/* Fairness & Health Score Meter */}
      <FairnessScoreCard analysis={analysis} />

      {/* Feature 2: Key Deadlines & Calendar Reminders Section */}
      <DeadlinesTimelineSection analysis={analysis} />

      {/* Feature G: Ask This Contract (Instant Q&A) */}
      <AskContractSection analysis={analysis} />

      {/* Feature B: Filter Clauses by Risk & Live Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Risk Level Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedRisk('all')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
                selectedRisk === 'all'
                  ? 'border-2 border-white bg-white text-black'
                  : 'border border-white/25 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t('filterAll', 'All')} ({total})
            </button>
            <button
              type="button"
              onClick={() => setSelectedRisk('red')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
                selectedRisk === 'red'
                  ? 'border-2 border-[#FF3B3B] bg-[#FF3B3B] text-white shadow-sm'
                  : 'border border-[#FF3B3B]/40 bg-[#FF3B3B]/10 text-[#FF3B3B] hover:bg-[#FF3B3B]/20'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#FF3B3B]" />
              {analysis.red_count} {t('filterRed', 'Red Flags')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedRisk('yellow')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
                selectedRisk === 'yellow'
                  ? 'border-2 border-[#FFB800] bg-[#FFB800] text-black shadow-sm'
                  : 'border border-[#FFB800]/40 bg-[#FFB800]/10 text-[#FFB800] hover:bg-[#FFB800]/20'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#FFB800]" />
              {analysis.yellow_count} {t('filterYellow', 'Caution')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedRisk('green')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
                selectedRisk === 'green'
                  ? 'border-2 border-[#00C853] bg-[#00C853] text-white shadow-sm'
                  : 'border border-[#00C853]/40 bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#00C853]" />
              {analysis.green_count} {t('filterGreen', 'Standard')}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses (e.g. arbitration, liability, refund)..."
              className="w-full border border-white/25 bg-black py-2 pl-9 pr-8 text-xs font-medium text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Showing count text */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono text-zinc-400">
          <span>
            Showing <strong className="text-white">{filteredClauses.length}</strong> of {total} clauses
            {selectedRisk !== 'all' && <span> (filtered by {selectedRisk})</span>}
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </span>
          {(selectedRisk !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedRisk('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#38BDF8] hover:underline"
            >
              <RotateCcw size={12} /> Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Clause Cards List */}
      {filteredClauses.length > 0 ? (
        <div className="space-y-4">
          {filteredClauses.map((clause, index) => (
            <ClauseCard
              key={`${clause.title}-${index}`}
              clause={clause}
              index={index}
              onNegotiate={onOpenNegotiate}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-white/20 p-12 text-center">
          <p className="text-base font-bold text-zinc-300">No clauses match your filter criteria.</p>
          <p className="mt-1 text-xs text-zinc-500">Try selecting "All" or clearing your search term.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedRisk('all');
              setSearchQuery('');
            }}
            className="mt-4 border border-white/30 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white hover:text-black"
          >
            Show all clauses
          </button>
        </div>
      )}

      <p className="mt-8 text-xs font-medium leading-5 text-zinc-400">
        TermSight provides plain-language information, not legal advice. For high-stakes agreements, speak with a qualified lawyer.
      </p>
    </section>
  );
}
