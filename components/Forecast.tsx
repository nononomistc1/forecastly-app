'use client';

import { DailyForecast } from '@/types/weather';

interface ForecastProps {
  forecast: DailyForecast[];
  unit: 'celsius' | 'fahrenheit';
  onDayClick: (day: DailyForecast) => void;
  darkMode: boolean;
}

export default function Forecast({ forecast, unit, onDayClick, darkMode }: ForecastProps) {
  const convertTemp = (temp: number): number => {
    return unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;
  };

  const tempSymbol = unit === 'fahrenheit' ? '°F' : '°C';

  const bgClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const hoverClass = darkMode ? 'hover:shadow-xl hover:bg-gray-700' : 'hover:shadow-lg hover:bg-gray-50';

  return (
    <div className="mb-8">
      <h3 className={`text-2xl font-bold mb-4 ${textPrimary}`}>5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <button
            key={index}
            onClick={() => onDayClick(day)}
            className={`${bgClass} rounded-lg shadow-md p-4 text-center transition-all cursor-pointer ${hoverClass}`}
          >
            <div className={`text-lg font-semibold mb-2 ${textPrimary}`}>
              {day.dayOfWeek}
            </div>
            <div className={`text-sm mb-3 ${textSecondary}`}>{day.date}</div>
            <div className="mb-3">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="w-16 h-16 mx-auto"
              />
            </div>
            <div className={`text-sm capitalize mb-2 ${textSecondary}`}>
              {day.description}
            </div>
            <div className="space-y-1">
              <div className="flex justify-center items-center gap-2 text-sm">
                <span className={`text-xs ${textSecondary}`}>High:</span>
                <span className={`font-semibold ${textPrimary}`}>
                  {Math.round(convertTemp(day.high))}{tempSymbol}
                </span>
              </div>
              <div className="flex justify-center items-center gap-2 text-sm">
                <span className={`text-xs ${textSecondary}`}>Low:</span>
                <span className={textSecondary}>
                  {Math.round(convertTemp(day.low))}{tempSymbol}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

