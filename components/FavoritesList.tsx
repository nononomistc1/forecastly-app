'use client';

import { useState, useEffect } from 'react';
import { FavoriteCity, WeatherData } from '@/types/weather';

interface FavoritesListProps {
  favorites: FavoriteCity[];
  onSelectCity: (city: FavoriteCity) => void;
  onRemoveFavorite: (id: string) => void;
  darkMode: boolean;
  unit: 'celsius' | 'fahrenheit';
  API_KEY: string | undefined;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface FavoriteWeather {
  cityId: string;
  weather: WeatherData | null;
  isLoading: boolean;
}

export default function FavoritesList({ favorites, onSelectCity, onRemoveFavorite, darkMode, unit, API_KEY, isExpanded, onToggleExpand }: FavoritesListProps) {
  const [favoriteWeathers, setFavoriteWeathers] = useState<FavoriteWeather[]>([]);

  useEffect(() => {
    if (!API_KEY || favorites.length === 0) {
      setFavoriteWeathers([]);
      return;
    }

    // Initialize with loading state
    setFavoriteWeathers(favorites.map(city => ({
      cityId: city.id,
      weather: null,
      isLoading: true,
    })));

    // Fetch weather for each favorite
    const fetchWeathers = async () => {
      const weatherPromises = favorites.map(async (city) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
          );
          if (response.ok) {
            const data: WeatherData = await response.json();
            return { cityId: city.id, weather: data, isLoading: false };
          }
          return { cityId: city.id, weather: null, isLoading: false };
        } catch (error) {
          return { cityId: city.id, weather: null, isLoading: false };
        }
      });

      const results = await Promise.all(weatherPromises);
      setFavoriteWeathers(results);
    };

    fetchWeathers();
  }, [favorites, API_KEY]);

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const hoverClass = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const convertTemp = (temp: number): number => {
    return unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;
  };

  const tempSymbol = unit === 'fahrenheit' ? '°F' : '°C';

  if (favorites.length === 0) {
    return (
      <button
        onClick={onToggleExpand}
        className={`fixed left-0 top-4 z-50 p-3 ${bgClass} border-r border-b ${borderClass} rounded-r-lg shadow-lg ${hoverClass} transition-all`}
        aria-label="Toggle favorites"
      >
        <span className={`text-xl ${textPrimary}`}>★</span>
      </button>
    );
  }

  return (
    <>
      <div className={`fixed left-0 top-0 h-full ${isExpanded ? 'w-64' : 'w-0'} ${bgClass} border-r ${borderClass} shadow-lg overflow-hidden z-40 hidden lg:block transition-all duration-300`}>
        <div className={`p-4 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className={`flex items-center justify-between mb-4 sticky top-4 bg-inherit pb-2 border-b ${borderClass}`}>
            <h3 className={`text-xl font-bold ${textPrimary}`}>
              Favorites
            </h3>
            <button
              onClick={onToggleExpand}
              className={`p-1 rounded ${hoverClass} transition-colors`}
              aria-label="Collapse favorites"
            >
              <span className={`text-lg ${textPrimary}`}>←</span>
            </button>
          </div>
          <div className="space-y-2">
            {favorites.map((city) => {
              const cityWeather = favoriteWeathers.find(fw => fw.cityId === city.id);
              const weather = cityWeather?.weather;
              const isLoading = cityWeather?.isLoading ?? false;

              return (
                <div
                  key={city.id}
                  className={`p-3 rounded-lg border ${borderClass} ${hoverClass} transition-colors cursor-pointer`}
                  onClick={() => onSelectCity(city)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm truncate ${textPrimary}`}>{city.name}</div>
                      <div className={`text-xs truncate ${textSecondary}`}>
                        {city.state ? `${city.state}, ` : ''}
                        {city.country}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(city.id);
                      }}
                      className={`ml-2 p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-red-50'} transition-colors flex-shrink-0`}
                      aria-label="Remove from favorites"
                    >
                      <span className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>×</span>
                    </button>
                  </div>
                  {isLoading ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className={`text-xs ${textSecondary}`}>Loading...</span>
                    </div>
                  ) : weather ? (
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                        alt={weather.weather[0].description}
                        className="w-8 h-8"
                      />
                      <span className={`text-sm font-semibold ${textPrimary}`}>
                        {Math.round(convertTemp(weather.main.temp))}{tempSymbol}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {!isExpanded && (
        <button
          onClick={onToggleExpand}
          className={`fixed left-0 top-4 z-50 p-3 ${bgClass} border-r border-b ${borderClass} rounded-r-lg shadow-lg ${hoverClass} transition-all hidden lg:block`}
          aria-label="Expand favorites"
        >
          <span className={`text-xl ${textPrimary}`}>★</span>
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>
      )}
    </>
  );
}

