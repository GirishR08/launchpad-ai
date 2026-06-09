export interface AnalysisRequest {
  idea: string;
  apiKey?: string;
}

export interface ViabilityScore {
  market: number;
  competition: number;
  monetization: number;
  technical: number;
  timing: number;
  uniqueness: number;
  overall: number;
}

export interface Competitor {
  name: string;
  description: string;
  weakness: string;
  url?: string;
}

export interface DomainResult {
  name: string;
  domain: string;
  available: boolean | null;
  checking: boolean;
  price?: string;
}

export interface PitchVariant {
  type: "elevator" | "twitter" | "investor";
  label: string;
  text: string;
}

export interface MarketInsight {
  tam: string;
  trend: "growing" | "stable" | "declining";
  trendLabel: string;
  competition: "low" | "medium" | "high";
  timeToMarket: string;
}

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  timeframe: string;
}

export interface AnalysisResult {
  id: string;
  idea: string;
  createdAt: string;
  viability: ViabilityScore;
  market: MarketInsight;
  names: DomainResult[];
  competitors: Competitor[];
  pitches: PitchVariant[];
  actions: ActionStep[];
  summary: string;
}

export interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}
