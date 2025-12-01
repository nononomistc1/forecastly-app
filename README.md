# Forecastly

A modern weather forecast application built with Next.js, TypeScript, and Tailwind CSS.

## Credits

- **Email**: judebaker99@gmail.com
- **Phone**: +39 327 045 7198

## Features

- 🔍 Search for any city worldwide
- 🌡️ View current weather conditions (temperature, humidity, wind speed)
- 📅 5-day weather forecast
- 🎨 Beautiful weather icons
- 🌡️ Toggle between Celsius and Fahrenheit
- 💾 Remembers your last searched city
- ⏳ Loading states and error handling
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenWeatherMap API key (free tier available at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
weatherapp-2/
├── app/
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── SearchBar.tsx     # Search input component
│   ├── CurrentWeather.tsx # Current weather display
│   └── Forecast.tsx      # 5-day forecast component
├── types/
│   └── weather.ts        # TypeScript type definitions
└── .env.local           # API key (not committed to git)
```

## API Setup

1. Sign up for a free account at [openweathermap.org](https://openweathermap.org)
2. Generate an API key from your dashboard
3. Add it to your `.env.local` file as `NEXT_PUBLIC_WEATHER_API_KEY`

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenWeatherMap API** - Weather data

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)

