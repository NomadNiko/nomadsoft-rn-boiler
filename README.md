# Nomadsoft React Native Boilerplate

<div align="center">
  <img src="https://github.com/NomadNiko/nomadsoft-rn-boiler/blob/main/assets/adaptive-icon.png" alt="Nomadsoft Logo" width="200" />
  
  <h3>A production-ready React Native starter with authentication & theming</h3>
  
  <p>
    <a href="https://nomadsoft.us/">Nomadsoft</a> • 
    Built with React Native & Expo
  </p>
</div>

## Overview

This is a **production-ready React Native boilerplate** that goes far beyond a basic starter template. It includes complete authentication, advanced theming, custom fonts, and a comprehensive UI component system - everything you need to build professional mobile applications.

## ✨ Key Features

### 🔐 **Complete Authentication System**
- **SuperTokens Integration** - Email/password authentication with secure backend
- **Protected Navigation** - Conditional routing based on authentication state
- **Session Management** - Persistent sessions with automatic validation
- **Login/Signup UI** - Professional authentication screens with password visibility toggles

### 🎨 **Advanced Theme System**
- **Dark/Light Mode** - System-wide theming with instant switching
- **Persistent Preferences** - Theme choice saved across app restarts
- **Navigation Theming** - Headers, tabs, and modals adapt to selected theme
- **Component Integration** - All UI components automatically use theme context

### 🔤 **Custom Typography**
- **Oxanium Google Fonts** - Modern, professional font family throughout the app
- **Multiple Weights** - Light, Regular, Medium, SemiBold, Bold, ExtraBold
- **Optimized Loading** - Fonts loaded with proper loading states
- **Tailwind Integration** - Custom font classes available throughout

### 🧩 **Professional UI Components**
- **25+ Styled Components** - Complete UI library with consistent theming
- **Type-Safe Props** - Full TypeScript interfaces for all components
- **Responsive Design** - Works perfectly on iOS, Android, and Web
- **Theme-Aware** - All components automatically adapt to light/dark themes

### 📱 **Modern Tech Stack**
- **React Native 0.79.3** - Latest React Native with Expo 53
- **TypeScript 5.8.3** - Strict mode with comprehensive type safety
- **NativeWind** - Tailwind CSS for React Native with custom configuration
- **React Navigation 7** - Professional navigation with stack and tab navigators

## 🏗️ Architecture

### Project Structure

```
nomadsoft-rn-boiler/
├── App.tsx                      # Application entry point with font loading
├── app.json                    # Expo configuration
├── assets/                     # Images, icons, and branding
├── components/
│   ├── styled/                 # Complete UI component library
│   │   └── index.tsx          # 25+ styled components
│   ├── Button.tsx             # Generic button component
│   ├── ThemeToggle.tsx        # Theme switcher component
│   └── TabBarIcon.tsx         # Navigation icons
├── contexts/
│   ├── AuthContext.tsx        # Authentication state management
│   └── ThemeContext.tsx       # Theme state with persistence
├── hooks/
│   └── useFonts.ts           # Oxanium font loading hook
├── navigation/
│   ├── index.tsx             # Root navigation with auth routing
│   └── tab-navigator.tsx     # Bottom tab navigation
├── screens/
│   ├── AuthScreen.tsx        # Complete login/signup UI
│   ├── NomadsoftScreen.tsx   # Home screen with branding
│   ├── ProfileScreen.tsx     # User profile with settings
│   └── NomadsoftTestPopup.tsx # Modal example
├── services/
│   ├── auth.ts              # SuperTokens authentication service
│   └── simpleAuth.ts        # Fallback authentication (backup)
├── styles/
│   └── globalStyles.ts      # Comprehensive styling system
├── utils/
│   └── theme.ts            # Theme utility functions
├── config/
│   └── supertokens.ts      # SuperTokens configuration
├── global.css              # Global styles with NativeWind
└── tailwind.config.js      # Custom Tailwind config with fonts
```

### Authentication Flow

```
App Launch
    ↓
Font Loading → Loading Screen
    ↓
Theme Context → Load saved preferences
    ↓
Auth Context → Check session validity
    ↓
Navigation Router → Conditional routing
    ↓
Auth Screen ←→ Main App (Tabs)
```

### Component Architecture

All components follow a consistent pattern:

```typescript
interface ComponentProps {
  // TypeScript interface for props
}

export const Component = ({ ...props }: ComponentProps) => {
  const { isDark } = useTheme(); // Automatic theme integration
  const theme = getThemeStyles(isDark);
  
  return (
    <View className={`${theme.colors.background.primary} ${className}`}>
      {/* NativeWind styling with theme classes */}
    </View>
  );
};
```

## 🛠️ Dependencies

### Core Framework
```json
{
  "@expo/vector-icons": "^14.0.0",
  "expo": "^53.0.11",
  "expo-font": "~13.3.1",
  "expo-status-bar": "~2.2.3",
  "react": "19.0.0",
  "react-native": "0.79.3",
  "typescript": "~5.8.3"
}
```

