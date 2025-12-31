import { useState, useEffect } from 'react';
import { defaultCities } from '../data/cities';

const STORAGE_KEY = 'meridian-cities';

/**
 * Hook that manages city selection with localStorage persistence
 * @returns {Object} Object with cities array and management functions
 */
export function useCities() {
  const [cities, setCities] = useState(() => {
    // Try to load from localStorage on initial render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load cities from localStorage:', e);
    }
    return defaultCities;
  });

  // Persist to localStorage whenever cities change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    } catch (e) {
      console.warn('Failed to save cities to localStorage:', e);
    }
  }, [cities]);

  const addCity = (city) => {
    setCities(prev => {
      // Check if city already exists
      if (prev.some(c => c.id === city.id)) {
        return prev;
      }
      return [...prev, city];
    });
  };

  const removeCity = (cityId) => {
    setCities(prev => prev.filter(c => c.id !== cityId));
  };

  const resetToDefault = () => {
    setCities(defaultCities);
  };

  return {
    cities,
    addCity,
    removeCity,
    resetToDefault
  };
}
