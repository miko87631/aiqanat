
import React, { useState, useMemo } from 'react';
import type { Stock } from '../types';

interface StockTableProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

const StockRow: React.FC<{ stock: Stock, onSelectStock: (stock: Stock) => void }> = ({ stock, onSelectStock }) => {
    return (
        <tr 
            className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 group"
            onClick={() => onSelectStock(stock)}
        >
            <td className="p-4 font-semibold text-white">{stock.ticker}</td>
            <td className="p-4 text-gray-300">{stock.name}</td>
            <td className="p-4 font-medium text-green-400">{stock.predicted_multiplier}x</td>
            <td className="p-4">
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${stock.confidence * 100}%` }}></div>
                </div>
                <span className="text-sm text-gray-400">{Math.round(stock.confidence * 100)}%</span>
            </td>
            <td className="p-4 text-gray-400 hidden md:table-cell">{stock.horizon}</td>
            <td className="p-4 text-gray-400 hidden lg:table-cell">{stock.sector}</td>
            <td className="p-4">
                <button 
                    onClick={(e) => { e.stopPropagation(); onSelectStock(stock); }}
                    className="text-sm font-semibold text-primary hover:text-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                    Details
                </button>
            </td>
        </tr>
    );
};


const StockTable: React.FC<StockTableProps> = ({ stocks, onSelectStock }) => {
    const [sectorFilter, setSectorFilter] = useState('All');
    const sectors = useMemo(() => ['All', ...Array.from(new Set(stocks.map(s => s.sector)))], [stocks]);

    const filteredStocks = useMemo(() => {
        if (sectorFilter === 'All') return stocks;
        return stocks.filter(stock => stock.sector === sectorFilter);
    }, [stocks, sectorFilter]);

    return (
        <div>
            <div className="mb-4">
                <label htmlFor="sector" className="text-sm font-medium text-gray-400 mr-2">Filter by Sector:</label>
                <select 
                    id="sector" 
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2"
                >
                    {sectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="p-4">Ticker</th>
                            <th scope="col" className="p-4">Name</th>
                            <th scope="col" className="p-4">Multiplier</th>
                            <th scope="col" className="p-4">Confidence</th>
                            <th scope="col" className="p-4 hidden md:table-cell">Horizon</th>
                            <th scope="col" className="p-4 hidden lg:table-cell">Sector</th>
                            <th scope="col" className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStocks.map(stock => (
                           <StockRow key={stock.ticker} stock={stock} onSelectStock={onSelectStock} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockTable;
