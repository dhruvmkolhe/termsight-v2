import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageSelector() {
  const { language, setLanguage, supportedLanguages, currentLanguageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select language"
        className={`group inline-flex items-center gap-2 border px-2.5 py-1.5 text-xs font-mono font-medium transition ${
          isOpen
            ? 'border-white bg-white text-black'
            : 'border-white/20 bg-white/5 text-zinc-200 hover:border-white/40 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Globe
          size={14}
          className={`transition ${
            isOpen ? 'text-black' : 'text-[#38BDF8] group-hover:scale-110'
          }`}
        />
        <span className="text-sm leading-none">{currentLanguageInfo.flag}</span>
        <span className="hidden sm:inline">{currentLanguageInfo.nativeName}</span>
        <span className="inline sm:hidden uppercase">{currentLanguageInfo.code}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-black' : 'text-zinc-400'}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 border border-white/25 bg-[#0F0F0F] p-1.5 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
            Language / Idioma / 语言
          </div>
          <div className="py-1 max-h-72 overflow-y-auto">
            {supportedLanguages.map((lang) => {
              const isActive = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-2.5 py-2 text-left text-xs transition ${
                    isActive
                      ? 'bg-white font-bold text-black'
                      : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="leading-none">{lang.nativeName}</span>
                      <span className={`text-[10px] ${isActive ? 'text-black/70' : 'text-zinc-500'}`}>
                        {lang.name}
                      </span>
                    </div>
                  </div>
                  {isActive && <Check size={14} className="stroke-[3] text-black" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
