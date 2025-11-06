
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chat: Chat | null = null;

function getChatInstance(): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are AI Market Scout\'s assistant, a helpful and friendly AI specializing in stock market analysis and financial concepts. Provide concise and accurate information. Do not give financial advice.',
            },
        });
    }
    return chat;
}

export const streamChatResponse = async (history: ChatMessage[], newMessage: string) => {
    const chatInstance = getChatInstance();
    const messagePayload = { message: newMessage };
    
    // Note: The history param is for potential future use if we need to rebuild chat context.
    // The `chat` instance from `ai.chats.create` maintains its own history.
    
    return chatInstance.sendMessageStream(messagePayload);
};

export const getDeepAnalysis = async (prompt: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting deep analysis:", error);
        return "An error occurred while performing deep analysis. Please try again.";
    }
};
