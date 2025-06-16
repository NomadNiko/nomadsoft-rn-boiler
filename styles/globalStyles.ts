// Layout styles
export const layout = {
  container: {
    base: 'flex-1',
    centered: 'flex-1 items-center justify-center',
    padded: 'px-4 py-6',
  },
  flex: {
    row: 'flex-row',
    between: 'items-center justify-between',
    around: 'justify-around',
  },
};

// Typography styles
export const typography = {
  heading: {
    h2: 'text-2xl font-oxanium-semibold',
    h3: 'text-3xl font-oxanium-bold',
    h4: 'text-xl font-oxanium-semibold',
  },
  body: {
    base: 'text-base font-oxanium-regular',
    lg: 'text-lg font-oxanium-regular',
    sm: 'text-sm font-oxanium-regular',
  },
  weight: {
    medium: 'font-oxanium-medium',
    semibold: 'font-oxanium-semibold',
  },
};

// Color system
export const colors = {
  light: {
    background: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-200',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      white: 'text-white',
      purple: 'text-purple-600',
      error: 'text-red-600',
      blue: 'text-blue-500',
    },
    border: {
      secondary: 'border-gray-600',
      purple: 'border-purple-600',
    },
    bg: {
      gray100: 'bg-gray-100',
    },
  },
  dark: {
    background: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-800',
      tertiary: 'bg-gray-700',
    },
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-400',
      white: 'text-white',
      purple: 'text-purple-400',
      error: 'text-red-600',
      blue: 'text-blue-400',
    },
    border: {
      secondary: 'border-gray-600',
      purple: 'border-purple-400',
    },
    bg: {
      gray700: 'bg-gray-700',
    },
  },
};

// Component styles
export const components = {
  // Container styles
  container: {
    modal: 'rounded-3xl shadow-2xl mt-20 p-6',
    profileCard: 'rounded-3xl p-6 mt-8 items-center shadow-xl',
    paper: 'rounded-2xl p-4 mt-6 shadow-md',
  },

  // Image styles
  image: {
    logo: 'mb-6 h-64 w-64 rounded-2xl',
    profile: 'h-32 w-32 rounded-full',
    profileWrapper: 'mb-4 rounded-full p-1',
  },

  // Button styles
  button: {
    base: 'px-6 py-3 rounded-2xl items-center',
    small: 'px-4 py-2 rounded-xl items-center',
    primary: 'bg-indigo-600',
    outline: 'border-2',
    close: 'rounded-xl p-2',
    toggle: 'p-2',
  },

  // Input styles
  input: {
    base: 'px-4 py-3 rounded-2xl',
    bordered: 'border-2',
  },

  // Divider styles
  divider: {
    nomadsoftDivider: 'h-[1px] w-32 my-4',
    listDivider: 'h-[1px] mx-4',
  },

  // Badge styles
  badge: {
    base: 'px-3 py-1 rounded-full',
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
    },
  },

  // List item styles
  listItem: {
    base: 'px-4 py-3 flex-row items-center justify-between',
  },

  // Utility styles
  utils: {
    flexWrap: 'flex-wrap',
    itemsCenter: 'items-center',
    textCenter: 'text-center',
    wFull: 'w-full',
    flex1: 'flex-1',
    spaceY4: 'space-y-4',
    p1: 'p-1',
  },

  // Responsive containers
  responsive: {
    // Auth forms and content containers
    formContainer: 'w-full max-w-md mx-auto px-6 sm:max-w-lg md:max-w-xl lg:max-w-2xl',
    // Main content containers  
    contentContainer: 'w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    // Profile and card containers
    cardContainer: 'w-full max-w-2xl mx-auto px-4 sm:px-6',
    // Posts and feed containers
    feedContainer: 'w-full max-w-3xl mx-auto px-4 sm:px-6',
    // Input field containers for forms
    inputContainer: 'w-full sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto',
    // Full width on mobile, constrained on larger screens
    constrainedWidth: 'w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
  },

  // Shadow styles
  shadow: {
    md: 'shadow-md',
    xl: 'shadow-xl',
  },

  // Spacing
  spacing: {
    gap2: 'gap-2',
    gap3: 'gap-3',
    gap4: 'gap-4',
    mt1: 'mt-1',
    mt2: 'mt-2',
    mt4: 'mt-4',
    mt6: 'mt-6',
    mt8: 'mt-8',
    mb1: 'mb-1',
    mb2: 'mb-2',
    mb3: 'mb-3',
    mb4: 'mb-4',
    mb6: 'mb-6',
    ml3: 'ml-3',
    p4: 'p-4',
  },

  // Color palette demo
  colorBox: 'h-10 w-10 rounded-lg',

  // Color swatches for demo
  colorSwatches: {
    indigo: {
      100: 'bg-indigo-100',
      300: 'bg-indigo-300',
      500: 'bg-indigo-500',
      700: 'bg-indigo-700',
      900: 'bg-indigo-900',
    },
    purple: {
      100: 'bg-purple-100',
      300: 'bg-purple-300',
      500: 'bg-purple-500',
      700: 'bg-purple-700',
      900: 'bg-purple-900',
    },
  },
};

// Icon colors
export const iconColors = {
  light: {
    primary: '#6366F1',
    secondary: '#9CA3AF',
    close: '#4B5563',
    error: '#EF4444',
    sun: '#4338CA',
    moon: '#4338CA',
    blue: '#007AFF',
  },
  dark: {
    primary: '#A78BFA',
    secondary: '#6B7280',
    close: '#E5E7EB',
    error: '#EF4444',
    sun: '#FCD34D',
    moon: '#FCD34D',
    blue: '#60A5FA',
  },
};

// Navigation colors
export const navigationColors = {
  light: {
    tabBarActive: '#6366F1',
    tabBarInactive: '#6B7280',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    headerBackground: '#FFFFFF',
    headerTint: '#111827',
  },
  dark: {
    tabBarActive: '#A78BFA',
    tabBarInactive: '#9CA3AF',
    tabBarBackground: '#1F2937',
    tabBarBorder: '#374151',
    headerBackground: '#1F2937',
    headerTint: '#F3F4F6',
  },
};

// Placeholder colors
export const placeholderColors = {
  light: '#6B7280',
  dark: '#9CA3AF',
};

// Helper function to get theme-aware styles
export const getThemeStyles = (isDark: boolean) => ({
  colors: isDark ? colors.dark : colors.light,
  iconColors: isDark ? iconColors.dark : iconColors.light,
  navigationColors: isDark ? navigationColors.dark : navigationColors.light,
  placeholderColor: isDark ? placeholderColors.dark : placeholderColors.light,
});
