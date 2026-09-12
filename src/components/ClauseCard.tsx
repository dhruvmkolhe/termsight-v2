import { Mail } from 'lucide-react';
import { riskStyles } from '../constants/contracts';
import { useLanguage } from '../context/LanguageContext';
import type { Clause } from '../types/contract';

export function ClauseCard({
  clause,
  index,
  onNegotiate,
}: {
  clause: Clause;
  index: number;
  onNegotiate?: (clause: Clause) => void;
}) {
  const { t } = useLanguage();
  const style = riskStyles[clause.risk_level];

  return (
    <article className={`contract-card border-l-[6px] ${style.border} bg-[#F5F5F5] p-6 text-[#0A0A0A] sm:p-8`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`${style.badge} inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white`}>
            {clause.risk_label}
          </span>
          {clause.risk_level !== 'green' && onNegotiate && (
            <button
              type="button"
              onClick={() => onNegotiate(clause)}
              className="inline-flex items-center gap-1 border border-black/30 bg-black/5 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
            >
              <Mail size={12} /> {t('counterClause', 'Counter-Clause')}
            </button>
          )}
        </div>
        <span className="font-mono text-xs font-bold text-black/35">{t('clauseNumber', 'CLAUSE')} {String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mb-3 font-display text-2xl font-black leading-tight tracking-[-0.025em] sm:text-[28px]">{clause.title}</h3>
      <p className="max-w-4xl text-base font-medium leading-7 text-black/80 sm:text-lg sm:leading-8">{clause.plain_english}</p>
      <blockquote className="my-6 border-l-2 border-black/20 pl-4 font-mono text-xs italic leading-5 text-black/50 sm:text-sm">
        “{clause.quote}”
      </blockquote>
      <div className="border-t-2 border-black pt-4 text-sm leading-6 sm:text-base">
        <span className="font-black">{t('whatToDo', 'What to do:')} </span>
        <span className="font-medium text-black/75">{clause.what_to_do}</span>
      </div>
    </article>
  );
}
