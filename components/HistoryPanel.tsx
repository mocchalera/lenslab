import React from 'react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  items: HistoryItem[];
  currentId: string | null;
  onSelect: (item: HistoryItem) => void;
  onDownloadOne: (item: HistoryItem) => void;
  onDownloadAll: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  items, 
  currentId, 
  onSelect, 
  onDownloadOne, 
  onDownloadAll 
}) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full h-48 bg-zinc-900 border-t border-zinc-800 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Session History</h3>
          <span className="text-xs text-zinc-500">({items.length})</span>
        </div>
        
        <button
          onClick={onDownloadAll}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All (ZIP)
        </button>
      </div>

      <div className="flex-grow overflow-x-auto p-4 space-x-4 flex items-center scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {items.map((item) => {
          const isSelected = item.id === currentId;
          const date = new Date(item.timestamp);
          const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          return (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className={`relative flex-shrink-0 group cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 scale-105 z-10' 
                  : 'hover:ring-1 hover:ring-zinc-600 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-32 h-24 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                <img 
                  src={item.imageUrl} 
                  alt={`Gen ${timeStr}`} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Overlay Info */}
              <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1.5 flex justify-between items-end">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] text-zinc-300 font-mono truncate">{timeStr}</span>
                  <span className="text-[9px] text-zinc-500 truncate">{item.params.lens.split(' ')[0]} {item.params.aperture}</span>
                </div>
              </div>

              {/* Individual Download Button (Hover) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadOne(item);
                }}
                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                title="Download Image"
              >
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPanel;