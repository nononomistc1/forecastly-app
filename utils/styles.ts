/**
 * Get dark mode styling classes
 */
export const getDarkModeClasses = (darkMode: boolean) => {
  return {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    bgCard: darkMode ? 'bg-gray-700' : 'bg-gray-50',
    bgMain: darkMode ? 'bg-gray-900' : '',
    textPrimary: darkMode ? 'text-white' : 'text-gray-800',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    textTertiary: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    hoverCard: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100',
  };
};

