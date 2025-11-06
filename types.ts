
export interface Stock {
  ticker: string;
  name: string;
  predicted_multiplier: number;
  confidence: number;
  horizon: string;
  key_drivers: string[];
  risk_flags: string[];
  market: string;
  sector: string;
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
