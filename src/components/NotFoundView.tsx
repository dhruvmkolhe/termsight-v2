import { useEffect } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { track404 } from '../utils/analytics';

interface Props {
  onReturnHome: () => void;
}

export function NotFoundView({ onReturnHome }: Props) {
  useEffect(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/404';
    track404(path);
  }, []);

  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-16 text-center">
      <div className="w-full max-w-lg border border-white/20 bg-white/[0.02] p-8 sm:p-12">
        <div className="mb-4 inline-flex items-center gap-2 border border-[#FF3B3B]/40 bg-[#FF3B3B]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#FF3B3B]">
          <AlertTriangle size={14} /> Error 404 · Uncharted Clause
        </div>
        <h1 className="font-display text-6xl font-black tracking-tight sm:text-7xl text-white">
          404<span className="text-[#FF3B3B]">.</span>
        </h1>
        <p className="mt-4 text-sm text-zinc-300 sm:text-base">
          This clause could not be found or has moved. The fine print doesn&apos;t mention this path.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-2 border-2 border-white bg-white px-6 py-3 font-display text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
          >
            <ArrowLeft size={16} /> Return to Auditor
          </button>
        </div>
      </div>
    </div>
  );
}
