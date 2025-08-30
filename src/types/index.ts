// Type definitions for the AI Bias Detection system

export interface Resume {
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string[];
  location: string;
  [key: string]: any;
}

export interface Assessment {
  resume: Resume;
  ai_score: number;
  persona_score: number;
  persona: string;
  choice: number;
  correct: number;
  explanation: string;
  timestamp: string;
}

export interface BiasMetrics {
  kl_divergence: number;
  js_divergence: number;
  earth_movers_distance: number;
  auc?: number;
}

export interface PerformanceStats {
  correct: number;
  total: number;
  accuracy: number;
  p_value: number;
}

export interface ScoreDistribution {
  ai_scores: number[];
  persona_scores: number[];
}