import React, { useState, useRef, useCallback } from 'react';
import { VisualPattern } from './VisualPattern.js';

interface BeforeAfterSliderProps {
  beforeType: string;
  afterType: string;
  beforeLabel?: string;
  afterLabel?: string;
  title: string;
  subtitle: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeType,
  afterType,
  beforeLabel = 'Before: Plain / Damaged Wall',
  afterLabel = 'After: Ajanta Paneling & Louvers',
  title,
  subtitle,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-lg p-4 sm:p-6 text-stone-100">
      <div className="mb-4">
        <h4 className="font-serif-luxury text-xl sm:text-2xl text-amber-100">{title}</h4>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">{subtitle}</p>
      </div>

      {/* Slider Viewport */}
      <div
        ref={containerRef}
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[16/9] overflow-hidden rounded select-none cursor-ew-resize bg-stone-950"
      >
        {/* Full After Image */}
        <div className="absolute inset-0 w-full h-full">
          <VisualPattern type={afterType} aspect="full" />
          <div className="absolute bottom-3 right-3 bg-stone-900/80 text-amber-300 text-xs px-2.5 py-1 rounded backdrop-blur-xs font-medium">
            {afterLabel}
          </div>
        </div>

        {/* Clipped Before Image */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-0 w-full h-full min-w-[300px]">
            <VisualPattern type={beforeType} aspect="full" />
          </div>
          <div className="absolute bottom-3 left-3 bg-stone-900/80 text-stone-300 text-xs px-2.5 py-1 rounded backdrop-blur-xs font-medium">
            {beforeLabel}
          </div>
        </div>

        {/* Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
            ↔
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-400 mt-3">
        <span>Drag slider to compare transformation</span>
        <span className="text-amber-300 font-mono tabular-nums">{Math.round(sliderPosition)}% split</span>
      </div>
    </div>
  );
};
