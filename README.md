# Nomadsoft React Native Boilerplate

<div align="center">
  <img src="assets/images/nomadsoft.png" alt="Nomadsoft Logo" width="200" />
  
  <h3>A modern React Native starter template</h3>
  
  <p>
    <a href="https://nomadsoft.us/">Nomadsoft</a> • 
    Built with <a href="https://rn.new/">create-expo-stack</a>
  </p>
</div>

## Overview

This is a production-ready React Native boilerplate designed to accelerate mobile app development. It provides a solid foundation with TypeScript, Expo, and NativeWind (Tailwind CSS for React Native) pre-configured.

## Features

- 🚀 **Expo SDK 53** - Latest Expo managed workflow
- 📱 **Cross-platform** - iOS, Android, and Web support
- 🎨 **NativeWind** - Tailwind CSS styling for React Native
- 📝 **TypeScript** - Full type safety with strict mode
- 🧭 **React Navigation** - Tab and stack navigation pre-configured
- 🎯 **ESLint & Prettier** - Code quality and formatting tools
- 📦 **Optimized assets** - Image optimization and splash screen setup

## Architecture

### Project Structure

```
nomadsoft-rn-boiler/
├── App.tsx                 # Application entry point
├── app.json               # Expo configuration
├── assets/                # Images, icons, and fonts
│   ├── fonts/            # Custom fonts (if any)
│   └── images/           # App images and branding
├── components/            # Reusable UI components
│   ├── Button.tsx        # Custom button component
│   ├── Container.tsx     # Layout container
│   ├── TabBarIcon.tsx    # Navigation tab icons
│   └── ...
├── navigation/            # Navigation configuration
│   ├── AppNavigator.tsx  # Root navigator setup
│   └── types.ts          # Navigation TypeScript types
├── screens/              # Screen components
│   ├── NomadsoftScreen.tsx
│   ├── ProfileScreen.tsx
│   └── NomadsoftTestPopup.tsx
├── styles/               # Global styles
│   └── index.ts         # Shared style constants
└── global.css           # Global CSS with NativeWind
```

### Navigation Architecture

The app uses React Navigation with a hierarchical structure:

- **Root Stack Navigator** - Handles modal presentations
  - **Tab Navigator** - Bottom tabs for main app sections
    - **Home Stack** - Stack navigator for home section
      - NomadsoftScreen (main screen)
    - **Profile Tab** - Direct screen (ProfileScreen)

### Component Architecture

Components follow a consistent pattern:
- TypeScript interfaces for props
- NativeWind for styling (className prop)
- Exported props interfaces for reusability
- Functional components with hooks

### Styling System

- **NativeWind**: Tailwind CSS utilities for React Native
- **Custom colors**: Defined in `tailwind.config.js`
- **Global styles**: Base styles in `global.css`
- **Component styles**: Inline className with Tailwind utilities

## Dependencies

### Core Dependencies

- **expo** (~53.0.0) - Development platform
- **react** (18.3.1) - UI framework
- **react-native** (0.76.5) - Mobile framework
- **typescript** (^5.3.3) - Type safety

### Navigation

- **@react-navigation/native** (^7.0.14)
- **@react-navigation/stack** (^7.0.18)
- **@react-navigation/bottom-tabs** (^7.0.14)

### Styling

- **nativewind** (^4.0.1) - Tailwind CSS for React Native
- **tailwindcss** (^3.4.0) - CSS framework

### Development Tools

- **eslint** (^8.57.0) - Linting
- **prettier** (^3.3.3) - Code formatting
- **eslint-config-expo** (~8.0.0) - Expo ESLint config

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (for device testing)
- iOS Simulator (Mac only) or Android Emulator

### Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to project directory
cd nomadsoft-rn-boiler

# Install dependencies
npm install
```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Development Commands

```bash
# Check code quality
npm run lint

# Format code
npm run format

# Generate native projects (if needed)
npm run prebuild
```

## Current State

### ✅ Implemented

- Basic navigation structure with tabs and stack
- TypeScript configuration with strict mode
- NativeWind styling system
- ESLint and Prettier setup
- Sample screens and components
- Nomadsoft branding

### 🚧 Not Yet Implemented

- Testing framework (Jest, React Native Testing Library)
- State management (Redux, MobX, Zustand)
- API integration layer
- Authentication flow
- Environment configuration
- CI/CD pipeline
- Error boundary
- Offline support

## Customization

### Branding

Replace assets in `/assets/images/` with your own:
- `nomadsoft.png` - Company logo
- `icon.png` - App icon
- `splash-icon.png` - Splash screen icon

### Theme

Modify `tailwind.config.js` to customize:
- Colors
- Spacing
- Typography
- Custom utilities

### Navigation

Edit `/navigation/AppNavigator.tsx` to:
- Add new screens
- Modify tab structure
- Configure navigation options

## Contributing

This boilerplate is maintained by [Nomadsoft](https://nomadsoft.us/). For questions or support, please visit our website.

## Credits

This boilerplate was initially created using [create-expo-stack](https://rn.new/), an excellent tool for bootstrapping React Native projects.

## License

© 2024 [Nomadsoft](https://nomadsoft.us/). All rights reserved.