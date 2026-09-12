export type RiskLevel = 'red' | 'yellow' | 'green';

export type Clause = {
  title: string;
  plain_english: string;
  risk_level: RiskLevel;
  risk_label: string;
  what_to_do: string;
  quote: string;
};

export type Analysis = {
  id: number | string;
  title: string;
  source_text: string;
  clauses: Clause[];
  red_count: number;
  yellow_count: number;
  green_count: number;
  created_at: string;
};

export type SampleContract = {
  id: string;
  name: string;
  badgeText: string;
  risk: RiskLevel;
  riskClass: string;
  description: string;
  text: string;
};

export type DiffSample = {
  id: string;
  name: string;
  originalText: string;
  updatedText: string;
};

export type DeadlineItem = {
  id: string;
  title: string;
  category: 'cancellation' | 'payment' | 'dispute' | 'privacy' | 'general';
  timeframe: string;
  daysOffset: number;
  description: string;
  quote: string;
  urgency: 'high' | 'medium' | 'low';
};

export type QuestionResult = {
  answer: string;
  clauses: Clause[];
  verdict: 'safe' | 'caution' | 'danger';
};

export type NoticeType = 'arbitration' | 'datapurge' | 'cancellation';
