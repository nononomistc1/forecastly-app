'use client';

import { DailyForecast } from '@/types/weather';
import { convertTemp, getTempSymbol, convertWindSpeed, formatTime } from '@/utils/weather';
import { getDarkModeClasses } from '@/utils/styles';

interface DayDetailModalProps {
  day: DailyForecast | null;
  unit: 'celsius' | 'fahrenheit';
  speedUnit: 'kmh' | 'mph';
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export default function DayDetailModal({ day, unit, speedUnit, isOpen, onClose, darkMode }: DayDetailModalProps) {
  if (!isOpen || !day) return null;

  const styles = getDarkModeClasses(darkMode);
  const tempSymbol = getTempSymbol(unit);
  const windSpeed = convertWindSpeed(day.windSpeed, speedUnit);

  const bgClass = darkMode ? `${styles.bg} text-white` : `${styles.bg} text-gray-900`;
  const { border: borderClass, textSecondary, bgCard } = styles;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={`${bgClass} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${borderClass} border-2`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-600 bg-inherit">
          <h2 className="text-2xl font-bold">{day.dayOfWeek}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${textSecondary} text-2xl font-bold`}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="w-32 h-32 mx-auto"
              />
            </div>
            <div className="text-3xl font-bold mb-2">
              {Math.round(convertTemp(day.high, unit))}{tempSymbol} / {Math.round(convertTemp(day.low, unit))}{tempSymbol}
            </div>
            <div className={`text-lg capitalize ${textSecondary}`}>
              {day.description}
            </div>
            <div className={`text-sm mt-2 ${textSecondary}`}>
              {day.date}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${bgCard} rounded-lg p-4`}>
              <div className={`text-sm ${textSecondary} mb-1`}>Humidity</div>
              <div className="text-2xl font-semibold">{day.humidity}%</div>
            </div>
            <div className={`${bgCard} rounded-lg p-4`}>
              <div className={`text-sm ${textSecondary} mb-1`}>Wind Speed</div>
              <div className="text-2xl font-semibold">{windSpeed}</div>
            </div>
            <div className={`${bgCard} rounded-lg p-4`}>
              <div className={`text-sm ${textSecondary} mb-1`}>Pressure</div>
              <div className="text-2xl font-semibold">{day.pressure} hPa</div>
            </div>
            <div className={`${bgCard} rounded-lg p-4`}>
              <div className={`text-sm ${textSecondary} mb-1`}>Cloudiness</div>
              <div className="text-2xl font-semibold">{day.cloudiness}%</div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Hourly Forecast</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {day.items.length > 0 ? (
                day.items.map((item, index) => (
                  <div
                    key={`${item.dt}-${index}`}
                    className={`${bgCard} rounded-lg p-3 flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium w-16">{formatTime(item.dt, false)}</span>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                        className="w-10 h-10"
                      />
                      <span className={`capitalize ${textSecondary}`}>
                        {item.weather[0].description}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {Math.round(convertTemp(item.main.temp, unit))}{tempSymbol}
                      </div>
                      <div className={`text-xs ${textSecondary}`}>
                        Feels like {Math.round(convertTemp(item.main.feels_like, unit))}{tempSymbol}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`${bgCard} rounded-lg p-4 text-center ${textSecondary}`}>
                  No hourly forecast available for this day
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

