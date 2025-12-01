'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import CurrentWeather from '@/components/CurrentWeather';
import Forecast from '@/components/Forecast';
import DayDetailModal from '@/components/DayDetailModal';
import SettingsMenu from '@/components/SettingsMenu';
import { WeatherData, ForecastData, DailyForecast, ForecastItem } from '@/types/weather';
import { calculateDailyAverages } from '@/utils/weather';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [todayForecast, setTodayForecast] = useState<DailyForecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [speedUnit, setSpeedUnit] = useState<'kmh' | 'mph'>('kmh');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState<boolean>(false);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true';
      setDarkMode(isDark);
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const processForecastData = (data: ForecastData): DailyForecast[] => {
    const dailyData: { [key: string]: ForecastItem[] } = {};
    
    // Get today's date in the same format
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    // Group forecast items by date
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    // Filter out today, sort dates chronologically, and get the next 5 future days.
    const futureDates = Object.keys(dailyData)
      .filter(date => date !== today)
      .sort((a, b) => {
        // Convert date strings to Date objects for proper sorting
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
    
    return futureDates.map((date, index) => {
      const dayData = dailyData[date];
      const averages = calculateDailyAverages(dayData);
      
      // Use the middle item of the day for icon/description
      const midIndex = Math.floor(dayData.length / 2);
      const midItem = dayData[midIndex];
      
      const dateObj = new Date(midItem.dt * 1000);
      // First day (index 0) should be "Tomorrow", others use the day name
      const dayOfWeek = index === 0 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      
      return {
        date: dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        dayOfWeek,
        high: averages.high,
        low: averages.low,
        icon: midItem.weather[0].icon,
        description: midItem.weather[0].description,
        humidity: averages.humidity,
        windSpeed: averages.windSpeed,
        pressure: averages.pressure,
        cloudiness: averages.cloudiness,
        items: dayData,
      };
    });
  };

  const handleSearch = useCallback(async (city: string, lat?: number, lon?: number) => {
    if (!API_KEY) {
      setError('API key is not configured. Please add NEXT_PUBLIC_WEATHER_API_KEY to your .env.local file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use coordinates if provided (from autocomplete selection), otherwise use city name
      const weatherUrl = lat !== undefined && lon !== undefined
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        }
        throw new Error('Failed to fetch weather data. Please try again later.');
      }

      const weatherData: WeatherData = await weatherResponse.json();

      // Fetch 5-day forecast using coordinates if available
      const forecastUrl = lat !== undefined && lon !== undefined
        ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        : `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

      const forecastResponse = await fetch(forecastUrl);

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data.');
      }

      const forecastData: ForecastData = await forecastResponse.json();
      const processedForecast = processForecastData(forecastData);

      // Create today's forecast for hourly view
      const now = new Date();
      const today = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      
      // Get all items for today (including current and future hours)
      // The API returns 3-hour intervals, so we'll show all remaining intervals for today
      const todayItems = forecastData.list.filter((item) => {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        // Include items from today (can include current hour or slightly past)
        // Subtract 2 hours to include items that are close to now
        const twoHoursAgo = now.getTime() - (2 * 60 * 60 * 1000);
        return itemDateString === today && itemDate.getTime() >= twoHoursAgo;
      });

      if (todayItems.length > 0) {
        const averages = calculateDailyAverages(todayItems);
        const midIndex = Math.floor(todayItems.length / 2);
        const midItem = todayItems[midIndex];
        const dateObj = new Date(midItem.dt * 1000);
        
        const todayForecastData: DailyForecast = {
          date: dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          dayOfWeek: 'Today',
          high: averages.high,
          low: averages.low,
          icon: midItem.weather[0].icon,
          description: midItem.weather[0].description,
          humidity: averages.humidity,
          windSpeed: averages.windSpeed,
          pressure: averages.pressure,
          cloudiness: averages.cloudiness,
          items: todayItems,
        };
        
        setTodayForecast(todayForecastData);
      } else {
        setTodayForecast(null);
      }

      setWeather(weatherData);
      setForecast(processedForecast);
      
      // Save to localStorage
      localStorage.setItem('lastSearchedCity', city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setWeather(null);
      setForecast([]);
      setTodayForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY]);

  // Load last searched city from localStorage on mount
  useEffect(() => {
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity && API_KEY) {
      handleSearch(lastCity);
    }
  }, [API_KEY, handleSearch]);

  const handleDayClick = (day: DailyForecast) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleTodayClick = () => {
    if (todayForecast) {
      setSelectedDay(todayForecast);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  const bgClass = darkMode ? 'bg-gray-900' : '';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <main className={`min-h-screen py-8 px-4 transition-colors ${bgClass}`}>
      <SettingsMenu
        unit={unit}
        speedUnit={speedUnit}
        darkMode={darkMode}
        onUnitChange={setUnit}
        onSpeedUnitChange={setSpeedUnit}
        onDarkModeChange={setDarkMode}
        isExpanded={isSettingsExpanded}
        onToggleExpand={() => setIsSettingsExpanded(!isSettingsExpanded)}
      />
      <div className={`max-w-6xl mx-auto ${isSettingsExpanded ? 'lg:mr-64' : ''} transition-all duration-300`}>
        <div className="text-center mb-8">
          <h1 className={`text-5xl font-bold mb-2 ${textPrimary}`}>Forecastly</h1>
          <p className={textSecondary}>Search for any city to see current weather and 5-day forecast</p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} darkMode={darkMode} />

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className={`${darkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg mb-6 max-w-md mx-auto`}>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {weather && !isLoading && (
          <>
            <CurrentWeather
              weather={weather}
              unit={unit}
              speedUnit={speedUnit}
              darkMode={darkMode}
              onViewHourly={handleTodayClick}
              hasHourlyData={todayForecast !== null}
            />
            {forecast.length > 0 && (
              <Forecast
                forecast={forecast}
                unit={unit}
                onDayClick={handleDayClick}
                darkMode={darkMode}
              />
            )}
          </>
        )}

        {!weather && !isLoading && !error && (
          <div className={`text-center py-12 ${textSecondary}`}>
            <p className="text-lg">Enter a city name above to get started!</p>
          </div>
        )}
      </div>

      <DayDetailModal
        day={selectedDay}
        unit={unit}
        speedUnit={speedUnit}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        darkMode={darkMode}
      />
    </main>
  );
}

