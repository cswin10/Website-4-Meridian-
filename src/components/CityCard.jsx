import { useTime } from '../hooks/useTime';
import {
  getTimeInTimezone,
  getDateInTimezone,
  getOffsetFromLocal,
  getNumericOffsetFromLocal,
  isDaytime,
  isWorkHours,
} from '../utils/timezone';

export function CityCard({ city, offsetHours = 0, onRemove }) {
  useTime(); // Trigger re-render every second

  const time = getTimeInTimezone(city.timezone, offsetHours);
  const date = getDateInTimezone(city.timezone, offsetHours);
  const offset = getOffsetFromLocal(city.timezone);
  const numericOffset = getNumericOffsetFromLocal(city.timezone);
  const isDay = isDaytime(city.timezone, offsetHours);
  const inWorkHours = isWorkHours(city.timezone, offsetHours);

  // Split time into hours:minutes and seconds
  const [hm, seconds] = time.split(':').reduce(
    (acc, part, i) => {
      if (i < 2) {
        acc[0] = acc[0] ? `${acc[0]}:${part}` : part;
      } else {
        acc[1] = part;
      }
      return acc;
    },
    ['', '']
  );

  const offsetClass = numericOffset > 0 ? 'ahead' : numericOffset < 0 ? 'behind' : '';

  return (
    <div className={`city-card ${inWorkHours ? 'in-work-hours' : ''}`}>
      {onRemove && (
        <button
          className="city-remove"
          onClick={() => onRemove(city.id)}
          aria-label={`Remove ${city.name}`}
        >
          ×
        </button>
      )}

      <div className={`day-night-indicator ${isDay ? 'day' : 'night'}`}>
        {isDay ? '☀' : '☾'}
      </div>

      <div className="city-name">{city.name}</div>
      <div className="city-country">{city.country}</div>

      <div className="city-time">
        {hm}:<span className="seconds">{seconds}</span>
      </div>

      <div className="city-date">{date}</div>

      <div className="city-meta">
        <span className={`city-offset ${offsetClass}`}>
          {offset}
        </span>
        {inWorkHours && <span className="work-badge">Work Hours</span>}
      </div>
    </div>
  );
}
