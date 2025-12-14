import React from 'react';
import { Network, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">P&ID Insight</h1>
            <p className="text-xs text-slate-400">AI-Powered Engineering Diagram Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="flex items-center text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
             <Activity className="w-3 h-3 mr-2 text-green-400" />
             System Ready
           </div>
        </div>
      </div>
    </header>
  );
};
