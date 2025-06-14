# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo boilerplate using TypeScript and NativeWind (Tailwind CSS for React Native). It's set up as a managed Expo workflow with support for iOS, Android, and Web platforms.

## Essential Commands

### Development
```bash
# Start the development server
npm start

# Run on specific platforms
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser

# Generate native projects (if needed)
npm run prebuild
```

### Code Quality
```bash
# Run linting and format checking
npm run lint

# Auto-fix linting issues and format code
npm run format
```

## Architecture Overview

### Navigation Structure
The app uses React Navigation with a bottom tab navigator as the root, containing:
- **Home Tab**: Stack navigator with NomadsoftScreen as the main screen
- **Profile Tab**: ProfileScreen
- Modal presentations are handled via the root stack navigator

### Component Organization
- `/components`: Reusable UI components with TypeScript interfaces
  - Each component exports both the component and its props interface
  - Components use NativeWind classes for styling
- `/screens`: Screen-level components that compose smaller components
- `/navigation`: Navigation configuration and type definitions

### Styling Approach
- Uses NativeWind (Tailwind CSS for React Native) with a custom configuration
- Global styles defined in `global.css`
- Component styles use className prop with Tailwind utility classes
- Custom colors defined in `tailwind.config.js` (e.g., `bgtabs`, `texttabs`)

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (@/ for root directory)
- Proper typing for navigation using React Navigation's TypeScript support

## Key Technical Details

- **Expo SDK**: Version 53
- **No testing framework**: Tests need to be set up if required
- **Image handling**: Uses Expo's Image component for optimized loading
- **Safe areas**: Implemented using react-native-safe-area-context
- **Custom fonts**: Set up to use system fonts with fallbacks