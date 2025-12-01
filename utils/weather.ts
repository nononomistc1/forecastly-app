import { ForecastItem, DailyForecast } from '@/types/weather';

/**
 * Convert temperature from Celsius to Fahrenheit if needed
 */
export const convertTemp = (temp: number, unit: 'celsius' | 'fahrenheit'): number => {
  return unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;
};

/**
 * Get temperature symbol based on unit
 */
export const getTempSymbol = (unit: 'celsius' | 'fahrenheit'): string => {
  return unit === 'fahrenheit' ? '°F' : '°C';
};

/**
 * Convert wind speed from m/s to km/h or mph
 */
export const convertWindSpeed = (speed: number, unit: 'kmh' | 'mph'): string => {
  if (unit === 'mph') {
    return (speed * 2.237).toFixed(1) + ' mph';
  }
  return (speed * 3.6).toFixed(1) + ' km/h';
};

/**
 * Format date to locale string
 */
export const formatDate = (timestamp: number, options?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', options || {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to locale string
 */
export const formatTime = (timestamp: number, hour12 = false): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  });
};

/**
 * Calculate daily averages from forecast items
 */
export const calculateDailyAverages = (items: ForecastItem[]) => {
  const temps = items.map((item) => item.main.temp);
  const high = Math.max(...temps);
  const low = Math.min(...temps);
  const avgHumidity = Math.round(
    items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length
  );
  const avgWindSpeed = items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length;
  const avgPressure = Math.round(
    items.reduce((sum, item) => sum + item.main.pressure, 0) / items.length
  );
  const avgCloudiness = Math.round(
    items.reduce((sum, item) => sum + item.clouds.all, 0) / items.length
  );

  return {
    high,
    low,
    humidity: avgHumidity,
    windSpeed: avgWindSpeed,
    pressure: avgPressure,
    cloudiness: avgCloudiness,
  };
};

/**
 * Get AQI label from index
 */
export const getAqiLabel = (aqi: number | null | undefined): string => {
  if (!aqi) return 'Unknown';
  const labels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  return labels[aqi - 1] || 'Unknown';
};

/**
 * Get AQI color class from index
 */
export const getAqiColor = (aqi: number | null | undefined): string => {
  if (!aqi) return 'text-gray-500';
  const colors = ['text-green-500', 'text-yellow-500', 'text-orange-500', 'text-red-500', 'text-purple-500'];
  return colors[aqi - 1] || 'text-gray-500';
};

/**
 * Get UV index label
 */
export const getUvLabel = (uv: number | null | undefined): string => {
  if (!uv) return 'Unknown';
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
};

/**
 * Get UV index color class
 */
export const getUvColor = (uv: number | null | undefined): string => {
  if (!uv) return 'text-gray-500';
  if (uv <= 2) return 'text-green-500';
  if (uv <= 5) return 'text-yellow-500';
  if (uv <= 7) return 'text-orange-500';
  if (uv <= 10) return 'text-red-500';
  return 'text-purple-500';
};

