
import React, { useState, useMemo } from 'react';
import type { Stock } from '../types';

interface StockTableProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

const riskColorMap = {
    'Low': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'High': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const SortIcon: React.FC<{ direction: 'ascending' | 'descending' | 'none' }> = ({ direction }) => {
    if (direction === 'ascending') return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.96 8.94a.75.75 0 0 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06L10.75 5.612V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" /></svg>;
    if (direction === 'descending') return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.29-3.29a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.97 12.03a.75.75 0 0 1 1.06-1.06l3.22 3.22V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 opacity-30"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>;
};

const StockTable: React.FC<StockTableProps> = ({ stocks, onSelectStock }) => {
    const [sectorFilter, setSectorFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Stock; direction: 'ascending' | 'descending' }>({ key: 'rank', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);
    const ITEMS_PER_PAGE = 10;

    const sectors = useMemo(() => ['All', ...Array.from(new Set(stocks.map(s => s.sector)))], [stocks]);

    const handleSort = (key: keyof Stock) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const sortedStocks = useMemo(() => {
        let sortableItems = [...stocks];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [stocks, sortConfig]);

    const filteredStocks = useMemo(() => {
        return sortedStocks
            .filter(stock => sectorFilter === 'All' || stock.sector === sectorFilter)
            .filter(stock => 
                stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [sortedStocks, sectorFilter, searchTerm]);

    const paginatedStocks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStocks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredStocks, currentPage]);

    const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);

    const convertToCSV = (data: Stock[]) => {
        const header = Object.keys(data[0]).join(',');
        const rows = data.map(stock => 
            Object.values(stock).map(value => 
                Array.isArray(value) ? `"${value.join('; ')}"` : `"${String(value)}"`
            ).join(',')
        );
        return [header, ...rows].join('\n');
    };

    const handleExport = () => {
        const csvData = convertToCSV(filteredStocks);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'top-100-stocks.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpdate = () => {
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 2000);
    };

    const tableHeaders: { key: keyof Stock, label: string, hidden?: 'md' | 'lg' }[] = [
        { key: 'rank', label: 'Rank' },
        { key: 'ticker', label: 'Ticker' },
        { key: 'name', label: 'Name' },
        { key: 'predicted_multiplier', label: 'Multiplier' },
        { key: 'confidence', label: 'Confidence' },
        { key: 'risk_level', label: 'Risk Level' },
        { key: 'sector', label: 'Sector', hidden: 'lg' },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <input type="text" placeholder="Search by Ticker or Name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-auto bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2" />
                    <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="w-full sm:w-auto bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2">
                        {sectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button onClick={handleUpdate} disabled={isUpdating} className="w-1/2 md:w-auto text-nowrap text-sm font-semibold bg-gray-600 hover:bg-gray-500 transition-colors duration-200 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        {isUpdating ? 'Updating...' : 'Update Forecast'}
                    </button>
                    <button onClick={handleExport} className="w-1/2 md:w-auto text-nowrap text-sm font-semibold text-primary hover:text-white bg-primary/20 hover:bg-primary/30 transition-colors duration-200 px-4 py-2 rounded-lg">Export CSV</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            {tableHeaders.map(({ key, label, hidden }) => (
                                <th key={key} scope="col" className={`p-4 ${hidden ? `hidden ${hidden}:table-cell` : ''}`}>
                                    <button onClick={() => handleSort(key)} className="flex items-center gap-1.5 group">
                                        {label}
                                        <SortIcon direction={sortConfig.key === key ? sortConfig.direction : 'none'} />
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStocks.map(stock => (
                           <tr key={stock.ticker} onClick={() => onSelectStock(stock)} className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 group">
                               <td className="p-4 font-semibold text-white">{stock.rank}</td>
                               <td className="p-4 font-semibold text-gray-300">{stock.ticker}</td>
                               <td className="p-4 text-gray-300">{stock.name}</td>
                               <td className="p-4 font-medium text-green-400">{stock.predicted_multiplier}x</td>
                               <td className="p-4 min-w-[120px]">
                                   <div className="w-full bg-gray-600 rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${stock.confidence * 100}%` }}></div></div>
                                   <span className="text-xs text-gray-400">{Math.round(stock.confidence * 100)}%</span>
                               </td>
                               <td className="p-4">
                                   <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${riskColorMap[stock.risk_level]}`}>{stock.risk_level}</span>
                               </td>
                               <td className="p-4 text-gray-400 hidden lg:table-cell">{stock.sector}</td>
                               <td className="p-4 text-right">
                                   <button onClick={(e) => { e.stopPropagation(); onSelectStock(stock); }} className="text-sm font-semibold text-primary hover:text-white transition-colors duration-200 opacity-0 group-hover:opacity-100">Details</button>
                               </td>
                           </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-gray-400">Showing page {currentPage} of {totalPages}</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockTable;
