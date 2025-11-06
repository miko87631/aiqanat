
import type { Stock, BacktestEntry } from './types';

export const mockStocks: Stock[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp',
    predicted_multiplier: 3.5,
    confidence: 0.92,
    horizon: '12 months',
    key_drivers: ['AI Chip Dominance', 'Strong Earnings Growth', 'Data Center Expansion'],
    risk_flags: ['High Valuation', 'Geopolitical Tensions', 'Competition'],
    market: 'NASDAQ',
    sector: 'Technology'
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    predicted_multiplier: 2.8,
    confidence: 0.85,
    horizon: '18 months',
    key_drivers: ['EV Market Leadership', 'Autonomous Driving Tech', 'Energy Storage Growth'],
    risk_flags: ['Production Scalability', 'Regulatory Scrutiny'],
    market: 'NASDAQ',
    sector: 'Consumer Cyclical'
  },
    {
    ticker: 'CRWD',
    name: 'CrowdStrike Holdings',
    predicted_multiplier: 4.1,
    confidence: 0.88,
    horizon: '24 months',
    key_drivers: ['Leader in Endpoint Security', 'Strong Subscription Growth', 'Expanding TAM'],
    risk_flags: ['High Competition in Cybersecurity', 'Valuation Concerns'],
    market: 'NASDAQ',
    sector: 'Technology'
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    predicted_multiplier: 3.2,
    confidence: 0.81,
    horizon: '12 months',
    key_drivers: ['Government Contracts', 'Commercial Expansion (AIP)', 'Unique Data Platform'],
    risk_flags: ['Contract Dependency', 'Negative Sentiment', 'Complex Sales Cycle'],
    market: 'NYSE',
    sector: 'Technology'
  },
  {
    ticker: 'SNOW',
    name: 'Snowflake Inc.',
    predicted_multiplier: 2.5,
    confidence: 0.90,
    horizon: '18 months',
    key_drivers: ['Cloud Data Platform Leader', 'High Net Revenue Retention', 'Usage-Based Model'],
    risk_flags: ['Intense Competition', 'High Stock-Based Compensation'],
    market: 'NYSE',
    sector: 'Technology'
  },
  {
    ticker: 'U',
    name: 'Unity Software Inc.',
    predicted_multiplier: 5.2,
    confidence: 0.75,
    horizon: '24 months',
    key_drivers: ['Dominant Gaming Engine', 'Expansion into non-gaming industries', 'New Pricing Model Adoption'],
    risk_flags: ['Recent Controversies', 'Dependence on Gaming Market'],
    market: 'NYSE',
    sector: 'Technology'
  },
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    predicted_multiplier: 2.9,
    confidence: 0.89,
    horizon: '12 months',
    key_drivers: ['Competitive CPU/GPU products', 'Data Center Market Share Gains', 'Xilinx Acquisition Synergy'],
    risk_flags: ['Cyclical Semiconductor Industry', 'Supply Chain Risks'],
    market: 'NASDAQ',
    sector: 'Technology'
  },
  {
    ticker: 'SHOP',
    name: 'Shopify Inc.',
    predicted_multiplier: 3.0,
    confidence: 0.83,
    horizon: '18 months',
    key_drivers: ['E-commerce Platform Growth', 'Merchant Solutions Expansion', 'International Markets'],
    risk_flags: ['Competition from Amazon', 'Slowing E-commerce Growth Post-Pandemic'],
    market: 'NYSE',
    sector: 'Technology'
  },
  {
    ticker: 'RBLX',
    name: 'Roblox Corp',
    predicted_multiplier: 4.5,
    confidence: 0.78,
    horizon: '24 months',
    key_drivers: ['Growing User Base (Gen Z)', 'Metaverse Platform Potential', 'Creator Economy'],
    risk_flags: ['Monetization Challenges', 'Content Moderation Risks'],
    market: 'NYSE',
    sector: 'Communication Services'
  },
  {
    ticker: 'ABNB',
    name: 'Airbnb, Inc.',
    predicted_multiplier: 2.2,
    confidence: 0.86,
    horizon: '12 months',
    key_drivers: ['Travel Industry Rebound', 'Flexible Work Trends', 'Strong Brand Recognition'],
    risk_flags: ['Regulatory Hurdles', 'Economic Downturn Impacting Travel'],
    market: 'NASDAQ',
    sector: 'Consumer Cyclical'
  }
];

export const mockBacktestData: { [key: string]: BacktestEntry[] } = {
  'NVDA': [
    { ticker: 'NVDA', entry_date: '2022-01-15', exit_date: '2022-07-15', multiplier: 1.8 },
    { ticker: 'NVDA', entry_date: '2022-08-01', exit_date: '2023-02-01', multiplier: 2.5 },
  ],
  'TSLA': [
    { ticker: 'TSLA', entry_date: '2021-11-10', exit_date: '2022-05-10', multiplier: 1.5 },
    { ticker: 'TSLA', entry_date: '2022-06-20', exit_date: '2022-12-20', multiplier: 2.1 },
  ]
};

export const mockPriceData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  price: 100 + Math.random() * 20 * Math.sin(i / 3) + i * 2,
}));

export const mockFeatureAttributionData = [
    { name: 'P/E Ratio', value: 0.15, fill: '#8884d8' },
    { name: 'RSI (14)', value: 0.25, fill: '#82ca9d' },
    { name: 'News Sentiment', value: 0.35, fill: '#ffc658' },
    { name: 'Insider Buying', value: 0.10, fill: '#ff8042' },
    { name: 'Volume Spike', value: 0.15, fill: '#00C49F' },
];
