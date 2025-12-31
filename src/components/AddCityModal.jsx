import { useState, useEffect, useRef } from 'react';
import { allCities } from '../data/cities';

export function AddCityModal({ isOpen, onClose, onAddCity, currentCityIds }) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCities = allCities.filter((city) => {
    const query = searchQuery.toLowerCase();
    return (
      city.name.toLowerCase().includes(query) ||
      city.country.toLowerCase().includes(query) ||
      city.timezone.toLowerCase().includes(query)
    );
  });

  const handleCityClick = (city) => {
    if (currentCityIds.includes(city.id)) return;
    onAddCity(city);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="city-modal-backdrop" onClick={handleBackdropClick}>
      <div className="city-modal">
        <div className="city-modal-header">
          <div className="city-modal-title-row">
            <h2 className="city-modal-title">Add City</h2>
            <button className="city-modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          <input
            ref={inputRef}
            type="text"
            className="city-search-input"
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="city-modal-list">
          {filteredCities.length === 0 ? (
            <div className="city-modal-empty">No cities found</div>
          ) : (
            filteredCities.map((city) => {
              const isAdded = currentCityIds.includes(city.id);
              return (
                <div
                  key={city.id}
                  className={`city-modal-item ${isAdded ? 'disabled' : ''}`}
                  onClick={() => handleCityClick(city)}
                >
                  <div className="city-modal-item-info">
                    <div className="city-modal-item-name">{city.name}</div>
                    <div className="city-modal-item-country">{city.country}</div>
                  </div>
                  <div className="city-modal-item-tz">
                    {isAdded ? 'Added' : city.timezone.split('/').pop().replace(/_/g, ' ')}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
