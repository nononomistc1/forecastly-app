'use client';

import { WeatherData } from '@/types/weather';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
  speedUnit: 'kmh' | 'mph';
  darkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onViewHourly?: () => void;
  hasHourlyData?: boolean;
  aqi?: number | null;
  uvIndex?: number | null;
}

export default function CurrentWeather({ weather, unit, speedUnit, darkMode, isFavorite, onToggleFavorite, onViewHourly, hasHourlyData, aqi, uvIndex }: CurrentWeatherProps) {
  const convertTemp = (temp: number): number => {
    return unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSunTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getAqiLabel = (aqi: number | null | undefined): string => {
    if (!aqi) return 'Unknown';
    const labels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return labels[aqi - 1] || 'Unknown';
  };

  const getAqiColor = (aqi: number | null | undefined): string => {
    if (!aqi) return 'text-gray-500';
    const colors = ['text-green-500', 'text-yellow-500', 'text-orange-500', 'text-red-500', 'text-purple-500'];
    return colors[aqi - 1] || 'text-gray-500';
  };

  const getUvLabel = (uv: number | null | undefined): string => {
    if (!uv) return 'Unknown';
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  const getUvColor = (uv: number | null | undefined): string => {
    if (!uv) return 'text-gray-500';
    if (uv <= 2) return 'text-green-500';
    if (uv <= 5) return 'text-yellow-500';
    if (uv <= 7) return 'text-orange-500';
    if (uv <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  const temp = convertTemp(weather.main.temp);
  const feelsLike = convertTemp(weather.main.feels_like);
  const tempSymbol = unit === 'fahrenheit' ? '°F' : '°C';
  const windSpeed = speedUnit === 'mph' 
    ? (weather.wind.speed * 2.237).toFixed(1) + ' mph'
    : (weather.wind.speed * 3.6).toFixed(1) + ' km/h';

  const bgClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textTertiary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const bgCard = darkMode ? 'bg-gray-700' : 'bg-gray-50';

  return (
    <div className={`${bgClass} rounded-xl shadow-lg p-6 mb-8`}>
      <div className="text-center mb-6 relative">
        {hasHourlyData && onViewHourly && (
          <button
            onClick={onViewHourly}
            className={`absolute top-0 left-0 px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            aria-label="View hourly forecast"
          >
            Hourly
          </button>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          style={{ touchAction: 'manipulation' }}
          className={`absolute top-0 right-0 p-3 min-w-[44px] min-h-[44px] rounded-lg transition-colors z-10 ${
            darkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          type="button"
        >
          <span className={`text-3xl ${isFavorite ? 'text-yellow-500' : textSecondary}`}>
            {isFavorite ? '★' : '☆'}
          </span>
        </button>
        <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>
          {weather.name}, {weather.sys.country}
        </h2>
        <p className={`${textSecondary} text-sm`}>
          {formatDate(weather.dt)} • {formatTime(weather.dt)}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex-shrink-0">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="flex-shrink-0">
            <div className={`text-5xl font-bold ${textPrimary} whitespace-nowrap`}>
              {Math.round(temp)}{tempSymbol}
            </div>
            <div className={`text-lg capitalize ${textSecondary}`}>
              {weather.weather[0].description}
            </div>
            <div className={`text-sm ${textTertiary} whitespace-nowrap`}>
              Feels like {Math.round(feelsLike)}{tempSymbol}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 w-full">
          <div className={`${bgCard} rounded-lg p-4 text-center`}>
            <div className={`text-sm mb-1 ${textSecondary}`}>Humidity</div>
            <div className={`text-2xl font-semibold ${textPrimary}`}>
              {weather.main.humidity}%
            </div>
          </div>
          <div className={`${bgCard} rounded-lg p-4 text-center`}>
            <div className={`text-sm mb-1 ${textSecondary}`}>Wind Speed</div>
            <div className={`text-2xl font-semibold ${textPrimary}`}>
              {windSpeed}
            </div>
          </div>
          {aqi !== null && aqi !== undefined && (
            <div className={`${bgCard} rounded-lg p-4 text-center`}>
              <div className={`text-sm mb-1 ${textSecondary}`}>Air Quality</div>
              <div className={`text-2xl font-semibold ${getAqiColor(aqi)}`}>
                {getAqiLabel(aqi)}
              </div>
              <div className={`text-xs mt-1 ${textSecondary}`}>AQI: {aqi}</div>
            </div>
          )}
          {uvIndex !== null && uvIndex !== undefined && (
            <div className={`${bgCard} rounded-lg p-4 text-center`}>
              <div className={`text-sm mb-1 ${textSecondary}`}>UV Index</div>
              <div className={`text-2xl font-semibold ${getUvColor(uvIndex)}`}>
                {uvIndex.toFixed(1)}
              </div>
              <div className={`text-xs mt-1 ${textSecondary}`}>{getUvLabel(uvIndex)}</div>
            </div>
          )}
          <div className={`${bgCard} rounded-lg p-4 text-center`}>
            <div className={`text-sm mb-1 ${textSecondary}`}>Sunrise</div>
            <div className={`text-xl font-semibold ${textPrimary}`}>
              {formatSunTime(weather.sys.sunrise)}
            </div>
          </div>
          <div className={`${bgCard} rounded-lg p-4 text-center`}>
            <div className={`text-sm mb-1 ${textSecondary}`}>Sunset</div>
            <div className={`text-xl font-semibold ${textPrimary}`}>
              {formatSunTime(weather.sys.sunset)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

