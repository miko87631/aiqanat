
export interface Stock {
  rank: number;
  ticker: string;
  name: string;
  predicted_multiplier: number;
  confidence: number;
  time_horizon_days: number;
  key_drivers: string[];
  risk_flags: string[];
  risk_level: 'Low' | 'Medium' | 'High';
  sector: string;
  market: string;
  last_updated: string;
}

export interface BacktestEntry {
  ticker: string;
  entry_date: string;
  exit_date: string;
  multiplier: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
}
