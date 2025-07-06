
import React, { useState, useEffect, useRef } from 'react';
import { FullPlan, ChatMessage } from '../types';
import { createChat } from '../services/geminiService';
import { Chat as GeminiChat } from '@google/genai';

const Chat: React.FC<{ plan: FullPlan }> = ({ plan }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const chatRef = useRef<GeminiChat | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
      chatRef.current = createChat(plan);
      setMessages([
        { role: 'model', text: 'Ваш план готов! Я ваш персональный AI-тренер. Задавайте любые вопросы по программе тренировок или диете.' }
      ]);
      setInitializationError(null);
    } catch (err) {
      if (err instanceof Error) {
          setInitializationError(err.message);
      } else {
          setInitializationError("Не удалось инициализировать чат.");
      }
      console.error("Chat initialization error:", err);
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = await chatRef.current.sendMessageStream({ message: userMessage.text });
        
        let fullResponse = "";
        setMessages(prev => [...prev, { role: 'model', text: '' }]);
        
        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setMessages(prev => {
                const updatedMessages = [...prev];
                if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'model') {
                    updatedMessages[updatedMessages.length - 1].text = fullResponse;
                }
                return updatedMessages;
            });
        }
    } catch (err) {
        console.error("Chat error:", err);
        const errorMessageText = err instanceof Error ? err.message : "Извините, произошла ошибка.";
        const errorMessage: ChatMessage = { role: 'model', text: errorMessageText };
        setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === 'model' && lastMsg.text === '') {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = errorMessage;
                return newMsgs;
            }
            return [...prev, errorMessage];
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-light-tertiary dark:border-dark-tertiary animate-fade-in">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-text-dark-primary dark:text-text-light-primary">Чат с AI-тренером</h3>
        <div className="bg-light-primary dark:bg-dark-tertiary rounded-lg p-2 sm:p-4 h-96 overflow-y-auto flex flex-col space-y-4">
            {initializationError && (
                <div className="m-auto text-center p-4 bg-red-900/50 text-red-100 rounded-lg">
                    <p className="font-bold">Ошибка инициализации чата</p>
                    <p className="text-sm">{initializationError}</p>
                </div>
            )}
            {!initializationError && messages.map((msg, index) => (
                <div key={index} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-soviet-red text-white' : 'bg-light-secondary dark:bg-dark-primary text-text-dark-primary dark:text-text-light-primary'}`}>
                        <p className="whitespace-pre-wrap">{msg.text || '...'}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={initializationError ? "Чат недоступен" : "Спросите что-нибудь о вашем плане..."}
                className="flex-grow bg-light-primary dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-text-dark-primary dark:text-text-light-primary focus:outline-none focus:ring-2 focus:ring-soviet-red transition-all disabled:opacity-50"
                disabled={isLoading || !!initializationError}
                aria-label="Your message to the AI coach"
            />
            <button 
                type="submit" 
                className="bg-soviet-red text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed" 
                disabled={isLoading || !input.trim() || !!initializationError}
                aria-label="Send message"
            >
                {isLoading ? '...' : 'Отправить'}
            </button>
        </form>
    </div>
  );
};

export default Chat;