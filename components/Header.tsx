
import React from 'react';
import { BotIcon } from './icons/BotIcon';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
            <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <BotIcon className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-bold text-white tracking-tight">AI Market Scout</h1>
                </div>
            </div>
        </header>
    );
};
