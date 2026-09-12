import { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface Props {
  onOpenPrivacy: () => void;
}

const COOKIE_STORAGE_KEY = 'termsight_cookie_consent';

export function CookieBanner({ onOpenPrivacy }: Props) {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const handleChoice = (decision: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, decision);
    } catch {
      // Ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and cookies notice"
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-2xl border border-white/20 bg-[#0A0A0A]/95 p-4 text-white shadow-2xl backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#00C853]" size={18} />
          <div className="text-xs leading-relaxed text-zinc-300">
            <span className="font-bold text-white">Privacy Notice:</span> We use minimal browser storage only to preserve your preferred language and audit settings. We do not use third-party advertising cookies.{' '}
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="font-bold text-[#38BDF8] underline hover:text-white"
            >
              Read our Privacy Policy
            </button>.
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleChoice('declined')}
          aria-label="Dismiss cookie notice"
          className="text-zinc-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => handleChoice('declined')}
          className="border border-white/20 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-zinc-300 hover:border-white hover:text-white"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => handleChoice('accepted')}
          className="border border-white bg-white px-3 py-1 font-display text-[11px] font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
        >
          Accept
        </button>
      </div>
    </aside>
  );
}
