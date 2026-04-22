import React from 'react';
import { ProcessingStep } from '../types';

interface PipelineViewerProps {
  steps: ProcessingStep[];
}

const PipelineViewer: React.FC<PipelineViewerProps> = ({ steps }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Processing Pipeline</h3>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative pl-8">
              {/* Line connector */}
              {index !== steps.length - 1 && (
                <div 
                  className={`absolute left-[11px] top-6 w-0.5 h-full transition-colors duration-500 ${
                    step.status === 'complete' ? 'bg-blue-600' : 'bg-zinc-800'
                  }`} 
                />
              )}
              
              {/* Dot */}
              <div 
                className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  step.status === 'complete' 
                    ? 'bg-blue-600 border-blue-600' 
                    : step.status === 'active' 
                      ? 'border-blue-500 animate-pulse' 
                      : 'border-zinc-700 bg-zinc-900'
                }`}
              >
                 {step.status === 'complete' && (
                   <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                 )}
              </div>

              {/* Text */}
              <div>
                <p className={`text-sm font-medium transition-colors ${
                  step.status === 'pending' ? 'text-zinc-500' : 'text-zinc-200'
                }`}>
                  {step.label}
                </p>
                {step.status === 'active' && (
                   <p className="text-xs text-blue-400 mt-1 animate-pulse">Processing...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineViewer;
