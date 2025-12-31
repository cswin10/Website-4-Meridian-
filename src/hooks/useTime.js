import { useState, useEffect } from 'react';

/**
 * Hook that provides a ticking time state, updated every second
 * @returns {Date} Current date object that updates every second
 */
export function useTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

/**
 * Hook that provides a ticking time state with offset
 * @param {number} offsetHours - Hours to offset from current time
 * @returns {Date} Current date object with offset that updates every second
 */
export function useTimeWithOffset(offsetHours = 0) {
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    now.setTime(now.getTime() + offsetHours * 60 * 60 * 1000);
    return now;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      now.setTime(now.getTime() + offsetHours * 60 * 60 * 1000);
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [offsetHours]);

  return currentTime;
}
