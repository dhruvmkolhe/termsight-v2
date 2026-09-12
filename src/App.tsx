import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  Cpu,
  ExternalLink,
  FileSearch,
  FileText,
  GitCompare,
  LoaderCircle,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Unlock,
  UploadCloud,
  Zap,
} from 'lucide-react';
import { DIFF_PRESET, SAMPLE_CONTRACTS } from './constants/contracts';
import { maskSensitivePII } from './utils/piiMasker';
import { LanguageSelector } from './components/LanguageSelector';
import { NegotiateModal } from './components/NegotiateModal';
import { Results } from './components/Results';
import { ShareModal } from './components/ShareModal';
import { SkeletonCards } from './components/SkeletonCards';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { useLanguage } from './context/LanguageContext';
import { initAnalytics, trackCta, trackPageView } from './utils/analytics';
import { computeFairnessScore } from './utils/scoring';
import type { Analysis, Clause, SampleContract } from './types/contract';

const RagProDashboard = lazy(() =>
  import('./components/RagProDashboard').then((m) => ({ default: m.RagProDashboard }))
);
const ContractDiffView = lazy(() =>
  import('./components/ContractDiffView').then((m) => ({ default: m.ContractDiffView }))
);
const LegalNoticesModal = lazy(() =>
  import('./components/LegalNoticesModal').then((m) => ({ default: m.LegalNoticesModal }))
);
const NotFoundView = lazy(() =>
  import('./components/NotFoundView').then((m) => ({ default: m.NotFoundView }))
);
const LegalPageView = lazy(() =>
  import('./components/LegalPageView').then((m) => ({ default: m.LegalPageView }))
);

function parseRoute() {
  if (typeof window === 'undefined') {
    return { mode: 'single' as const, legal: null as 'privacy' | 'terms' | null, notFound: false };
  }
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const searchParams = new URLSearchParams(window.location.search);
  const modeParam = searchParams.get('mode');

  if (path === '/privacy' || path === '/privacy-policy') {
    return { mode: 'single' as const, legal: 'privacy' as const, notFound: false };
  }
  if (path === '/terms' || path === '/terms-of-service' || path === '/terms-of-use') {
    return { mode: 'single' as const, legal: 'terms' as const, notFound: false };
  }
  if (path === '/diff' || modeParam === 'diff') {
    return { mode: 'diff' as const, legal: null, notFound: false };
  }
  if (path === '/rag' || modeParam === 'rag') {
    return { mode: 'rag' as const, legal: null, notFound: false };
  }
  if (path === '' || path === '/') {
    return { mode: 'single' as const, legal: null, notFound: false };
  }
  return { mode: 'single' as const, legal: null, notFound: true };
}

