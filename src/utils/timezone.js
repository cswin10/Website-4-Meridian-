/**
 * Get the current time in a specific timezone with optional hour offset
 * @param {string} timezone - IANA timezone string
 * @param {number} offsetHours - Hours to offset from current time
 * @returns {string} Formatted time string (HH:MM:SS)
 */
export function getTimeInTimezone(timezone, offsetHours = 0) {
  const now = new Date();
  now.setTime(now.getTime() + offsetHours * 60 * 60 * 1000);

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);
}

/**
 * Get the current date in a specific timezone with optional hour offset
 * @param {string} timezone - IANA timezone string
 * @param {number} offsetHours - Hours to offset from current time
 * @returns {string} Formatted date string
 */
export function getDateInTimezone(timezone, offsetHours = 0) {
  const now = new Date();
  now.setTime(now.getTime() + offsetHours * 60 * 60 * 1000);

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(now);
}

/**
 * Get the hour in a specific timezone
 * @param {string} timezone - IANA timezone string
 * @param {number} offsetHours - Hours to offset from current time
 * @returns {number} Hour (0-23)
 */
export function getHourInTimezone(timezone, offsetHours = 0) {
  const now = new Date();
  now.setTime(now.getTime() + offsetHours * 60 * 60 * 1000);

  const hourStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    hour12: false,
  }).format(now);

  return parseInt(hourStr, 10);
}

/**
 * Get offset from local time in hours
 * @param {string} timezone - IANA timezone string
 * @returns {string} Formatted offset string (+5h, -8h, Same time)
 */
export function getOffsetFromLocal(timezone) {
  const now = new Date();

  // Get local time string in target timezone
  const tzTimeStr = now.toLocaleString('en-US', { timeZone: timezone });
  const tzTime = new Date(tzTimeStr);

  // Get local time string in local timezone
  const localTimeStr = now.toLocaleString('en-US');
  const localTime = new Date(localTimeStr);

  // Calculate difference in hours
  const diffMs = tzTime.getTime() - localTime.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours === 0) return 'Same time';
  if (diffHours > 0) return `+${diffHours}h`;
  return `${diffHours}h`;
}

/**
 * Get numeric offset from local time in hours
 * @param {string} timezone - IANA timezone string
 * @returns {number} Offset in hours
 */
export function getNumericOffsetFromLocal(timezone) {
  const now = new Date();

  const tzTimeStr = now.toLocaleString('en-US', { timeZone: timezone });
  const tzTime = new Date(tzTimeStr);

  const localTimeStr = now.toLocaleString('en-US');
  const localTime = new Date(localTimeStr);

  const diffMs = tzTime.getTime() - localTime.getTime();
  return Math.round(diffMs / (1000 * 60 * 60));
}

/**
 * Check if it's daytime (6am - 6pm) in a timezone
 * @param {string} timezone - IANA timezone string
 * @param {number} offsetHours - Hours to offset from current time
 * @returns {boolean} True if daytime
 */
export function isDaytime(timezone, offsetHours = 0) {
  const hour = getHourInTimezone(timezone, offsetHours);
  return hour >= 6 && hour < 18;
}

/**
 * Check if within work hours (9am - 6pm) in a timezone
 * @param {string} timezone - IANA timezone string
 * @param {number} offsetHours - Hours to offset from current time
 * @returns {boolean} True if within work hours
 */
export function isWorkHours(timezone, offsetHours = 0) {
  const hour = getHourInTimezone(timezone, offsetHours);
  return hour >= 9 && hour < 18;
}

/**
 * Calculate how many cities are in work hours
 * @param {Array} cities - Array of city objects with timezone property
 * @param {number} offsetHours - Hours to offset from current time
 * @returns {number} Count of cities in work hours
 */
export function calculateOverlap(cities, offsetHours = 0) {
  return cities.filter(city => isWorkHours(city.timezone, offsetHours)).length;
}

/**
 * Find the best meeting time window
 * @param {Array} cities - Array of city objects with timezone property
 * @param {number} offsetHours - Current offset being viewed
 * @returns {Object} Object with overlap info
 */
export function findBestOverlap(cities, offsetHours = 0) {
  const citiesInWorkHours = cities.filter(city => isWorkHours(city.timezone, offsetHours));

  if (citiesInWorkHours.length < 2) {
    return {
      count: citiesInWorkHours.length,
      cities: citiesInWorkHours.map(c => c.name),
      window: null
    };
  }

  // Find the overlapping window
  let latestStart = 0;
  let earliestEnd = 24;

  citiesInWorkHours.forEach(city => {
    const hour = getHourInTimezone(city.timezone, offsetHours);
    // Work hours: 9am-6pm
    // Calculate how many hours until work starts/ends
    const startOffset = 9 - hour; // negative if past 9am
    const endOffset = 18 - hour; // hours until 6pm

    if (startOffset > latestStart) latestStart = startOffset;
    if (endOffset < earliestEnd) earliestEnd = endOffset;
  });

  return {
    count: citiesInWorkHours.length,
    cities: citiesInWorkHours.map(c => c.name),
    window: earliestEnd > latestStart ? { start: latestStart, end: earliestEnd } : null
  };
}

/**
 * Get local timezone name
 * @returns {string} Local timezone name
 */
export function getLocalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get local time formatted
 * @returns {string} Formatted local time
 */
export function getLocalTime() {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}
