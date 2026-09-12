import { FileSearch, GitCompare, Cpu, ShieldCheck, Mail, Github, Scale } from 'lucide-react';
import { trackCta } from '../utils/analytics';

interface Props {
  currentMode: 'single' | 'diff' | 'rag';
  onSelectMode: (mode: 'single' | 'diff' | 'rag') => void;
  onOpenLegal: (tab: 'privacy' | 'terms') => void;
}

export function Footer({ currentMode, onSelectMode, onOpenLegal }: Props) {
  return (
    <footer className="border-t border-white/15 bg-[#050505] text-zinc-400">
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-black tracking-[-0.04em] text-white">
                TS<span className="text-[#FF3B3B]">/</span> TermSight
              </span>
              <span className="border border-[#00C853]/40 bg-[#00C853]/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#00C853]">
                Open &amp; Free
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-zinc-300">
              You clicked accept. We read it for you. TermSight brings plain-language clarity to Terms of Service,
              EULAs, Privacy Policies, and Freelance agreements to spot predatory traps before you sign.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <a
                href="https://github.com/dhruvmkolhe/termsight-v2"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta('github_repo')}
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
              <a
                href="mailto:hellotermsight@proton.me"
                onClick={() => trackCta('contact_email')}
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition"
              >
                <Mail size={14} />
                <span>hellotermsight@proton.me</span>
              </a>
            </div>
          </div>

          {/* Navigation & Modes */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Analysis Engines
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectMode('single');
                    trackCta('footer_mode_single');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-1.5 hover:text-white transition ${
                    currentMode === 'single' ? 'text-white font-bold' : ''
                  }`}
                >
                  <FileSearch size={13} className="text-[#FF3B3B]" />
                  <span>Contract Auditor</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectMode('diff');
                    trackCta('footer_mode_diff');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-1.5 hover:text-white transition ${
                    currentMode === 'diff' ? 'text-white font-bold' : ''
                  }`}
                >
                  <GitCompare size={13} className="text-[#38BDF8]" />
                  <span>Version Diff Compare</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectMode('rag');
                    trackCta('footer_mode_rag');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-1.5 hover:text-white transition ${
                    currentMode === 'rag' ? 'text-white font-bold' : ''
                  }`}
                >
                  <Cpu size={13} className="text-[#38BDF8]" />
                  <span>Sentence RAG Engine</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Trust &amp; Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenLegal('privacy');
                    trackCta('footer_privacy_policy');
                  }}
                  className="inline-flex items-center gap-1.5 hover:text-white transition"
                >
                  <ShieldCheck size={13} className="text-[#00C853]" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenLegal('terms');
                    trackCta('footer_terms_of_service');
                  }}
                  className="inline-flex items-center gap-1.5 hover:text-white transition"
                >
                  <Scale size={13} className="text-zinc-400" />
                  <span>Terms &amp; Disclaimer</span>
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition"
                >
                  <span className="font-mono text-[10px] text-zinc-500">LLM</span>
                  <span>Crawler Guidance (llms.txt)</span>
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition"
                >
                  <span className="font-mono text-[10px] text-zinc-500">XML</span>
                  <span>Sitemap</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 text-[11px] leading-relaxed text-zinc-400 sm:flex sm:items-center sm:justify-between">
          <p className="max-w-2xl">
            <strong className="text-zinc-200">Legal Disclaimer:</strong> TermSight provides informational summaries and risk scoring
            via automated heuristics and AI models. It does not constitute formal legal advice or attorney representation.
          </p>
          <p className="mt-4 sm:mt-0 font-mono text-zinc-400 shrink-0">
            &copy; {new Date().getFullYear()} TermSight. MIT Licensed.
          </p>
        </div>
      </div>
    </footer>
  );
}
