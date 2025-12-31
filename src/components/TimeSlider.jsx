import { useRef, useState, useEffect, useCallback } from 'react';
import { useTime } from '../hooks/useTime';
import { getSelectedTime, findBestOffset } from '../utils/timezone';

export function TimeSlider({ offset, onChange, cities }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Trigger re-render every second for live time display
  useTime();

  const updateOffset = useCallback((clientX) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = x / rect.width;

    // Map 0-100% to -12 to +12 hours
    const newOffset = Math.round((percent - 0.5) * 24);
    onChange(Math.max(-12, Math.min(12, newOffset)));
  }, [onChange]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateOffset(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    updateOffset(e.touches[0].clientX);
  };

  const handleDoubleClick = () => {
    onChange(0);
  };

  const handleFindBest = () => {
    if (cities && cities.length > 0) {
      const { offset: bestOffset } = findBestOffset(cities);
      onChange(bestOffset);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle if not in an input field
      if (e.target.tagName === 'INPUT') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onChange(Math.max(-12, offset - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onChange(Math.min(12, offset + 1));
      } else if (e.key === 'Escape' || e.key === '0') {
        onChange(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [offset, onChange]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      updateOffset(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      updateOffset(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updateOffset]);

  // Convert offset to position (0 = -12h, 50% = 0h, 100% = +12h)
  const handlePosition = ((offset + 12) / 24) * 100;

  // Get the actual selected time
  const selectedTime = getSelectedTime(offset);

  // Format offset display
  const offsetLabel = offset === 0
    ? 'now'
    : offset > 0
      ? `+${offset}h`
      : `${offset}h`;

  return (
    <div className="time-slider-wrapper" ref={containerRef}>
      <div className="time-slider-header">
        <div className="time-slider-left">
          <span className="time-slider-title">Meeting Time Finder</span>
          <span className="time-slider-hint">Use arrow keys or drag</span>
        </div>
        <div className="time-slider-right">
          <div className="time-slider-selected-time">
            <span className="selected-time-value">{selectedTime}</span>
            <span className="selected-time-label">{offsetLabel}</span>
          </div>
          {cities && cities.length > 1 && (
            <button className="time-slider-find-best" onClick={handleFindBest}>
              Find Best
            </button>
          )}
        </div>
      </div>

      <div
        ref={trackRef}
        className="time-slider-track"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleClick}
        tabIndex={0}
        role="slider"
        aria-valuenow={offset}
        aria-valuemin={-12}
        aria-valuemax={12}
        aria-label="Time offset in hours"
      >
        {/* Hour tick marks */}
        <div className="time-slider-ticks">
          {Array.from({ length: 25 }, (_, i) => i - 12).map((h) => (
            <div
              key={h}
              className={`time-slider-tick ${h === 0 ? 'zero' : ''} ${h % 3 === 0 ? 'major' : ''}`}
            />
          ))}
        </div>

        {/* Hour labels */}
        <div className="time-slider-labels">
          {[-12, -6, 0, 6, 12].map((h) => (
            <span key={h} className={`time-slider-label ${h === 0 ? 'zero' : ''}`}>
              {h === 0 ? 'NOW' : h > 0 ? `+${h}h` : `${h}h`}
            </span>
          ))}
        </div>

        {/* Now marker at center */}
        <div className="time-slider-now" style={{ left: '50%' }} />

        {/* Draggable handle */}
        <div
          className="time-slider-handle"
          style={{ left: `${handlePosition}%` }}
        />
      </div>

      {/* Reset button - outside track */}
      {offset !== 0 && (
        <button
          className="time-slider-reset"
          onClick={() => onChange(0)}
        >
          Reset to Now
        </button>
      )}
    </div>
  );
}
