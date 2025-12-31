import { useTime } from '../hooks/useTime';
import { getLocalTime, getLocalTimezone } from '../utils/timezone';

export function Header() {
  useTime(); // Trigger re-render every second

  const localTime = getLocalTime();
  const localTimezone = getLocalTimezone();

  return (
    <header className="header">
      <div className="logo">
        <span>M</span>eridian
      </div>
      <div className="header-right">
        <div className="header-time">
          <strong>{localTime}</strong>
        </div>
        <div className="header-timezone">
          {localTimezone}
        </div>
      </div>
    </header>
  );
}
