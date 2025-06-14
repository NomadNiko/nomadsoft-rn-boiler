// Color palette configuration
const colorPalette = {
  primary: 'indigo',
  secondary: 'purple',
  error: 'red',
} as const;

// Generate color classes for different shades
const generateColorClasses = (colorName: string, prefix: string) => ({
  50: `${prefix}-${colorName}-50`,
  100: `${prefix}-${colorName}-100`,
  200: `${prefix}-${colorName}-200`,
  300: `${prefix}-${colorName}-300`,
  400: `${prefix}-${colorName}-400`,
  500: `${prefix}-${colorName}-500`,
  600: `${prefix}-${colorName}-600`,
  700: `${prefix}-${colorName}-700`,
  800: `${prefix}-${colorName}-800`,
  900: `${prefix}-${colorName}-900`,
  950: `${prefix}-${colorName}-950`,
});

// Color system with light and dark mode support
export const colors = {
  light: {
    background: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
    },
    text: {
      primary: generateColorClasses(colorPalette.primary, 'text'),
      secondary: generateColorClasses(colorPalette.secondary, 'text'),
      error: generateColorClasses(colorPalette.error, 'text'),
      base: 'text-gray-900',
      muted: 'text-gray-600',
      light: 'text-gray-400',
    },
    bg: {
      primary: generateColorClasses(colorPalette.primary, 'bg'),
      secondary: generateColorClasses(colorPalette.secondary, 'bg'),
      error: generateColorClasses(colorPalette.error, 'bg'),
    },
    border: {
      primary: generateColorClasses(colorPalette.primary, 'border'),
      secondary: generateColorClasses(colorPalette.secondary, 'border'),
      error: generateColorClasses(colorPalette.error, 'border'),
      base: 'border-gray-200',
      light: 'border-gray-100',
    },
  },
  dark: {
    background: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-800',
      tertiary: 'bg-gray-700',
    },
    text: {
      primary: generateColorClasses(colorPalette.primary, 'text'),
      secondary: generateColorClasses(colorPalette.secondary, 'text'),
      error: generateColorClasses(colorPalette.error, 'text'),
      base: 'text-gray-100',
      muted: 'text-gray-400',
      light: 'text-gray-600',
    },
    bg: {
      primary: generateColorClasses(colorPalette.primary, 'bg'),
      secondary: generateColorClasses(colorPalette.secondary, 'bg'),
      error: generateColorClasses(colorPalette.error, 'bg'),
    },
    border: {
      primary: generateColorClasses(colorPalette.primary, 'border'),
      secondary: generateColorClasses(colorPalette.secondary, 'border'),
      error: generateColorClasses(colorPalette.error, 'border'),
      base: 'border-gray-700',
      light: 'border-gray-800',
    },
  },
};

// Component styles with modern glass effect
export const components = {
  // Button styles
  button: {
    base: `px-6 py-3 rounded-2xl items-center`,
    primary: {
      solid: `bg-indigo-600`,
      outline: `border-2 border-indigo-600`,
      ghost: ``,
      glass: `bg-indigo-600/80`,
    },
    secondary: {
      solid: `bg-purple-600`,
      outline: `border-2 border-purple-600`,
      ghost: ``,
      glass: `bg-purple-600/80`,
    },
    error: {
      solid: `bg-red-600`,
      outline: `border-2 border-red-600`,
      ghost: ``,
      glass: `bg-red-600/80`,
    },
    sizes: {
      sm: 'px-4 py-2 rounded-xl',
      md: 'px-6 py-3 rounded-2xl',
      lg: 'px-8 py-4 rounded-2xl',
      xl: 'px-10 py-5 rounded-3xl',
    },
  },

  // Card styles
  card: {
    base: `rounded-3xl p-6`,
    light: {
      solid: `bg-white shadow-xl`,
      outline: `border-2 border-gray-200`,
      glass: `bg-white/70 border border-gray-100`,
    },
    dark: {
      solid: `bg-gray-800 shadow-xl`,
      outline: `border-2 border-gray-700`,
      glass: `bg-gray-800/70 border border-gray-800`,
    },
  },

  // Paper styles (lighter cards)
  paper: {
    base: `rounded-2xl p-4`,
    light: {
      primary: `bg-gray-50`,
      secondary: `bg-gray-100`,
      elevated: `bg-white shadow-md`,
    },
    dark: {
      primary: `bg-gray-800`,
      secondary: `bg-gray-700`,
      elevated: `bg-gray-900 shadow-xl`,
    },
  },

  // Input styles
  input: {
    base: `px-4 py-3 rounded-2xl`,
    light: {
      default: `bg-white border-2 border-gray-200`,
      filled: `bg-gray-100`,
      glass: `bg-white/70 border border-gray-100`,
    },
    dark: {
      default: `bg-gray-800 border-2 border-gray-700`,
      filled: `bg-gray-700`,
      glass: `bg-gray-800/70 border border-gray-800`,
    },
    error: `border-2 border-red-500`,
  },

  // Badge styles
  badge: {
    base: `px-3 py-1 rounded-full`,
    primary: `bg-indigo-100`,
    secondary: `bg-purple-100`,
    error: `bg-red-100`,
    success: `bg-green-100`,
    warning: `bg-yellow-100`,
  },

  // Modal styles
  modal: {
    backdrop: `absolute inset-0 bg-black/50`,
    container: `rounded-3xl shadow-2xl`,
    light: `bg-white`,
    dark: `bg-gray-900`,
    glass: `border border-gray-100`,
  },

  // List item styles
  listItem: {
    base: `px-4 py-3`,
    interactive: ``,
    light: ``,
    dark: ``,
  },

  // Divider styles
  divider: {
    horizontal: `h-[1px] w-full`,
    vertical: `w-[1px] h-full`,
    light: 'bg-gray-200',
    dark: 'bg-gray-700',
  },
};

// Layout utilities
export const layout = {
  container: {
    base: 'flex-1',
    centered: 'flex-1 items-center justify-center',
    padded: 'flex-1 px-4 py-6',
    safeArea: 'flex-1 px-4',
  },
  flex: {
    row: 'flex-row',
    col: 'flex-col',
    center: 'items-center justify-center',
    between: 'items-center justify-between',
    around: 'items-center justify-around',
    evenly: 'items-center justify-evenly',
  },
  spacing: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  },
};

// Typography styles
export const typography = {
  heading: {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
  },
  body: {
    lg: 'text-lg',
    base: 'text-base',
    sm: 'text-sm',
    xs: 'text-xs',
  },
  weight: {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
};

// Legacy styles (for backward compatibility)
export const globalStyles = {
  container: layout.container.centered,
  separator: components.divider.horizontal + ' my-7 w-4/5 bg-blue-200',
  title: typography.heading.h4 + ' text-indigo-700',
  subtitle: typography.body.lg + ' text-indigo-800',
  nomadsoftLogoMedium: 'w-64 h-64 mb-4 rounded-xl',
};

// Helper function to get theme-aware styles
export const getThemeStyles = (isDark: boolean) => ({
  colors: isDark ? colors.dark : colors.light,
  card: isDark ? components.card.dark : components.card.light,
  paper: isDark ? components.paper.dark : components.paper.light,
  input: isDark ? components.input.dark : components.input.light,
  modal: isDark ? components.modal.dark : components.modal.light,
  listItem: isDark ? components.listItem.dark : components.listItem.light,
  divider: isDark ? components.divider.dark : components.divider.light,
});