import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);

  // Handle global mouse up to stop dragging even if mouse leaves component
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
        if(isDragging) {
             if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const position = ((e.clientX - rect.left) / rect.width) * 100;
            setSliderPosition(Math.min(Math.max(position, 0), 100));
        }
    }

    if(isDragging) {
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);


  return (
    <div 
      className="relative w-full h-full select-none overflow-hidden bg-zinc-950"
      ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchMove={handleDrag}
      aria-label="元画像と生成結果の比較スライダー"
    >
      {/* Background Image (After) */}
      <img
        src={afterImage}
        alt="生成結果"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Foreground Image (Before) - Clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="元画像"
          className="absolute w-full h-full object-contain pointer-events-none"
          // Crucial: Use max-w-none and specific sizing to match the parent exactly despite clipping
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', maxWidth: 'none', height: '100%' }}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-zinc-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white font-bold tracking-wider pointer-events-none">
        元画像
      </div>
      <div className="absolute top-4 right-4 bg-blue-600/50 backdrop-blur px-2 py-1 rounded text-xs text-white font-bold tracking-wider pointer-events-none">
        生成結果
      </div>
    </div>
  );
};

export default ComparisonSlider;
