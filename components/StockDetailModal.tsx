
import React from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { ArrowTrendingUpIcon } from './icons/ArrowTrendingUpIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { mockBacktestData, mockPriceData, mockFeatureAttributionData } from '../constants';
import type { Stock } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface StockDetailModalProps {
  stock: Stock | null;
  onClose: () => void;
}

const riskColorMap = {
    'Low': 'text-green-400',
    'Medium': 'text-yellow-400',
    'High': 'text-red-400',
};

const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose }) => {
  if (!stock) return null;

  const backtestData = mockBacktestData[stock.ticker] || [];

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
            <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
            <div className="mb-6">
                <div className="flex items-baseline gap-4">
                    <h2 className="text-3xl font-bold text-white">{stock.name} ({stock.ticker})</h2>
                    <span className="text-sm text-gray-500">Last Updated: {stock.last_updated}</span>
                </div>
                <p className="text-gray-400">{stock.sector}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 text-center">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Rank</p>
                    <p className="text-2xl font-semibold text-white">#{stock.rank}</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Multiplier</p>
                    <p className="text-2xl font-semibold text-green-400">{stock.predicted_multiplier}x</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Confidence</p>
                    <p className="text-2xl font-semibold text-primary">{Math.round(stock.confidence * 100)}%</p>
                </div>
                 <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Horizon</p>
                    <p className="text-2xl font-semibold text-white">{stock.time_horizon_days}d</p>
                </div>
                 <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Risk Level</p>
                    <p className={`text-2xl font-semibold ${riskColorMap[stock.risk_level]}`}>{stock.risk_level}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-white flex items-center"><ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-400" /> Key Drivers</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {stock.key_drivers.map(driver => <li key={driver}>{driver}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-white flex items-center"><ShieldExclamationIcon className="w-5 h-5 mr-2 text-red-400" /> Risk Flags</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {stock.risk_flags.map(risk => <li key={risk}>{risk}</li>)}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-white">Price Chart (Mock Data)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={mockPriceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4B4B4B" />
                            <XAxis dataKey="date" stroke="#A0AEC0" fontSize={12} />
                            <YAxis stroke="#A0AEC0" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #4B4B4B' }} />
                            <Line type="monotone" dataKey="price" stroke="#00BFFF" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-white">Model Attribution (SHAP-like)</h3>
                     <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={mockFeatureAttributionData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#4B4B4B" />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} stroke="#A0AEC0" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #4B4B4B' }} />
                            <Bar dataKey="value" fill="#00BFFF" background={{ fill: '#2D2D2D' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {backtestData.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-white">Backtest History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                             <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                                <tr>
                                    <th className="p-3">Entry Date</th>
                                    <th className="p-3">Exit Date</th>
                                    <th className="p-3">Multiplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {backtestData.map((entry, index) => (
                                    <tr key={index} className="border-b border-gray-700">
                                        <td className="p-3">{entry.entry_date}</td>
                                        <td className="p-3">{entry.exit_date}</td>
                                        <td className="p-3 text-green-400">{entry.multiplier}x</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StockDetailModal;
