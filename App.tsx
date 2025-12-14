import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DiagramViewer } from './components/DiagramViewer';
import { AnalysisPanel } from './components/AnalysisPanel';
import { pidService } from './services/geminiService';
import { ChatMessage, DiagramData } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [diagram, setDiagram] = useState<DiagramData | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (base64: string, mimeType: string, previewUrl: string) => {
    setDiagram({ base64, mimeType, previewUrl });
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setMessages([]);

    try {
      const result = await pidService.startAnalysis(base64, mimeType);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze the diagram. Please check your API Key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    try {
      const responseText = await pidService.sendFollowUp(text);
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, newAiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error trying to answer that. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleReset = () => {
    setDiagram(null);
    setAnalysis(null);
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col h-[calc(100vh-64px)]">
        {!diagram ? (
          <div className="flex-1 flex flex-col">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isAnalyzing} />
            {error && (
              <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center border border-red-200">
                <AlertTriangle className="w-5 h-5 mr-3" />
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
            {/* Left Column: Diagram Viewer */}
            <div className="h-full min-h-0 flex flex-col">
               <DiagramViewer imageUrl={diagram.previewUrl} />
            </div>

            {/* Right Column: Analysis & Chat */}
            <div className="h-full min-h-0 flex flex-col">
              <AnalysisPanel 
                initialAnalysis={analysis} 
                isAnalyzing={isAnalyzing}
                messages={messages}
                onSendMessage={handleSendMessage}
                isChatLoading={isChatLoading}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
