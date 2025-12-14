import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { ChatMessage } from '../types';

interface AnalysisPanelProps {
  initialAnalysis: string | null;
  isAnalyzing: boolean;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isChatLoading: boolean;
  onReset: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
  initialAnalysis, 
  isAnalyzing, 
  messages, 
  onSendMessage,
  isChatLoading,
  onReset
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, initialAnalysis]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  // Loading State
  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-slate-800">Analyzing Diagram</h3>
        <p className="mt-2 text-slate-500 text-center max-w-sm">
          Our AI is identifying equipment, tracing process lines, and analyzing control strategies...
        </p>
      </div>
    );
  }

  // Initial State (No analysis yet) is handled by parent showing upload, so this component generally receives content.
  if (!initialAnalysis) return null;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-slate-800">Process Assistant</h2>
        </div>
        <button 
          onClick={onReset}
          className="text-xs flex items-center text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
        >
          <RefreshCcw className="w-3 h-3 mr-1.5" />
          New Diagram
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        
        {/* Initial Analysis Report */}
        <div className="prose prose-slate prose-sm max-w-none">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
               <Sparkles className="w-4 h-4 text-indigo-500" />
               <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Analysis Report</span>
            </div>
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-semibold text-slate-800 mt-4 mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                li: ({node, ...props}) => <li className="text-slate-700" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-blue-700" {...props} />,
              }}
            >
              {initialAnalysis}
            </ReactMarkdown>
          </div>
        </div>

        {/* Divider */}
        {messages.length > 0 && (
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Chat History</span>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex-1 p-4 rounded-xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
              }`}>
                {msg.role === 'user' ? (
                  <p>{msg.text}</p>
                ) : (
                  <ReactMarkdown 
                    className="prose prose-sm max-w-none prose-invert-headings:text-slate-800"
                    components={{
                        // Minimal styling for chat bubbles to keep it clean
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl rounded-tl-none">
                 <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about specific valves, lines, or safety logic..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 placeholder:text-slate-400 transition-shadow shadow-sm"
            disabled={isChatLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI can make mistakes. Verify critical safety details with certified P&IDs.
        </p>
      </div>
    </div>
  );
};
