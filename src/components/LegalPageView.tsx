import { ArrowLeft, Lock, Scale, ShieldCheck } from 'lucide-react';

interface Props {
  tab: 'privacy' | 'terms';
  onChangeTab: (tab: 'privacy' | 'terms') => void;
  onReturnHome: () => void;
}

export function LegalPageView({ tab, onChangeTab, onReturnHome }: Props) {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-8 sm:py-16">
      {/* Navigation Breadcrumb & Return Action */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3.5 py-1.5 font-display text-xs font-black uppercase tracking-wider text-zinc-300 transition hover:border-white hover:bg-white hover:text-black"
        >
          <ArrowLeft size={14} /> Return to Auditor
        </button>

        <div className="inline-flex items-center border border-white/20 bg-black p-0.5">
          <button
            type="button"
            onClick={() => onChangeTab('privacy')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-display text-xs font-black uppercase tracking-wider transition ${
              tab === 'privacy' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock size={13} /> Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('terms')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-display text-xs font-black uppercase tracking-wider transition ${
              tab === 'terms' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scale size={13} /> Terms &amp; Disclaimer
          </button>
        </div>
      </div>

      {/* Main Legal Content Container */}
      <article className="border border-white/20 bg-white/[0.02] p-6 sm:p-12 text-zinc-300 leading-relaxed">
        {tab === 'privacy' ? (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-[#00C853]/40 bg-[#00C853]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#00C853]">
              <ShieldCheck size={16} /> Privacy-First Architecture
            </div>
            <h1 className="font-display text-3xl font-black text-white sm:text-5xl tracking-tight">
              Privacy Policy<span className="text-[#00C853]">.</span>
            </h1>
            <p className="font-mono text-xs text-zinc-400">Last updated: February 2025 · Effective immediately</p>

            <section className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">1. Ephemeral Document Processing</h2>
              <p>
                TermSight processes contracts, Terms of Service, EULAs, and legal policies strictly on-demand. When you paste text
                or upload a document, it is analyzed in volatile memory and never permanently stored in a database unless you
                explicitly trigger a share action. We do NOT train AI models on your contracts, proprietary agreements, or uploaded documents.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">2. Client-Side Privacy Shield</h2>
              <p>
                With Privacy Shield enabled, sensitive personally identifiable information (names, emails, telephone numbers,
                Tax IDs, SSNs, and specific dollar figures) is masked locally in your browser using deterministic client-side
                regular expressions before any payload is dispatched to AI reasoning backends.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">3. Local Storage &amp; Cookies</h2>
              <p>
                TermSight does NOT use tracking cookies, cross-site advertising beacons, or third-party behavioral trackers.
                Browser local storage is utilized exclusively to persist your selected interface language and cookie consent preference.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">4. Contact &amp; Data Protection Inquiries</h2>
              <p>
                For questions regarding data processing or privacy inquiries, please contact our team at{' '}
                <a href="mailto:hellotermsight@proton.me" className="text-[#38BDF8] underline hover:text-white">
                  hellotermsight@proton.me
                </a>.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-[#FF3B3B]/40 bg-[#FF3B3B]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#FF3B3B]">
              <Scale size={16} /> Legal Notice &amp; Terms of Service
            </div>
            <h1 className="font-display text-3xl font-black text-white sm:text-5xl tracking-tight">
              Terms of Use &amp; Disclaimer<span className="text-[#FF3B3B]">.</span>
            </h1>
            <p className="font-mono text-xs text-zinc-400">Last updated: February 2025 · Effective immediately</p>

            <section className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">1. Not Legal Advice (Mandatory Disclaimer)</h2>
              <div className="border-l-4 border-[#FF3B3B] bg-[#FF3B3B]/10 p-4 font-medium text-white">
                TermSight provides automated informational summaries and clause risk ratings using heuristic algorithms and large
                language models. TermSight is NOT a law firm and does NOT provide formal legal advice, legal counsel, or attorney
                representation. Using TermSight does not create an attorney-client relationship. Always consult a licensed attorney
                in your jurisdiction for binding legal decisions.
              </div>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">2. Permitted Use</h2>
              <p>
                You are granted a non-exclusive, revocable license to utilize TermSight for reviewing, analyzing, and redlining legal
                agreements. You agree not to use TermSight to analyze unlawful materials or attempt to circumvent application security controls.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">3. Limitation of Liability</h2>
              <p>
                TermSight is provided &quot;AS-IS&quot; without warranties of any kind, express or implied. Under no circumstances shall
                TermSight or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from
                contract signing decisions or reliance upon automated heuristic outputs.
              </p>
            </section>
          </div>
        )}
      </article>
    </div>
  );
}