### Authentication & Storage
```json
{
  "supertokens-react-native": "^5.1.3",
  "supertokens-web-js": "^0.15.0",
  "@react-native-async-storage/async-storage": "^2.2.0"
}
```

### Navigation
```json
{
  "@react-navigation/bottom-tabs": "^7.0.5",
  "@react-navigation/native": "^7.0.3",
  "@react-navigation/stack": "^7.0.4",
  "react-native-gesture-handler": "~2.24.0",
  "react-native-safe-area-context": "5.4.0",
  "react-native-screens": "~4.11.1"
}
```

### Styling & Fonts
```json
{
  "@expo-google-fonts/oxanium": "^0.4.1",
  "nativewind": "latest",
  "tailwindcss": "^3.4.0"
}
```

### Development Tools
```json
{
  "eslint": "^9.25.1",
  "eslint-config-expo": "^9.2.0",
  "eslint-config-prettier": "^10.1.2",
  "prettier": "^3.2.5",
  "prettier-plugin-tailwindcss": "^0.5.11"
}
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo Go** app for device testing
- **iOS Simulator** (Mac) or **Android Emulator**

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd nomadsoft-rn-boiler

# Install dependencies
npm install

# Start the development server
npm start
```

### Development Commands

```bash
# Platform-specific commands
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator  
npm run web        # Run in web browser

# Development tools
npm run lint       # Check code quality
npm run format     # Format code with Prettier
npm run prebuild   # Generate native projects
```

## 🎯 Current Implementation Status

### ✅ **Fully Implemented**

**Authentication System:**
- ✅ SuperTokens integration with live backend
- ✅ Email/password authentication
- ✅ Session management and persistence
- ✅ Protected navigation routing
- ✅ User profile management
- ✅ Login/signup UI with password toggles

**UI & Design:**
- ✅ Dark/light theme system with persistence
- ✅ Oxanium custom fonts throughout
- ✅ 25+ styled components library
- ✅ Responsive design (iOS/Android/Web)
- ✅ Professional authentication screens
- ✅ User profile with settings

**Architecture:**
- ✅ TypeScript strict mode
- ✅ Context providers for state management
- ✅ Modern React Navigation setup
- ✅ NativeWind styling system
- ✅ Error handling and loading states
- ✅ Production-ready code structure

**Development Tools:**
- ✅ ESLint + Prettier configuration
- ✅ Tailwind CSS with custom config
- ✅ Font loading with proper states
- ✅ Component-based architecture

### 🔄 **Ready for Extension**

The boilerplate provides a solid foundation for adding:

- **API Integration** - Extend auth service for additional endpoints
- **State Management** - Add Redux/Zustand for complex state
- **Testing** - Jest and React Native Testing Library setup
- **Push Notifications** - Expo Notifications integration
- **Offline Support** - Add offline-first capabilities
- **CI/CD Pipeline** - GitHub Actions or similar
- **Error Monitoring** - Sentry or similar service integration

## 🎨 Customization

### Branding

Replace assets in `/assets/` with your own:
- Update Nomadsoft branding to your company
- Replace logos and icons
- Modify splash screen assets

### Theming

Customize the theme system in `/styles/globalStyles.ts`:

```typescript
export const colors = {
  light: {
    background: {
      primary: 'bg-white',        // Customize colors
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-200',
    },
    // ... more theme options
  }
};
```

### Typography

Add new font weights or families in `/tailwind.config.js`:

```javascript
fontFamily: {
  'custom-font': ['YourCustomFont-Regular'],
  // ... existing Oxanium fonts
}
```

### Authentication

Configure SuperTokens in `/config/supertokens.ts`:

```typescript
export const SUPERTOKENS_CONFIG = {
  apiDomain: 'your-backend-domain.com',
  apiBasePath: '/auth',
};
```

## 🧪 Backend Requirements

This boilerplate connects to a SuperTokens backend. You'll need:

1. **SuperTokens Backend** - Running with EmailPassword recipe
2. **CORS Configuration** - Allow your app domain
3. **HTTPS Domain** - Required for production authentication

Example backend setup available in the SuperTokens documentation.

## 📱 Screenshots & Demo

The boilerplate includes:
- **Professional login/signup screens** with password visibility toggles
- **Dark/light theme switching** throughout the entire app
- **User profile screen** with settings and sign-out functionality
- **Branded home screen** showcasing the component library
- **Modal presentations** and proper navigation flow

## 🤝 Contributing

This boilerplate is maintained by [Nomadsoft](https://nomadsoft.us/). 

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Follow the established code patterns
4. Ensure all TypeScript types are properly defined
5. Test on iOS, Android, and Web
6. Submit a pull request

## 📄 License

© 2024 [Nomadsoft](https://nomadsoft.us/). All rights reserved.

---

<div align="center">
  <p>Built with ❤️ by the Nomadsoft team</p>
  <p>
    <a href="https://nomadsoft.us/">Website</a> • 
    <a href="https://github.com/nomadsoft">GitHub</a>
  </p>
</div>