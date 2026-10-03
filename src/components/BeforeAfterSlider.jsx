import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original Object",
  afterLabel = "New Identity",
  beforeSub = "",
  afterSub = "",
  aspectRatio = "aspect-[4/3]"
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-charcoal-border bg-charcoal-deep shadow-card group select-none">
      
      {/* Container with specified aspect ratio */}
      <div className={`relative w-full ${aspectRatio} overflow-hidden`}>
        
        {/* AFTER IMAGE (Base layer) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* AFTER BADGE */}
        <div className="absolute top-3 right-3 z-10 bg-accent text-white px-2.5 py-1 rounded text-xs font-medium shadow-subtle flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{afterLabel}</span>
        </div>

        {/* BEFORE IMAGE (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', minWidth: '100%', height: '100%' }}
          />
          {/* BEFORE BADGE */}
          <div className="absolute top-3 left-3 z-10 bg-charcoal/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-medium shadow-subtle">
            {beforeLabel}
          </div>
        </div>

        {/* VERTICAL DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-charcoal border border-charcoal-border shadow-md flex items-center justify-center">
            <ArrowLeftRight className="w-3.5 h-3.5 text-charcoal-deep" />
          </div>
        </div>

        {/* INVISIBLE RANGE INPUT OVERLAY */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          aria-label="Before and after transformation slider"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0"
        />

      </div>

      {/* FOOTER CAPTION */}
      {(beforeSub || afterSub) && (
        <div className="bg-background-surface px-4 py-2.5 border-t border-charcoal-border flex items-center justify-between text-xs text-charcoal-muted">
          <span className="font-medium text-charcoal truncate max-w-[48%]">
            {beforeSub}
          </span>
          <span className="text-accent font-medium truncate max-w-[48%] text-right flex items-center gap-1 justify-end">
            <CheckCircle2 className="w-3.5 h-3.5 inline text-accent" />
            {afterSub}
          </span>
        </div>
      )}

      {/* QUICK TOGGLE BUTTONS */}
      <div className="bg-background-warm px-3 py-1.5 flex items-center justify-center gap-2 border-t border-charcoal-borderLight">
        <button
          type="button"
          onClick={() => setSliderPosition(100)}
          className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
            sliderPosition > 80 ? 'bg-charcoal text-white' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Show Original
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(50)}
          className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
            sliderPosition >= 40 && sliderPosition <= 60 ? 'bg-charcoal text-white' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          50 / 50 Split
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(0)}
          className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
            sliderPosition < 20 ? 'bg-accent text-white' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Show New Identity
        </button>
      </div>

    </div>
  );
}
