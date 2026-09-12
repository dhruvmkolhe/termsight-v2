import type { Analysis } from '../types/contract';

export type ScoreMeta = {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  label: string;
  summary: string;
  color: string;
  bg: string;
  badgeBg: string;
  border: string;
};

export function computeFairnessScore(analysis: Analysis): ScoreMeta {
  const total = analysis.clauses.length;
  if (total === 0) {
    return {
      score: 100,
      grade: 'A',
      label: 'Safe & Clean',
      summary: 'No clauses detected.',
      color: 'text-[#00C853]',
      bg: 'bg-[#00C853]',
      badgeBg: 'bg-[#00C853]/15 text-[#00C853] border-[#00C853]/40',
      border: 'border-[#00C853]',
    };
  }

  const rawScore = Math.round(((analysis.green_count * 100) + (analysis.yellow_count * 45) + (analysis.red_count * 0)) / total);
  const score = Math.max(0, Math.min(100, rawScore));

  if (score >= 85) {
    return {
      score,
      grade: 'A',
      label: 'Safe & Consumer-Friendly',
      summary: 'Standard, fair contract terms with no severe predatory clauses detected.',
      color: 'text-[#00C853]',
      bg: 'bg-[#00C853]',
      badgeBg: 'bg-[#00C853]/15 text-[#00C853] border-[#00C853]/40',
      border: 'border-[#00C853]',
    };
  }
  if (score >= 70) {
    return {
      score,
      grade: 'B',
      label: 'Mostly Fair (Minor Cautions)',
      summary: 'Generally acceptable agreement, but contains some restrictive liability or data retention policies.',
      color: 'text-[#A3E635]',
      bg: 'bg-[#A3E635]',
      badgeBg: 'bg-[#A3E635]/15 text-[#A3E635] border-[#A3E635]/40',
      border: 'border-[#A3E635]',
    };
  }
  if (score >= 50) {
    return {
      score,
      grade: 'C',
      label: 'Moderate Risk (Review Carefully)',
      summary: 'Multiple unfavorable terms such as unilateral fee revisions, telemetry tracking, or mandatory arbitration.',
      color: 'text-[#FFB800]',
      bg: 'bg-[#FFB800]',
      badgeBg: 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40',
      border: 'border-[#FFB800]',
    };
  }
  if (score >= 30) {
    return {
      score,
      grade: 'D',
      label: 'High Risk (Predatory Traps Found)',
      summary: 'Significant red flags identified including overreaching IP claims, tight auto-renewals, or unfair indemnities.',
      color: 'text-[#FB923C]',
      bg: 'bg-[#FB923C]',
      badgeBg: 'bg-[#FB923C]/15 text-[#FB923C] border-[#FB923C]/40',
      border: 'border-[#FB923C]',
    };
  }
  return {
    score,
    grade: 'F',
    label: 'Critical Hazard (Unconscionable)',
    summary: 'Extremely aggressive contract stripping user rights, claiming perpetual IP licenses, and enforcing one-sided waivers.',
    color: 'text-[#FF3B3B]',
    bg: 'bg-[#FF3B3B]',
    badgeBg: 'bg-[#FF3B3B]/15 text-[#FF3B3B] border-[#FF3B3B]/40',
    border: 'border-[#FF3B3B]',
  };
}
