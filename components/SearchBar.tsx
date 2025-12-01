'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { CitySuggestion } from '@/types/weather';

interface SearchBarProps {
  onSearch: (city: string, lat?: number, lon?: number) => void;
  isLoading?: boolean;
  darkMode: boolean;
}

export default function SearchBar({ onSearch, isLoading = false, darkMode }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    // Fetch city suggestions as user types
    if (city.trim().length >= 2 && API_KEY) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city.trim())}&limit=5&appid=${API_KEY}`
          );
          
          if (response.ok) {
            const data: CitySuggestion[] = await response.json();
            setSuggestions(data);
            setShowSuggestions(data.length > 0);
            setSelectedIndex(-1);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300); // Debounce for 300ms
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [city, API_KEY]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      // If there's a selected suggestion, use it
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const selected = suggestions[selectedIndex];
        onSearch(`${selected.name}, ${selected.country}`, selected.lat, selected.lon);
      } else {
        onSearch(city.trim());
      }
      setShowSuggestions(false);
      setCity('');
    }
  };

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    const cityName = suggestion.state
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    onSearch(cityName, suggestion.lat, suggestion.lon);
    setCity('');
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const inputClass = darkMode
    ? 'w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    : 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900';

  const suggestionsBg = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200';
  const suggestionHover = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const suggestionSelected = darkMode ? 'bg-gray-700' : 'bg-blue-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="w-full max-w-md mx-auto mb-8 relative">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onKeyDown={handleKeyDown}
              placeholder="Enter city name..."
              className={inputClass}
              disabled={isLoading}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg border ${suggestionsBg} max-h-60 overflow-y-auto`}
              >
                {suggestions.map((suggestion, index) => {
                  const displayName = suggestion.state
                    ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
                    : `${suggestion.name}, ${suggestion.country}`;
                  
                  return (
                    <button
                      key={`${suggestion.lat}-${suggestion.lon}`}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-4 py-3 transition-colors ${suggestionHover} ${
                        index === selectedIndex ? suggestionSelected : ''
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${
                        index === suggestions.length - 1 ? 'rounded-b-lg' : ''
                      }`}
                    >
                      <div className={`font-medium ${textPrimary}`}>{suggestion.name}</div>
                      <div className={`text-sm ${textSecondary}`}>
                        {suggestion.state ? `${suggestion.state}, ` : ''}
                        {suggestion.country}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !city.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
}

