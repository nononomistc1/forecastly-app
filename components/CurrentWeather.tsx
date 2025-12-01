'use client';

import { WeatherData } from '@/types/weather';
import { convertTemp, getTempSymbol, convertWindSpeed, formatDate, formatTime } from '@/utils/weather';
import { getDarkModeClasses } from '@/utils/styles';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
  speedUnit: 'kmh' | 'mph';
  darkMode: boolean;
  onViewHourly?: () => void;
  hasHourlyData?: boolean;
}

export default function CurrentWeather({ weather, unit, speedUnit, darkMode, onViewHourly, hasHourlyData }: CurrentWeatherProps) {
  const styles = getDarkModeClasses(darkMode);
  const temp = convertTemp(weather.main.temp, unit);
  const feelsLike = convertTemp(weather.main.feels_like, unit);
  const tempSymbol = getTempSymbol(unit);
  const windSpeed = convertWindSpeed(weather.wind.speed, speedUnit);

  const bgClass = darkMode ? `${styles.bg} text-white` : `${styles.bg} text-gray-900`;
  const { textPrimary, textSecondary, textTertiary, bgCard } = styles;

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
        <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>
          {weather.name}, {weather.sys.country}
        </h2>
        <p className={`${textSecondary} text-sm`}>
          {formatDate(weather.dt)} • {formatTime(weather.dt, false)}
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
          <div className={`${bgCard} rounded-lg p-4 text-center`}>
            <div className={`text-sm mb-1 ${textSecondary}`}>Sunrise</div>
            <div className={`text-xl font-semibold ${textPrimary}`}>
              {formatTime(weather.sys.sunrise, true)}
            </div>
          </div>
          <div className={`${bgCard} rounded-lg p-4 text-center`}>
            <div className={`text-sm mb-1 ${textSecondary}`}>Sunset</div>
            <div className={`text-xl font-semibold ${textPrimary}`}>
              {formatTime(weather.sys.sunset, true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

