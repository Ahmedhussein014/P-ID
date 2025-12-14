import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

interface DiagramViewerProps {
  imageUrl: string;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({ imageUrl }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setScale(s => Math.min(s + 0.5, 4));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.5, 1));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700 z-10">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-blue-400" />
          Diagram View
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button 
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1"></div>
          <button 
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Area */}
      <div 
        className={`flex-1 overflow-hidden relative bg-slate-950 flex items-center justify-center ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          className="max-w-full max-h-full p-4"
        >
          <img 
            src={imageUrl} 
            alt="P&ID Diagram" 
            className="max-w-full max-h-full object-contain pointer-events-none select-none shadow-xl"
            draggable={false}
          />
        </div>
        
        {/* Overlay instructions for panning */}
        {scale > 1 && !isDragging && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none backdrop-blur-sm">
            Drag to pan
          </div>
        )}
      </div>
    </div>
  );
};
