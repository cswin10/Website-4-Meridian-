# Meridian

A visually stunning world clock dashboard that helps remote teams find overlapping work hours across time zones.

## Features

- **Live World Clocks**: Display multiple cities with real-time ticking clocks
- **Work Hours Highlighting**: Visual indicators for cities currently in work hours (9am-6pm)
- **Meeting Time Finder**: Interactive slider to find the perfect meeting time across all time zones
- **Overlap Indicator**: See how many cities have overlapping work hours at any given time
- **Add/Remove Cities**: Customize your dashboard with 20+ major world cities
- **Day/Night Indicator**: Visual sun/moon icons showing local day or night
- **Persistent Storage**: Your city selection is saved in localStorage
- **Responsive Design**: Works beautifully on desktop and mobile

## Design

Meridian features a NASA mission control meets luxury watch brand aesthetic:
- Dark atmospheric background with animated gradient orbs
- Electric cyan accent colors with glowing effects
- Orbitron font for time displays
- JetBrains Mono for technical data
- Outfit font for UI elements

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- React 19
- Vite
- Vanilla CSS with CSS Custom Properties

## Project Structure

```
src/
  App.jsx              # Main application component
  main.jsx             # Entry point
  components/
    Header.jsx         # Logo and local time display
    CityCard.jsx       # Individual city time card
    TimeSlider.jsx     # Meeting time finder slider
    AddCityModal.jsx   # Modal for adding new cities
    AddCityButton.jsx  # Add city button
    OverlapIndicator.jsx # Work hours overlap display
  hooks/
    useTime.js         # Real-time clock hook
    useCities.js       # City management with localStorage
  utils/
    timezone.js        # Timezone calculation utilities
  data/
    cities.js          # City data with timezones
  styles/
    global.css         # All styles
```
