import { useState } from 'react';
import { Header } from './components/Header';
import { CityCard } from './components/CityCard';
import { AddCityButton } from './components/AddCityButton';
import { AddCityModal } from './components/AddCityModal';
import { TimeSlider } from './components/TimeSlider';
import { OverlapIndicator } from './components/OverlapIndicator';
import { useCities } from './hooks/useCities';

function App() {
  const { cities, addCity, removeCity } = useCities();
  const [sliderOffset, setSliderOffset] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const currentCityIds = cities.map(c => c.id);

  return (
    <>
      {/* Atmospheric Background */}
      <div className="atmosphere" />
      <div className="grid-overlay" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="main">
        <div className="cities-grid">
          {cities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              offsetHours={sliderOffset}
              onRemove={cities.length > 1 ? removeCity : undefined}
            />
          ))}
          <AddCityButton onClick={() => setShowAddModal(true)} />
        </div>
      </main>

      {/* Time Slider */}
      <div className="time-slider-container">
        <TimeSlider offset={sliderOffset} onChange={setSliderOffset} cities={cities} />
        <OverlapIndicator cities={cities} offsetHours={sliderOffset} />
      </div>

      {/* Add City Modal */}
      <AddCityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddCity={addCity}
        currentCityIds={currentCityIds}
      />
    </>
  );
}

export default App;
