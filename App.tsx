
import React, { useState } from 'react';
import type { Stock } from './types';
import { mockStocks } from './constants';
import StockTable from './components/StockTable';
import StockDetailModal from './components/StockDetailModal';
import ChatWidget from './components/ChatWidget';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-gray-800 shadow-lg rounded-xl p-4 md:p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Daily Top 10 Growth Stocks</h2>
            <StockTable stocks={mockStocks} onSelectStock={handleSelectStock} />
        </div>
      </main>
      <StockDetailModal stock={selectedStock} onClose={handleCloseModal} />
      <ChatWidget />
    </div>
  );
};

export default App;
