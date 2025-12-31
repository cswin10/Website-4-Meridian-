import { isWorkHours } from '../utils/timezone';

export function OverlapIndicator({ cities, offsetHours }) {
  const citiesInWorkHours = cities.filter(city =>
    isWorkHours(city.timezone, offsetHours)
  );

  const count = citiesInWorkHours.length;
  const totalCities = cities.length;

  // Determine indicator state
  let stateClass = '';
  if (count === 0) {
    stateClass = 'none';
  } else if (count < 3) {
    stateClass = 'low';
  }

  // Build the label
  let label = '';
  if (count === 0) {
    label = 'No cities in work hours';
  } else if (count === 1) {
    label = '1 city in work hours';
  } else if (count === totalCities) {
    label = 'All cities in work hours!';
  } else {
    label = `${count} cities in work hours`;
  }

  // List the cities
  const cityNames = citiesInWorkHours.map(c => c.name).join(', ');

  return (
    <div className={`overlap-indicator ${stateClass}`}>
      <div className="overlap-count">{count}</div>
      <div className="overlap-info">
        <div className="overlap-label">{label}</div>
        {count > 0 && (
          <div className="overlap-cities">{cityNames}</div>
        )}
      </div>
    </div>
  );
}
