
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { streamChatResponse, getDeepAnalysis } from '../services/geminiService';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';


interface ChatbotProps {
    closeChat: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ closeChat }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'Hello! I am the AI Market Explorer assistant. How can I help you today? Ask me about market trends, specific stocks, or financial concepts.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isThinkingMode, setIsThinkingMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const modelMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

        try {
            if (isThinkingMode) {
                const thinkingPrompt = `
Generate a detailed market analysis report for the following query: "${input}".
Your response should be well-structured, using Markdown for formatting (e.g., headings, bold text, bullet points).
Please include the following sections in your report:

### 1. Executive Summary
- A concise overview of the company/asset and the key findings of your analysis.

### 2. Historical Performance Analysis
- Analyze key historical price trends, significant milestones, and periods of high volatility.
- Discuss its performance relative to the broader market or key competitors.

### 3. Fundamental Analysis
- Evaluate the company's financial health (mentioning key metrics if possible, like revenue growth, profitability).
- Assess its market position, competitive advantages (moat), and the industry landscape.

### 4. Future Outlook & Growth Catalysts
- Identify potential growth drivers, such as new products, market expansion, technological advancements, or strategic partnerships.
- Provide a forward-looking perspective on its potential trajectory.

### 5. Potential Risks & Mitigating Factors
- Detail the primary risks (market, operational, regulatory, competitive).
- Discuss any known strategies or factors that might mitigate these risks.

### 6. Concluding Remarks
- Summarize the overall investment thesis based on the analysis.

Provide a comprehensive and insightful report based on publicly available information. Do not provide financial advice.
`;
                const responseText = await getDeepAnalysis(thinkingPrompt);
                 setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: responseText } : m));
            } else {
                const stream = await streamChatResponse(messages, input);
                let text = '';
                for await (const chunk of stream) {
                    text += chunk.text;
                    setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text } : m));
                }
            }
        } catch (error) {
            console.error("Error communicating with Gemini:", error);
            setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: 'Sorry, I encountered an error. Please try again.' } : m));
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, isThinkingMode, messages]);

    return (
        <div className="fixed bottom-20 right-5 z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-700">
            <header className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="font-bold text-lg text-white">AI Assistant</h3>
                <button onClick={closeChat} className="text-gray-400 hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center"><BotIcon className="w-5 h-5 text-white" /></div>}
                        <div className={`max-w-xs md:max-w-sm rounded-xl px-4 py-2 ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text || '...'}</p>
                        </div>
                         {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5 text-white" /></div>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 border-t border-gray-700">
                 <div className="flex items-center justify-center mb-2">
                    <label htmlFor="thinking-toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="thinking-toggle" className="sr-only" checked={isThinkingMode} onChange={() => setIsThinkingMode(!isThinkingMode)} />
                            <div className={`block w-14 h-8 rounded-full transition ${isThinkingMode ? 'bg-primary' : 'bg-gray-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isThinkingMode ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-300 flex items-center">
                           <SparklesIcon className={`w-5 h-5 mr-1 ${isThinkingMode ? 'text-primary' : 'text-gray-400'}`} />
                            Thinking Mode (Complex Queries)
                        </div>
                    </label>
                </div>
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isThinkingMode ? "Enter a complex query..." : "Ask anything..."}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary text-white p-2.5 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-sky-400 transition">
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default Chatbot;
