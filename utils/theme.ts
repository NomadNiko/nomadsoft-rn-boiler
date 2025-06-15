export const getThemeStyles = (isDarkMode: boolean) => {
  return {
    background: {
      primary: isDarkMode ? 'bg-gray-900' : 'bg-white',
      secondary: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
      tertiary: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
    },
    text: {
      primary: isDarkMode ? 'text-gray-100' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    },
  };
};