export function App() {
  const { t, language } = useLanguage();
  const initialUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('url') || '' : '';
  const initialRoute = parseRoute();

  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'url'>(initialUrl ? 'url' : 'paste');
  const [appMode, setAppMode] = useState<'single' | 'diff' | 'rag'>(initialRoute.mode);

  // Privacy Mode (Client-Side PII Masking)
  const [privacyMode, setPrivacyMode] = useState(false);

  // Route handling (404, Privacy Policy, Terms of Service)
  const [isNotFound, setIsNotFound] = useState(initialRoute.notFound);
  const [isLegalView, setIsLegalView] = useState<'privacy' | 'terms' | null>(initialRoute.legal);

  // Single mode state
  const [text, setText] = useState('');
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [urlLoading, setUrlLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Diff mode state
  const [diffDocA, setDiffDocA] = useState('');
  const [diffDocB, setDiffDocB] = useState('');
  const [diffAnalysisA, setDiffAnalysisA] = useState<Analysis | null>(null);
  const [diffAnalysisB, setDiffAnalysisB] = useState<Analysis | null>(null);
  const [diffLoading, setDiffLoading] = useState(false);

  // Modals state
  const [negotiatingClause, setNegotiatingClause] = useState<Clause | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNoticesOpen, setIsNoticesOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const characterCount = text.length;
  const wordCount = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);

  // Privacy masked item count
  const piiMaskResult = useMemo(() => (privacyMode && text ? maskSensitivePII(text) : { maskedText: text, count: 0 }), [privacyMode, text]);

  const loadPreset = (preset: SampleContract) => {
    setText(preset.text);
    setActivePreset(preset.id);
    setUploadedFileName(null);
    setError('');
    trackCta('sample_preset_loaded', { presetId: preset.id });
  };

  const loadDiffPreset = () => {
    setDiffDocA(DIFF_PRESET.originalText);
    setDiffDocB(DIFF_PRESET.updatedText);
    trackCta('diff_sample_loaded');
  };

  // Handle Drag & Drop / File Upload (PDF, DOCX, TXT, MD)
  const handleFileUpload = async (file: File) => {
    setError('');
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!['txt', 'md', 'rtf', 'html', 'pdf', 'docx', 'json'].includes(ext)) {
      setError('Please upload a .txt, .md, .pdf, .docx, or .html file.');
      return;
    }

    setUploadedFileName(`${file.name} (${Math.round(file.size / 1024)} KB)`);
    trackCta('file_uploaded', { ext });

    try {
      if (ext === 'txt' || ext === 'md' || ext === 'rtf' || ext === 'json' || ext === 'html') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = String(e.target?.result || '');
          setText(content.slice(0, 60000));
          setActivePreset(null);
        };
        reader.readAsText(file);
      } else {
        // PDF or DOCX: read raw text streams
        const reader = new FileReader();
        reader.onload = (e) => {
          const buffer = e.target?.result as ArrayBuffer;
          const textDecoder = new TextDecoder('utf-8');
          const rawText = textDecoder.decode(buffer);
          const clean = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{2,}/g, ' ').trim();
          if (clean.length > 100) {
            setText(clean.slice(0, 60000));
          } else {
            setError(`Extracted minimal text from ${file.name}. For complex binary files, copy and paste the text directly.`);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } catch {
      setError(`Failed to read file ${file.name}. Try copy-pasting the text.`);
    }
  };

  // Handle URL Fetcher
  const fetchUrl = async (urlToFetch?: string) => {
    const target = urlToFetch || urlInput;
    if (!target.trim()) {
      setError('Enter a valid URL to analyze.');
      return;
    }

    setUrlLoading(true);
    setError('');
    trackCta('fetch_url_started', { url: target });

    try {
      const res = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch webpage.');
      setText(data.text);
      setUploadedFileName(`Scraped: ${data.title || target}`);
      setActiveTab('paste');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not fetch this webpage.');
    } finally {
      setUrlLoading(false);
    }
  };

  // Analytics initialization & browser history listener on mount
  useEffect(() => {
    initAnalytics();
    trackPageView(window.location.pathname);

    const handlePopState = () => {
      const route = parseRoute();
      setIsNotFound(route.notFound);
      setIsLegalView(route.legal);
      setAppMode(route.mode);
      trackPageView(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic Title, Meta Description & Canonical URL update (Items 10, 11 & 12)
  useEffect(() => {
    let pageTitle = 'TermSight — AI Contract & Terms of Service Auditor';
    let metaDesc = 'TermSight is an AI contract and terms of service auditor. Instantly analyze agreements, detect predatory clauses, compute fairness scores, and draft notices.';
    let canonicalUrl = 'https://termsight.app/';

    if (isNotFound) {
      pageTitle = '404 — Page Not Found | TermSight';
      metaDesc = 'This clause could not be found or has moved. The fine print does not mention this path.';
      canonicalUrl = 'https://termsight.app/404';
    } else if (isLegalView === 'privacy') {
      pageTitle = 'Privacy Policy — TermSight';
      metaDesc = 'Learn how TermSight protects your privacy with ephemeral contract processing, client-side PII masking, and zero data retention.';
      canonicalUrl = 'https://termsight.app/privacy';
    } else if (isLegalView === 'terms') {
      pageTitle = 'Terms of Use & Legal Disclaimer — TermSight';
      metaDesc = 'Terms of use, informational disclaimer, and limitation of liability for using TermSight automated legal auditing tools.';
      canonicalUrl = 'https://termsight.app/terms';
    } else if (analysis) {
      const fairness = computeFairnessScore(analysis);
      pageTitle = `${analysis.title} (${fairness.score}/100) — TermSight Audit`;
      metaDesc = `Audit completed: ${fairness.label} (${fairness.score}/100 score). ${analysis.clauses.length} clauses analyzed.`;
      canonicalUrl = 'https://termsight.app/';
    } else if (appMode === 'diff') {
      pageTitle = 'Compare Contract Versions (Diff) — TermSight';
      metaDesc = 'Detect added predatory clauses, sneaky amendments, and health score shifts between two versions of an agreement.';
      canonicalUrl = 'https://termsight.app/?mode=diff';
    } else if (appMode === 'rag') {
      pageTitle = 'Legal Contract RAG Analyzer — TermSight';
      metaDesc = 'Sentence-window retrieval system indexing discrete legal sentences with expanding context windows for zero context loss.';
      canonicalUrl = 'https://termsight.app/?mode=rag';
    }

    document.title = pageTitle;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', metaDesc);

    // Synchronize Canonical Tag per page/mode (Item 12)
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);
  }, [appMode, analysis, isNotFound, isLegalView]);

  useEffect(() => {
    try {
      localStorage.removeItem('termsight_history');
    } catch {
      // Ignored
    }

    if (initialUrl) {
      const timer = setTimeout(() => {
        void fetchUrl(initialUrl);
      }, 0);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  // Run Single Document Analysis
  const analyze = async () => {
    setError('');
    setCopied(false);

    if (!text.trim()) {
      setError('Paste or upload a contract first. We need something to read.');
      return;
    }
    if (text.trim().length < 120) {
      setError('That is too short to analyze. Paste at least 120 characters of the agreement.');
      return;
    }
    if (text.length > 60000) {
      setError('This document is over 60,000 characters. Analyze it in smaller sections.');
      return;
    }

    setLoading(true);
    setAnalysis(null);
    trackCta('analyze_contract_submitted', { words: wordCount, privacyMode });

    // Apply Privacy Mode masking if active
    const textToSend = privacyMode ? maskSensitivePII(text).maskedText : text.trim();

    try {
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend, language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The analysis failed. Please try again.');
      
      // Preserve original text for deadline extraction
      data.source_text = text.trim();
      setAnalysis(data);
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'The analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run Diff Comparison Analysis
  const runDiffComparison = async () => {
    setError('');
    if (diffDocA.length < 50 || diffDocB.length < 50) {
      setError('Please provide text for both Version 1 and Version 2 to compare.');
      return;
    }

    setDiffLoading(true);
    setDiffAnalysisA(null);
    setDiffAnalysisB(null);
    trackCta('diff_comparison_submitted', { privacyMode });

    const docAToSend = privacyMode ? maskSensitivePII(diffDocA).maskedText : diffDocA.trim();
    const docBToSend = privacyMode ? maskSensitivePII(diffDocB).maskedText : diffDocB.trim();

    try {
      const [resA, resB] = await Promise.all([
        fetch('/api/analyses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: docAToSend, language }),
        }),
        fetch('/api/analyses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: docBToSend, language }),
        }),
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();
      setDiffAnalysisA(dataA);
      setDiffAnalysisB(dataB);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Comparison failed. Try again.');
    } finally {
      setDiffLoading(false);
    }
  };

  const copySummary = async () => {
    if (!analysis) return;
    trackCta('copy_summary_clicked');
    const summary = analysis.clauses
      .map((clause, index) => `${index + 1}. ${clause.title} — ${clause.risk_label.toUpperCase()}\n${clause.plain_english}\nWhat to do: ${clause.what_to_do}`)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(`TERMSIGHT CONTRACT SUMMARY\n\n${summary}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Clipboard access was blocked. Select and copy the text manually.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white">
      {/* Header Landmark */}
      <header className="border-b border-white/15">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5 lg:px-10">
          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setIsNotFound(false);
                setIsLegalView(null);
                setAppMode('single');
                window.history.pushState({}, '', '/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-display text-lg font-black tracking-[-0.04em]"
            >
              TS<span className="text-[#FF3B3B]">/</span>
            </a>
            {/* Mode Switch: Single Audit vs Contract Diff vs RAG Pro */}
            <nav className="inline-flex max-w-full items-center border border-white/20 bg-black p-0.5 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setIsNotFound(false);
                  setIsLegalView(null);
                  setAppMode('single');
                  window.history.pushState({}, '', '/');
                  trackCta('nav_switch_single');
                }}
                className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                  appMode === 'single' && !isNotFound && !isLegalView ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileSearch size={13} className="shrink-0" />
                <span>{t('navAudit', 'Audit')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNotFound(false);
                  setIsLegalView(null);
                  setAppMode('diff');
                  window.history.pushState({}, '', '/?mode=diff');
                  trackCta('nav_switch_diff');
                }}
                className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                  appMode === 'diff' && !isNotFound && !isLegalView ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <GitCompare size={13} className="shrink-0" />
                <span>{t('navDiff', 'Diff')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNotFound(false);
                  setIsLegalView(null);
                  setAppMode('rag');
                  window.history.pushState({}, '', '/?mode=rag');
                  trackCta('nav_switch_rag');
                }}
                className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                  appMode === 'rag' && !isNotFound && !isLegalView
                    ? 'bg-[#38BDF8] text-black shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                    : 'text-[#38BDF8] hover:bg-[#38BDF8]/10'
                }`}
              >
                <Cpu size={13} className="shrink-0" />
                <span>{t('navRagPro', 'RAG PRO (V2)')}</span>
                <span className={`rounded px-1 py-0.2 text-[9px] font-black tracking-normal uppercase ${
                  appMode === 'rag' && !isNotFound && !isLegalView ? 'bg-black/30 text-black' : 'bg-[#38BDF8]/20 text-[#38BDF8]'
                }`}>
                  PRO
                </span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-2 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.17em] text-white/45 sm:text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#00C853] shrink-0" />
              <span>{t('researchLed', 'Research-led contract clarity')}</span>
            </div>
            <div className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap border border-white/20 bg-white/5 px-2.5 py-1.5 text-[11px] font-mono font-medium text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C853] shrink-0" />
              <span>{t('freeNoLogin', '100% Free · No Login Required')}</span>
            </div>
            {/* Location #1: Language Selector Dropdown */}
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Landmark */}
      <main className="flex-1">
        {isNotFound ? (
          <Suspense fallback={<div className="p-16 text-center text-zinc-400"><LoaderCircle className="animate-spin inline mr-2" size={20} /> Loading...</div>}>
            <NotFoundView
              onReturnHome={() => {
                setIsNotFound(false);
                setIsLegalView(null);
                setAppMode('single');
                window.history.pushState({}, '', '/');
              }}
            />
          </Suspense>
        ) : isLegalView ? (
          <Suspense fallback={<div className="p-16 text-center text-zinc-400"><LoaderCircle className="animate-spin inline mr-2" size={20} /> Loading Legal View...</div>}>
            <LegalPageView
              tab={isLegalView}
              onChangeTab={(tab) => {
                setIsLegalView(tab);
                window.history.pushState({}, '', `/${tab}`);
              }}
              onReturnHome={() => {
                setIsLegalView(null);
                setIsNotFound(false);
                setAppMode('single');
                window.history.pushState({}, '', '/');
              }}
            />
          </Suspense>
        ) : (
          <div id="top" className="mx-auto max-w-[1240px] px-4 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-16 lg:px-10 lg:pt-20">
            <section id="input-section" className="relative">
              <div className="pointer-events-none absolute -right-20 -top-40 h-80 w-80 rounded-full bg-white/[0.035] blur-3xl" />
              <div className="mb-6 inline-flex items-center gap-2 border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.17em] text-[#38BDF8] sm:text-xs">
                <Sparkles size={14} /> {t('heroBadge', 'AI plain-language analysis')}
              </div>

              {appMode === 'rag' ? (
                <Suspense fallback={<div className="p-16 text-center text-zinc-400"><LoaderCircle className="animate-spin inline mr-2" size={20} /> Loading RAG Engine...</div>}>
                  <RagProDashboard
                    initialText={text}
                    onOpenNegotiate={(clause) => setNegotiatingClause(clause)}
                  />
                </Suspense>
              ) : appMode === 'single' ? (
                <>
                  <h1 className="font-display text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.88] sm:leading-[0.84] tracking-[-0.075em]">
                    TermSight<span className="text-[#FF3B3B]">.</span>
                  </h1>
                  <p className="mt-7 max-w-3xl font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
                    {t('heroTagline1', 'You clicked accept.')}<br className="hidden sm:block" /> <span className="text-[#38BDF8]">{t('heroTagline2', 'We read it for you.')}</span>
                  </p>
                  <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#E0F2FE] sm:text-lg">
                    {t('heroSubtitle', 'Paste the legal wall of text, upload a PDF/DOCX, or fetch any terms URL to reveal hidden predatory clauses.')}
                  </p>

                  {/* Presets */}
                  <div className="mt-8">
                    <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-zinc-300">
                      <Sparkles size={13} className="text-[#38BDF8]" /> {t('sampleTitle', 'Try a sample contract:')}
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {SAMPLE_CONTRACTS.map((sample) => {
                        const RiskIcon =
                          sample.risk === 'red'
                            ? ShieldAlert
                            : sample.risk === 'yellow'
                            ? AlertTriangle
                            : ShieldCheck;

                        return (
                          <button
                            key={sample.id}
                            type="button"
                            onClick={() => loadPreset(sample)}
                            className={`inline-flex items-center gap-2 border px-3.5 py-2 text-xs font-black transition ${
                              activePreset === sample.id
                                ? 'border-white bg-white text-black shadow-md'
                                : sample.riskClass
                            }`}
                          >
                            <RiskIcon size={14} className="shrink-0" />
                            <span>{sample.badgeText}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Item 29: Immediate Above-The-Fold Primary CTA */}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        trackCta('above_the_fold_analyze');
                        if (text.trim().length >= 120) {
                          void analyze();
                        } else {
                          const sample = SAMPLE_CONTRACTS[0];
                          loadPreset(sample);
                          document.getElementById('input-box')?.scrollIntoView({ behavior: 'smooth' });
                          document.querySelector('textarea')?.focus();
                        }
                      }}
                      className="group inline-flex min-h-12 items-center justify-center gap-2 border-2 border-white bg-white px-6 font-display text-sm font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
                    >
                      <FileSearch size={16} strokeWidth={3} />
                      <span>{text.trim().length >= 120 ? t('analyzeBtn', 'Analyze Contract') : 'Quick Audit (SaaS Demo)'}</span>
                      <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" strokeWidth={3} />
                    </button>
                    <a
                      href="#input-box"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('input-box')?.scrollIntoView({ behavior: 'smooth' });
                        document.querySelector('textarea')?.focus();
                      }}
                      className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/25 bg-white/5 px-5 font-display text-xs font-black uppercase tracking-wider text-zinc-300 transition hover:border-white hover:text-white"
                    >
                      <FileText size={14} /> Paste Custom Terms
                    </a>
                  </div>

                  {/* Input Mode Tabs: Paste | File Dropzone | Fetch URL */}
                  <div id="input-box" className="mt-8 border border-white/25 bg-white/[0.04] p-3 sm:mt-10 sm:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('paste')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                            activeTab === 'paste' ? 'border-b-2 border-white text-white' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <FileText size={14} /> {t('tabPaste', 'Paste Text')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('upload')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                            activeTab === 'upload' ? 'border-b-2 border-white text-white' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <UploadCloud size={14} /> {t('tabUpload', 'Drop PDF / DOCX')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('url')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                            activeTab === 'url' ? 'border-b-2 border-white text-white' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <ExternalLink size={14} /> {t('tabUrl', 'Fetch URL')}
                        </button>
                      </div>

                      {/* Feature 4: Privacy Mode Toggle */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !privacyMode;
                            setPrivacyMode(nextState);
                            trackCta('privacy_mode_toggled', { enabled: nextState });
                          }}
                          title="Anonymize names, emails, phone numbers, and dollar amounts client-side before sending to AI"
                          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-bold transition ${
                            privacyMode
                              ? 'border-[#00C853] bg-[#00C853]/15 text-[#00C853]'
                              : 'border-white/20 bg-black text-zinc-400 hover:text-white'
                          }`}
                        >
                          {privacyMode ? <Lock size={12} /> : <Unlock size={12} />}
                          <span>{t('privacyShield', 'Privacy Shield')}: {privacyMode ? t('privacyOn', 'ON') : t('privacyOff', 'OFF')}</span>
                        </button>
                        <span className="font-mono text-[10px] font-bold text-[#38BDF8] sm:text-xs">
                          {wordCount} {t('words', 'words')} · {characterCount.toLocaleString()} {t('chars', 'chars')}
                        </span>
                      </div>
                    </div>

                    {/* Tab 1: Paste Text */}
                    {activeTab === 'paste' && (
                      <div className="relative">
                        <textarea
                          value={text}
                          onChange={(e) => {
                            setText(e.target.value);
                            setActivePreset(null);
                            setUploadedFileName(null);
                            setError('');
                          }}
                          placeholder={t(
                            'pastePlaceholder',
                            'Paste the complete agreement or legal text here… (e.g. Terms of Service, Privacy Policy, Freelance Agreement, or EULA)'
                          )}
                          rows={14}
                          className="w-full border border-white/20 bg-[#0A0A0A] p-4 font-mono text-xs text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm"
                        />
                        {uploadedFileName && (
                          <div className="absolute bottom-4 left-4 border border-[#38BDF8]/40 bg-black/80 px-2.5 py-1 font-mono text-xs text-[#38BDF8]">
                            {uploadedFileName}
                          </div>
                        )}
                        {privacyMode && piiMaskResult.count > 0 && (
                          <div className="absolute top-4 right-4 flex items-center gap-1 border border-[#00C853]/40 bg-black/90 px-2 py-1 font-mono text-[10px] text-[#00C853]">
                            <Lock size={10} /> {piiMaskResult.count} PII items will be redacted
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 2: Upload File Dropzone */}
                    {activeTab === 'upload' && (
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file) void handleFileUpload(file);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex min-h-64 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-white/25 bg-black/40 p-8 text-center transition hover:border-white hover:bg-white/[0.02]"
                      >
                        <UploadCloud size={38} className="mb-3 text-[#38BDF8]" />
                        <p className="font-display text-lg font-bold text-white">
                          {t('dropFileTitle', 'Drop your contract file here')}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          Supports PDF, DOCX, TXT, MD, HTML (up to 5MB)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,.txt,.md,.rtf,.html,.json"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleFileUpload(file);
                          }}
                        />
                        <button
                          type="button"
                          className="mt-4 border border-white/30 bg-white/10 px-4 py-1.5 font-display text-xs font-black uppercase tracking-wider text-white hover:bg-white hover:text-black"
                        >
                          Browse Files
                        </button>
                      </div>
                    )}

                    {/* Tab 3: URL Fetcher */}
                    {activeTab === 'url' && (
                      <div className="space-y-4 p-4 sm:p-6">
                        <div>
                          <label htmlFor="url-input" className="block text-xs font-black uppercase tracking-wider text-zinc-300">
                            Webpage URL to scrape:
                          </label>
                          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                            <input
                              id="url-input"
                              type="url"
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              placeholder="https://example.com/terms-of-service"
                              className="flex-1 border border-white/20 bg-[#0A0A0A] p-3 font-mono text-xs text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => void fetchUrl()}
                              disabled={urlLoading}
                              className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-white bg-white px-6 font-display text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white disabled:opacity-50"
                            >
                              {urlLoading ? <LoaderCircle className="animate-spin" size={16} /> : <ExternalLink size={16} />}
                              {urlLoading ? 'Fetching...' : 'Fetch Terms'}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400">
                          We will safely scrape the text content of the target URL and populate the audit field.
                        </p>
                      </div>
                    )}

                    {/* Actions and Character Counter */}
                    <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                      <div>
                        {error ? (
                          <p role="alert" className="flex items-start gap-2 text-sm font-black text-[#FF3B3B]">
                            <AlertTriangle className="mt-0.5 shrink-0" size={17} strokeWidth={3} /> {error}
                          </p>
                        ) : (
                          <p className="text-xs font-medium text-zinc-300">Minimum 120 characters. Maximum 60,000.</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={analyze}
                        disabled={loading}
                        className="group inline-flex min-h-16 w-full items-center justify-center gap-3 border-2 border-white bg-white px-8 font-display text-lg font-black uppercase tracking-[0.06em] text-black transition hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-white/25 disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-52"
                      >
                        {loading ? <LoaderCircle className="animate-spin" size={22} strokeWidth={3} /> : <FileSearch size={22} strokeWidth={3} />}
                        {loading ? t('analyzingBtn', 'Auditing Contract...') : t('analyzeBtn', 'Analyze Contract')}
                        {!loading && <ArrowDown className="transition-transform group-hover:translate-y-1" size={20} strokeWidth={3} />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Diff Comparison Mode Input */
                <div className="mt-4">
                  <h1 className="font-display text-3xl font-black sm:text-5xl">
                    {t('diffTitle', 'Compare Contract Versions')} <span className="text-[#38BDF8]">(Diff)</span>
                  </h1>
                  <p className="mt-2 text-sm text-zinc-300">
                    {t('diffSubtitle', 'Detect added predatory clauses, sneaky amendments, and health score shifts between two versions of an agreement.')}
                  </p>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={loadDiffPreset}
                      className="inline-flex items-center gap-1.5 border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-3 py-1.5 text-xs font-black text-[#38BDF8] hover:bg-[#38BDF8]/20"
                    >
                      <Zap size={13} /> {t('diffLoadSample', 'Load Sample Diff (Sneaky Terms Update)')}
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="border border-white/25 bg-black/60 p-4">
                      <div className="mb-2 font-mono text-xs font-bold uppercase text-zinc-400">{t('diffDocA', 'Original Terms (Version 1)')}</div>
                      <textarea
                        value={diffDocA}
                        onChange={(e) => setDiffDocA(e.target.value)}
                        placeholder={t('diffPlaceholderA', 'Paste original agreement...')}
                        rows={12}
                        className="w-full border border-white/20 bg-[#0A0A0A] p-4 font-mono text-xs text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div className="border border-white/25 bg-black/60 p-4">
                      <div className="mb-2 font-mono text-xs font-bold uppercase text-[#38BDF8]">{t('diffDocB', 'Updated / Renewal Terms (Version 2)')}</div>
                      <textarea
                        value={diffDocB}
                        onChange={(e) => setDiffDocB(e.target.value)}
                        placeholder={t('diffPlaceholderB', 'Paste renewal or updated agreement...')}
                        rows={12}
                        className="w-full border border-white/20 bg-[#0A0A0A] p-4 font-mono text-xs text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={runDiffComparison}
                      disabled={diffLoading}
                      className="inline-flex min-h-14 items-center justify-center gap-2 border-2 border-white bg-white px-8 font-display text-sm font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white disabled:opacity-50"
                    >
                      {diffLoading ? <LoaderCircle className="animate-spin" size={18} /> : <GitCompare size={18} />}
                      {diffLoading ? t('diffComparingBtn', 'Comparing Versions...') : t('diffCompareBtn', 'Compare Both Versions')}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Results Container (For single audit & diff modes) */}
            {appMode !== 'rag' && (
              <div ref={resultsRef} className="mt-14 sm:mt-20">
                {loading && (
                  <section>
                    <div className="mb-6 flex items-center gap-3">
                      <LoaderCircle className="animate-spin" size={22} />
                      <p className="font-display text-xl font-black">Finding the fine print…</p>
                    </div>
                    <SkeletonCards />
                  </section>
                )}

                {!loading && analysis && appMode === 'single' && (
                  <Results
                    analysis={analysis}
                    copied={copied}
                    onCopy={copySummary}
                    onOpenNegotiate={(clause) => setNegotiatingClause(clause)}
                    onOpenShare={() => setIsShareOpen(true)}
                    onOpenNotices={() => setIsNoticesOpen(true)}
                  />
                )}

                {/* Diff Results */}
                {!diffLoading && diffAnalysisA && diffAnalysisB && appMode === 'diff' && (
                  <Suspense fallback={<div className="p-12 text-center text-zinc-400"><LoaderCircle className="animate-spin inline mr-2" size={20} /> Loading Diff View...</div>}>
                    <ContractDiffView
                      originalAnalysis={diffAnalysisA}
                      updatedAnalysis={diffAnalysisB}
                    />
                  </Suspense>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      {/* Item 28: Sticky Mobile CTA */}
      {appMode === 'single' && !isNotFound && text.trim().length >= 120 && !loading && !analysis && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/20 bg-[#0A0A0A]/95 p-3 backdrop-blur-md sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-[11px] text-[#38BDF8]">
              {wordCount} words ready
            </div>
            <button
              type="button"
              onClick={() => {
                trackCta('sticky_mobile_analyze');
                void analyze();
              }}
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-5 py-2.5 font-display text-xs font-black uppercase tracking-wider text-black transition active:bg-black active:text-white"
            >
              <FileSearch size={16} strokeWidth={3} />
              {t('analyzeBtn', 'Analyze Contract')}
            </button>
          </div>
        </div>
      )}

      {/* Footer Landmark */}
      <Footer
        currentMode={appMode}
        onSelectMode={(mode) => {
          setIsNotFound(false);
          setIsLegalView(null);
          setAppMode(mode);
          window.history.pushState({}, '', mode === 'single' ? '/' : `/?mode=${mode}`);
        }}
        onOpenLegal={(tab) => {
          setIsNotFound(false);
          setIsLegalView(tab);
          window.history.pushState({}, '', `/${tab}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Negotiate / Counter-Clause Modal */}
      <NegotiateModal
        clause={negotiatingClause}
        documentTitle={analysis?.title || 'Contract'}
        onClose={() => setNegotiatingClause(null)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        analysis={analysis}
      />

      {/* Feature 3: Legal Notices Modal */}
      <Suspense fallback={null}>
        <LegalNoticesModal
          isOpen={isNoticesOpen}
          onClose={() => setIsNoticesOpen(false)}
          analysis={analysis}
        />
      </Suspense>

      {/* Cookie Consent Banner */}
      <CookieBanner
        onOpenPrivacy={() => {
          setIsNotFound(false);
          setIsLegalView('privacy');
          window.history.pushState({}, '', '/privacy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
