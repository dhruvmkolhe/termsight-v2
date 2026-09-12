import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Cpu,
  FileSearch,
  FileText,
  Gavel,
  Layers,
  Lightbulb,
  LoaderCircle,
  Scale,
  Search,
  ShieldAlert,
  Sliders,
  UploadCloud,
  Zap,
} from 'lucide-react';
import { QUICK_ACTION_QUERIES, RAG_PRESET_CONTRACTS } from '../constants/ragContracts';
import { buildSentenceWindowIndex, executeRagQuery } from '../utils/ragEngine';
import { SentenceWindowCard } from './SentenceWindowCard';
import type { Clause } from '../types/contract';
import type { QuickActionQuery, RagIndex, RagPresetContract, RagQueryResult } from '../types/rag';

interface Props {
  initialText?: string;
  onOpenNegotiate?: (clause: Clause) => void;
}

export function RagProDashboard({ initialText, onOpenNegotiate }: Props) {
  // Document state
  const [selectedPresetId, setSelectedPresetId] = useState<string>(RAG_PRESET_CONTRACTS[0].id);
  const [rawContractText, setRawContractText] = useState<string>(
    initialText || RAG_PRESET_CONTRACTS[0].text
  );
  const [documentTitle, setDocumentTitle] = useState<string>(
    RAG_PRESET_CONTRACTS[0].name
  );
  const [windowRadius, setWindowRadius] = useState<number>(2);

  // RAG Index state
  const [ragIndex, setRagIndex] = useState<RagIndex | null>(null);
  const [indexTimeMs, setIndexTimeMs] = useState<number>(0);

  // Query state
  const [queryInput, setQueryInput] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<RagQueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [useServerAi, setUseServerAi] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'high_risk' | 'commercial' | 'disputes' | 'compliance'>('all');
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);

  // Document Viewer & Highlighter state
  const [highlightRange, setHighlightRange] = useState<{ start: number; end: number } | null>(null);
  const [showFullDocViewer, setShowFullDocViewer] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const docViewerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build / Rebuild index asynchronously when text or windowRadius changes
  useEffect(() => {
    if (!rawContractText.trim()) {
      return;
    }
    const timer = setTimeout(() => {
      const start = performance.now();
      try {
        const idx = buildSentenceWindowIndex(rawContractText, windowRadius, documentTitle);
        setRagIndex(idx);
        setIndexTimeMs(Math.round(performance.now() - start));
      } catch (err) {
        console.error('Indexing failed:', err);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [rawContractText, windowRadius, documentTitle]);

  // Load a preset contract
  const handleSelectPreset = (preset: RagPresetContract) => {
    setSelectedPresetId(preset.id);
    setDocumentTitle(preset.name);
    setRawContractText(preset.text);
    setQueryResult(null);
    setActiveQuery('');
    setHighlightRange(null);
  };

  // Handle custom file upload
  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = String(e.target?.result || '');
      if (content.length > 50) {
        setSelectedPresetId('custom');
        setDocumentTitle(file.name);
        setRawContractText(content);
        setQueryResult(null);
        setActiveQuery('');
      }
    };
    reader.readAsText(file);
  };

  // Run RAG Query
  const runQuery = async (queryText: string) => {
    if (!queryText.trim() || !ragIndex) return;

    setIsQuerying(true);
    setActiveQuery(queryText);

    try {
      const res = await executeRagQuery(queryText, ragIndex, useServerAi);
      setQueryResult(res);
      // Auto highlight top result in document viewer
      if (res.retrievedWindows[0]) {
        setHighlightRange({
          start: res.retrievedWindows[0].startChar,
          end: res.retrievedWindows[0].endChar,
        });
      }
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Query execution error:', err);
    } finally {
      setIsQuerying(false);
    }
  };

  // Handle Quick Action Click
  const handleQuickAction = (qa: QuickActionQuery) => {
    setQueryInput(qa.query);
    void runQuery(qa.query);
  };

  // Filter Quick Action Queries
  const filteredQuickActions = useMemo(() => {
    if (categoryFilter === 'all') return QUICK_ACTION_QUERIES;
    return QUICK_ACTION_QUERIES.filter((q) => q.category === categoryFilter);
  }, [categoryFilter]);

  // Jump to character position in document viewer
  const handleJumpToDocument = (startChar: number, endChar: number) => {
    setHighlightRange({ start: startChar, end: endChar });
    setShowFullDocViewer(true);
    setTimeout(() => {
      docViewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Copy Executive Brief
  const copyExecutiveBrief = async () => {
    if (!queryResult) return;
    const report = `# RAG LEGAL AUDIT BRIEF
Document: ${documentTitle}
Query: "${queryResult.query}"
Risk Verdict: ${queryResult.riskVerdict} (${queryResult.confidenceScore}% Confidence)

EXECUTIVE SUMMARY:
${queryResult.answer}

ACTIONABLE ADVICE:
${queryResult.actionableAdvice}

RETRIEVED SENTENCE WINDOWS:
${queryResult.retrievedWindows
  .map(
    (w, i) =>
      `[${i + 1}] ${w.sectionTitle} (Line ${w.lineNumber}) - ${w.relevanceScore}% Match\nFocal: "${w.focalSentence}"\nContext: "${w.windowText}"`
  )
  .join('\n\n')}
`;
    try {
      await navigator.clipboard.writeText(report);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    } catch {
      // Ignore clipboard write rejection
    }
  };

  // Quick Action Icon Renderer
  const renderCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'high_risk':
        return <ShieldAlert size={14} className="text-[#FF3B3B]" />;
      case 'commercial':
        return <Zap size={14} className="text-[#FFB800]" />;
      case 'disputes':
        return <Gavel size={14} className="text-[#38BDF8]" />;
      default:
        return <Scale size={14} className="text-[#00C853]" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="border border-[#38BDF8]/30 bg-[#38BDF8]/[0.06] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 border border-[#38BDF8]/40 bg-[#38BDF8]/15 px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-[#38BDF8]">
              <Cpu size={14} /> RAG PRO (V2) · Sentence Window Retrieval Architecture
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              Legal Contract <span className="text-[#38BDF8]">RAG Analyzer</span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-zinc-300 sm:text-base">
              Indexes discrete sentences as pinpoint search units while retrieving expanding sentence context windows.
              Eliminates the context-loss problem of traditional chunking on massive legal agreements.
            </p>
          </div>

          {/* RAG Index Stats */}
          {ragIndex && (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="border border-white/15 bg-black/60 p-3">
                <div className="font-mono text-[10px] uppercase text-zinc-400">Total Words</div>
                <div className="font-mono text-lg font-black text-white">
                  {rawContractText.trim().split(/\s+/).length.toLocaleString()}
                </div>
              </div>
              <div className="border border-white/15 bg-black/60 p-3">
                <div className="font-mono text-[10px] uppercase text-[#38BDF8]">Focal Sentences</div>
                <div className="font-mono text-lg font-black text-[#38BDF8]">
                  {ragIndex.sentenceCount.toLocaleString()}
                </div>
              </div>
              <div className="border border-white/15 bg-black/60 p-3">
                <div className="font-mono text-[10px] uppercase text-zinc-400">Context Windows</div>
                <div className="font-mono text-lg font-black text-white">
                  {ragIndex.windowCount.toLocaleString()}
                </div>
              </div>
              <div className="border border-white/15 bg-black/60 p-3">
                <div className="font-mono text-[10px] uppercase text-[#00C853]">Index Latency</div>
                <div className="font-mono text-lg font-black text-[#00C853]">
                  {indexTimeMs}ms
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Massive Contracts Presets & Custom Upload Selector */}
      <div className="border border-white/20 bg-white/[0.02] p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-white">
            <BookOpen size={16} className="text-[#38BDF8]" /> Select Massive Contract Preset:
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.docx,.json,.html"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 border border-white/30 bg-white/5 px-3 py-1.5 text-xs font-black uppercase text-zinc-300 hover:border-white hover:text-white"
            >
              <UploadCloud size={14} /> Upload Custom File
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {RAG_PRESET_CONTRACTS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col justify-between border p-4 text-left transition ${
                  isSelected
                    ? 'border-[#38BDF8] bg-[#38BDF8]/10 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                    : 'border-white/15 bg-black/40 hover:border-white/40'
                }`}
              >
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#38BDF8]">
                      {preset.category}
                    </span>
                    {isSelected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#38BDF8] text-[10px] font-bold text-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-sm font-black leading-snug text-white">
                    {preset.name}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[11px] text-zinc-500">
                  <span>{preset.badge}</span>
                  <span>~{preset.wordCount} words</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick-Action Preset Query Buttons Matrix */}
      <div className="border border-white/20 bg-white/[0.03] p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-display text-base font-black uppercase tracking-wider text-white">
              <Zap size={18} className="text-[#FFB800]" /> Quick-Action RAG Queries
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Instant one-click legal queries with automatic sentence window retrieval and evidence extraction.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {([
              { id: 'all', label: 'All Queries' },
              { id: 'high_risk', label: 'High-Risk Traps' },
              { id: 'commercial', label: 'Commercial & IP' },
              { id: 'disputes', label: 'Disputes & Litigation' },
              { id: 'compliance', label: 'Compliance & Data' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-2.5 py-1 text-xs font-bold transition ${
                  categoryFilter === tab.id
                    ? 'bg-white text-black'
                    : 'border border-white/15 bg-black/40 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredQuickActions.map((qa) => {
            const isActive = activeQuery === qa.query;
            return (
              <button
                key={qa.id}
                type="button"
                onClick={() => handleQuickAction(qa)}
                disabled={isQuerying}
                className={`group flex flex-col justify-between border p-3.5 text-left transition ${
                  isActive
                    ? 'border-[#38BDF8] bg-[#38BDF8]/20 shadow-md'
                    : 'border-white/15 bg-black/50 hover:border-[#38BDF8]/60 hover:bg-white/5'
                } disabled:opacity-50`}
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    {renderCategoryIcon(qa.category)}
                    <span className="font-mono text-[9px] font-black uppercase text-zinc-400">
                      {qa.badge}
                    </span>
                  </div>
                  <div className="font-display text-xs font-black text-white group-hover:text-[#38BDF8]">
                    {qa.label}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300">
                  <span>Retrieve & Cite</span>
                  <ArrowRight size={11} className="transition group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Freeform Query & Controls Bar */}
      <div className="border border-white/20 bg-black/80 p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-white">
            <Search size={16} className="text-[#38BDF8]" /> Ask Anything (Sentence Window Semantic Search)
          </div>

          {/* Controls: Window Radius & AI Mode */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Window Radius Slider */}
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
              <Sliders size={13} className="text-zinc-400" />
              <span>Window Radius: <strong>±{windowRadius}</strong> sentences</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setWindowRadius(r)}
                    className={`h-5 w-5 font-mono text-[10px] font-bold ${
                      windowRadius === r
                        ? 'bg-[#38BDF8] text-black'
                        : 'border border-white/20 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Engine Switch */}
            <button
              type="button"
              onClick={() => setUseServerAi(!useServerAi)}
              className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-xs font-bold transition ${
                useServerAi
                  ? 'border-[#00C853] bg-[#00C853]/15 text-[#00C853]'
                  : 'border-white/20 bg-white/5 text-zinc-400'
              }`}
            >
              <Cpu size={12} />
              <span>Synthesis: {useServerAi ? 'Deep AI (Server)' : 'Local Hybrid'}</span>
            </button>
          </div>
        </div>

        {/* Query Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (queryInput.trim()) void runQuery(queryInput);
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Ask any question (e.g. Can they train AI on my data? What is the liability cap? How do I terminate?)..."
              className="w-full border-2 border-white/30 bg-[#0A0A0A] p-3.5 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isQuerying || !queryInput.trim()}
            className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-white bg-white px-7 font-display text-sm font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white disabled:opacity-50 sm:w-auto"
          >
            {isQuerying ? <LoaderCircle className="animate-spin" size={16} /> : <FileSearch size={16} />}
            {isQuerying ? 'Searching...' : 'Run RAG Query'}
          </button>
        </form>
      </div>

      {/* Query Results & Sentence Windows Section */}
      <div ref={resultsRef}>
        {isQuerying && (
          <div className="border border-white/20 bg-white/[0.02] p-12 text-center">
            <LoaderCircle className="mx-auto animate-spin text-[#38BDF8]" size={36} />
            <h3 className="mt-4 font-display text-xl font-black text-white">
              Executing Sentence Window Retrieval…
            </h3>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Matching query against {ragIndex?.sentenceCount} focal sentences with Reciprocal Rank Fusion & BM25…
            </p>
          </div>
        )}

        {!isQuerying && queryResult && (
          <div className="space-y-6">
            {/* Executive Synthesis Summary Card */}
            <div className="border-2 border-white/20 bg-black/80 p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`border px-3 py-1 font-mono text-xs font-black uppercase tracking-wider ${
                      queryResult.riskVerdict === 'HIGH RISK'
                        ? 'border-[#FF3B3B] bg-[#FF3B3B] text-white shadow-[0_0_12px_rgba(255,59,59,0.3)]'
                        : queryResult.riskVerdict === 'CAUTION'
                        ? 'border-[#FFB800] bg-[#FFB800] text-black shadow-[0_0_12px_rgba(255,184,0,0.3)]'
                        : 'border-[#00C853] bg-[#00C853] text-white shadow-[0_0_12px_rgba(0,200,83,0.3)]'
                    }`}
                  >
                    Verdict: {queryResult.riskVerdict}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    Confidence: <strong className="text-[#38BDF8]">{queryResult.confidenceScore}%</strong>
                  </span>
                  <span className="hidden sm:inline font-mono text-xs text-zinc-500">
                    ⚡ {queryResult.executionTimeMs}ms
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyExecutiveBrief}
                    className="inline-flex items-center gap-1.5 border border-white/25 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300 hover:border-white hover:text-white"
                  >
                    {copiedBrief ? <Check size={12} className="text-[#00C853]" /> : <Copy size={12} />}
                    {copiedBrief ? 'Brief Copied' : 'Copy Brief'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFullDocViewer(!showFullDocViewer)}
                    className="inline-flex items-center gap-1.5 border border-white/25 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300 hover:border-white hover:text-white"
                  >
                    <BookOpen size={12} />
                    {showFullDocViewer ? 'Hide Document' : 'View Full Text'}
                  </button>
                </div>
              </div>

              {/* Plain-English Answer */}
              <div className="mb-5">
                <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Plain-Language Legal Synthesis:
                </div>
                <p className="text-base font-semibold leading-relaxed text-white sm:text-lg">
                  {queryResult.answer}
                </p>
              </div>

              {/* Actionable Advice Callout */}
              {queryResult.actionableAdvice && (
                <div className="mb-5 border-l-4 border-[#00C853] bg-[#00C853]/10 p-4">
                  <div className="mb-1 flex items-center gap-1.5 font-mono text-xs font-black uppercase text-[#00C853]">
                    <Lightbulb size={14} /> Actionable Takeaway / Lawyer Recommendation
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-zinc-200">
                    {queryResult.actionableAdvice}
                  </p>
                </div>
              )}

              {/* Key Insights List */}
              {queryResult.keyInsights && queryResult.keyInsights.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <div className="mb-2 font-mono text-xs font-bold uppercase text-zinc-400">
                    Extracted Legal Insights:
                  </div>
                  <ul className="space-y-1.5">
                    {queryResult.keyInsights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Retrieved Sentence Windows Breakdown */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-display text-lg font-black uppercase tracking-wider text-white">
                  <Layers size={18} className="text-[#38BDF8]" /> Retrieved Sentence Windows ({queryResult.retrievedWindows.length})
                </div>
                <span className="font-mono text-xs text-zinc-400">
                  Target focal sentences highlighted with surrounding context
                </span>
              </div>

              <div className="space-y-4">
                {queryResult.retrievedWindows.map((win, idx) => (
                  <SentenceWindowCard
                    key={win.id || idx}
                    window={win}
                    index={idx}
                    onJumpToDocument={handleJumpToDocument}
                    onOpenNegotiate={(title, quote) => {
                      if (onOpenNegotiate) {
                        onOpenNegotiate({
                          title,
                          plain_english: win.focalSentence,
                          risk_level: queryResult.riskVerdict === 'HIGH RISK' ? 'red' : 'yellow',
                          risk_label: title,
                          what_to_do: queryResult.actionableAdvice || 'Negotiate this provision',
                          quote,
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Document Viewer with Highlight Tracking */}
      {showFullDocViewer && (
        <div ref={docViewerRef} className="border border-white/25 bg-[#0A0A0A] p-6">
          <div className="mb-3 flex items-center justify-between border-b border-white/15 pb-3">
            <div className="flex items-center gap-2 font-display text-sm font-black uppercase text-white">
              <FileText size={16} className="text-[#38BDF8]" /> Full Contract Inspector: {documentTitle}
            </div>
            <button
              type="button"
              onClick={() => setShowFullDocViewer(false)}
              className="font-mono text-xs text-zinc-400 hover:text-white"
            >
              [Close Inspector]
            </button>
          </div>

          <div className="max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-300 bg-black/60 p-4 border border-white/10">
            {highlightRange ? (
              <>
                <span>{rawContractText.substring(0, highlightRange.start)}</span>
                <mark className="bg-[#38BDF8]/30 font-bold text-white px-1 py-0.5 border border-[#38BDF8]">
                  {rawContractText.substring(highlightRange.start, highlightRange.end)}
                </mark>
                <span>{rawContractText.substring(highlightRange.end)}</span>
              </>
            ) : (
              rawContractText
            )}
          </div>
        </div>
      )}
    </div>
  );
}
