import { useRef, useState, useEffect, useCallback } from 'react';

export function TimeSlider({ offset, onChange }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Format offset display
  const offsetDisplay = offset === 0
    ? 'Current time'
    : offset > 0
      ? `+${offset} hours`
      : `${offset} hours`;

  // Hour markers (-12 to +12)
  const hours = [];
  for (let i = -12; i <= 12; i += 3) {
    hours.push(i);
  }

  return (
    <div className="time-slider-wrapper">
      <div className="time-slider-header">
        <span className="time-slider-title">Meeting Time Finder</span>
        <span className={`time-slider-offset ${offset < 0 ? 'past' : ''}`}>
          {offsetDisplay}
        </span>
      </div>

      <div
        ref={trackRef}
        className="time-slider-track"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Hour markers */}
        <div className="time-slider-hours">
          {hours.map((h, i) => (
            <div key={h} className="time-slider-hour">
              {h === 0 ? '0' : h > 0 ? `+${h}` : h}
            </div>
          ))}
        </div>

        {/* Now marker at center */}
        <div className="time-slider-now" style={{ left: '50%' }} />

        {/* Draggable handle */}
        <div
          className="time-slider-handle"
          style={{ left: `${handlePosition}%` }}
        />

        {/* Reset button */}
        {offset !== 0 && (
          <button
            className="time-slider-reset"
            onClick={(e) => {
              e.stopPropagation();
              onChange(0);
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
