import React, { useState, useEffect, useRef } from 'react';
import { Landmark, ShieldAlert, RefreshCw } from 'lucide-react';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { geminiService } from './services/geminiService';
import { Message, ChatState } from './types';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'model',
  text: "Hello! I'm **ProfileWise**, your Investment Account Guide.\n\nI'm here to help you understand different types of investment accounts so you can make informed decisions. To get started, could you tell me a little bit about what you're hoping to achieve? \n\n*For example, are you saving for retirement, a home, education, or just looking to grow your wealth generally?*",
  timestamp: new Date(),
};

export default function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [INITIAL_MESSAGE],
    isLoading: false,
    error: null,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session on mount
  useEffect(() => {
    geminiService.initChat();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages, chatState.isLoading]);

  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const responseText = await geminiService.sendMessage(text);
      
      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, newModelMessage],
        isLoading: false,
      }));
    } catch (error: any) {
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "An unexpected error occurred.",
      }));
    }
  };

  const handleReset = () => {
    geminiService.initChat();
    setChatState({
      messages: [{ ...INITIAL_MESSAGE, timestamp: new Date() }],
      isLoading: false,
      error: null,
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-md z-10 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Landmark className="h-6 w-6 text-emerald-50" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ProfileWise</h1>
              <p className="text-emerald-200 text-xs font-medium">Investment Account Guide</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-sm bg-emerald-700 hover:bg-emerald-600 px-3 py-2 rounded-md transition-colors"
            title="Start a new conversation"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-grow overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          
          {/* Educational Notice Banner */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 text-blue-800 shadow-sm">
            <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Educational Purpose Only</p>
              <p>
                ProfileWise is designed to help you explore and compare general account types. 
                It does not provide personalized financial, tax, or legal advice. Always consult with a qualified professional before making investment decisions.
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-2">
            {chatState.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {/* Loading Indicator */}
            {chatState.isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex max-w-[85%] md:max-w-[75%] flex-row">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-700 mr-3 flex items-center justify-center">
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-slate-500 ml-2">Synthesizing options...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {chatState.error && (
              <div className="flex justify-center my-4">
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 text-sm max-w-md text-center">
                  {chatState.error}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />
    </div>
  );
}
