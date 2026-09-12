import { useState } from 'react';
import { MessageSquare, RotateCcw } from 'lucide-react';
import { answerContractQuestion, type QaResult } from '../utils/qaEngine';
import type { Analysis } from '../types/contract';

export function AskContractSection({ analysis }: { analysis: Analysis }) {
  const [query, setQuery] = useState('');
  const [activeAnswer, setActiveAnswer] = useState<QaResult | null>(null);

  const PRESET_QUESTIONS = [
    'Can I cancel anytime without penalty?',
    'Who owns the intellectual property I create?',
    'Can they sell or share my personal data?',
    'What are the liability limits if something breaks?',
    'What is the biggest risk in this contract?',
  ];

  const handleAsk = (q: string) => {
    setQuery(q);
    const res = answerContractQuestion(q, analysis);
    setActiveAnswer(res);
  };

  const handleClear = () => {
    setQuery('');
    setActiveAnswer(null);
  };

  return (
    <div className="mb-8 border border-white/20 bg-white/[0.03] p-6 sm:p-7">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#38BDF8]">
          <MessageSquare size={16} /> Ask This Contract (Instant Q&A)
        </div>
        {activeAnswer && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>
      <p className="mb-4 text-sm text-zinc-300">
        Ask any specific question about cancellations, copyright, fees, liability, or privacy to get an instant cited answer.
      </p>

      {/* Preset Chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESET_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleAsk(q)}
            className="border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-[#38BDF8] hover:text-white"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Custom Question Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) handleAsk(query);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything (e.g. Can they sue me in court? Do I get a refund? What is the best part?)..."
          className="flex-1 border border-white/25 bg-black px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />
        <button
          type="submit"
          className="border-2 border-white bg-white px-5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
        >
          Ask
        </button>
      </form>

      {/* Answer Output */}
      {activeAnswer && (
        <div className="mt-5 border-t border-white/15 pt-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs">
            <span className="font-bold text-zinc-400">Verdict:</span>
            <span
              className={`px-2 py-0.5 font-black uppercase ${
                activeAnswer.riskVerdict === 'High Risk'
                  ? 'bg-[#FF3B3B] text-white'
                  : activeAnswer.riskVerdict === 'Caution'
                  ? 'bg-[#FFB800] text-black'
                  : 'bg-[#00C853] text-white'
              }`}
            >
              {activeAnswer.riskVerdict}
            </span>
            {activeAnswer.matchedClause ? (
              <span className="text-zinc-400">· Citing clause: <strong className="text-white">{activeAnswer.matchedClause.title}</strong></span>
            ) : (
              <span className="text-zinc-400">· General Assessment</span>
            )}
          </div>
          <p className="text-sm font-medium leading-6 text-white sm:text-base">{activeAnswer.answer}</p>
          {activeAnswer.matchedClause && (
            <blockquote className="mt-3 border-l-2 border-[#38BDF8]/40 pl-3 font-mono text-xs italic text-zinc-400">
              “{activeAnswer.matchedClause.quote}”
            </blockquote>
          )}

          {/* Suggested Prompts if question didn't match specific clause */}
          {activeAnswer.suggestedPrompts && activeAnswer.suggestedPrompts.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-3">
              <span className="text-xs font-mono text-zinc-400">Try asking:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeAnswer.suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleAsk(p)}
                    className="border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2.5 py-1 text-xs text-[#38BDF8] transition hover:bg-[#38BDF8]/20"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
