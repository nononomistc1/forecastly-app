'use client';

import { WeatherData } from '@/types/weather';

interface SettingsMenuProps {
  unit: 'celsius' | 'fahrenheit';
  speedUnit: 'kmh' | 'mph';
  darkMode: boolean;
  onUnitChange: (unit: 'celsius' | 'fahrenheit') => void;
  onSpeedUnitChange: (speedUnit: 'kmh' | 'mph') => void;
  onDarkModeChange: (darkMode: boolean) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  weather?: WeatherData | null;
}

export default function SettingsMenu({
  unit,
  speedUnit,
  darkMode,
  onUnitChange,
  onSpeedUnitChange,
  onDarkModeChange,
  isExpanded,
  onToggleExpand,
  isFavorite = false,
  onToggleFavorite,
  weather,
}: SettingsMenuProps) {
  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const hoverClass = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const buttonClass = darkMode
    ? 'w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all font-medium text-left'
    : 'w-full px-4 py-2 bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-100 transition-all font-medium text-left';
  const selectedButtonClass = 'w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-left';

  const renderSettingsContent = () => (
    <>
      <div className={`flex items-center justify-between mb-6 sticky top-4 bg-inherit pb-2 border-b ${borderClass}`}>
        <h3 className={`text-xl font-bold ${textPrimary}`}>
          Settings
        </h3>
        <button
          onClick={onToggleExpand}
          className={`p-1 rounded ${hoverClass} transition-colors`}
          aria-label="Collapse settings"
        >
          <span className={`text-lg ${textPrimary}`}>×</span>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>
            Temperature Unit
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onUnitChange('celsius')}
              className={unit === 'celsius' ? selectedButtonClass : buttonClass}
            >
              °C (Celsius)
            </button>
            <button
              onClick={() => onUnitChange('fahrenheit')}
              className={unit === 'fahrenheit' ? selectedButtonClass : buttonClass}
            >
              °F (Fahrenheit)
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>
            Wind Speed Unit
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onSpeedUnitChange('kmh')}
              className={speedUnit === 'kmh' ? selectedButtonClass : buttonClass}
            >
              km/h
            </button>
            <button
              onClick={() => onSpeedUnitChange('mph')}
              className={speedUnit === 'mph' ? selectedButtonClass : buttonClass}
            >
              mph
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>
            Theme
          </label>
          <button
            onClick={() => onDarkModeChange(!darkMode)}
            className={darkMode ? selectedButtonClass : 'w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-medium text-left'}
          >
            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>
      
      <div className={`mt-8 pt-6 border-t ${borderClass}`}>
        <div className={`text-xs ${textSecondary} space-y-1`}>
          <div className="font-semibold text-sm mb-2">Credits</div>
          <div>Email: <a href="mailto:judebaker99@gmail.com" className="text-blue-500 hover:underline">judebaker99@gmail.com</a></div>
          <div>Phone: <a href="tel:+393270457198" className="text-blue-500 hover:underline">+39 327 045 7198</a></div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`fixed right-0 top-0 h-full ${isExpanded ? 'w-64' : 'w-0'} ${bgClass} border-l ${borderClass} shadow-lg overflow-hidden z-40 hidden lg:block transition-all duration-300`}>
        <div className={`p-4 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          {renderSettingsContent()}
        </div>
      </div>
      
      {/* Mobile modal */}
      {isExpanded && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onToggleExpand}>
          <div
            className={`${bgClass} w-80 h-full ml-auto shadow-xl overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {renderSettingsContent()}
            </div>
          </div>
        </div>
      )}
      
      {/* Toggle button - visible on all screen sizes */}
      {!isExpanded && (
        <>
          <button
            onClick={onToggleExpand}
            className={`fixed right-0 top-4 z-50 p-3 ${bgClass} border-l border-b ${borderClass} rounded-l-lg shadow-lg ${hoverClass} transition-all`}
            aria-label="Expand settings"
          >
            <span className={`text-xl ${textPrimary}`}>⚙️</span>
          </button>
          {/* Favorite button - right under settings button */}
          {weather && onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              className={`fixed right-0 top-[76px] z-50 p-3 min-w-[44px] min-h-[44px] ${bgClass} border-l border-b ${borderClass} rounded-l-lg shadow-lg ${hoverClass} transition-all`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              type="button"
            >
              <span className={`text-xl ${isFavorite ? 'text-yellow-500' : textSecondary}`}>
                {isFavorite ? '★' : '☆'}
              </span>
            </button>
          )}
        </>
      )}
    </>
  );
}
