# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo boilerplate using TypeScript and NativeWind (Tailwind CSS for React Native). It's set up as a managed Expo workflow with support for iOS, Android, and Web platforms. The app integrates with a custom NestJS backend for authentication and user management.

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

### Backend Integration
- **API Base URL**: `https://cdserver.nomadsoft.us/api/v1`
- **Authentication**: JWT-based with refresh tokens
- **Test Credentials**: `aloha@ixplor.app:password`
- **File Upload**: Two-step process (upload file → update profile)
- **Image Processing**: Automatically resizes images to 512x512px to avoid server limits

### Authentication System
The app uses a custom JWT authentication system replacing SuperTokens:
- **AuthService** (`/services/authService.ts`): Handles all API communication
- **AuthContext** (`/contexts/AuthContext.tsx`): Manages authentication state
- **Token Storage**: Uses AsyncStorage for persistence with automatic refresh
- **Cross-device Sync**: Manual refresh when editing profile to ensure latest data

### Navigation Structure
The app uses React Navigation with conditional rendering based on auth state:
- **Authenticated**: Bottom tab navigator (Nomadsoft/Profile tabs)
- **Unauthenticated**: AuthScreen for login/registration
- **Modal Presentations**: Handled via root stack navigator

### Component Organization
- `/components/styled`: Reusable UI components with consistent theming
  - Exports themed components (Card, Input, Button, etc.)
  - Automatic dark/light mode support
  - TypeScript interfaces for all props
- `/screens`: Screen-level components that compose smaller components
- `/navigation`: Navigation configuration and type definitions
- `/config`: API configuration and endpoints

### Profile Management
The ProfileScreen implements comprehensive profile editing:
- **Photo Upload**: Camera/library selection with automatic resizing
- **Expandable Forms**: Inline editing within existing card UI (no modals)
- **Real-time Validation**: Form validation with immediate error feedback
- **Smart Refresh**: Fetches fresh data from server when editing begins
- **Cross-device Sync**: Pull-to-refresh and automatic refresh on edit

### Styling Approach
- Uses NativeWind (Tailwind CSS for React Native) with custom configuration
- Global styles defined in `global.css`
- Styled components in `/components/styled/index.tsx` with theme integration
- Dark/light mode support via ThemeContext
- Custom colors defined in `tailwind.config.js`

### Key Technical Patterns
- **Form Management**: Pre-filled forms with useEffect syncing to user data
- **State Updates**: Direct context updates (updateUser) to prevent navigation issues
- **Error Handling**: Comprehensive try/catch with user-friendly alerts
- **Loading States**: Visual feedback for all async operations
- **Image Handling**: expo-image-manipulator for resizing before upload

## Key Technical Details

- **Expo SDK**: Version 53
- **No testing framework**: Tests need to be set up if required
- **Image Libraries**: expo-image-picker, expo-image-manipulator
- **Storage**: @react-native-async-storage/async-storage for tokens
- **Navigation**: @react-navigation/native with bottom-tabs and stack
- **Safe Areas**: react-native-safe-area-context
- **Fonts**: Oxanium font family with system fallbacks

## Important Implementation Notes

### Authentication Flow
1. User logs in → tokens stored in AsyncStorage
2. AuthContext manages authentication state
3. Automatic token refresh on API calls
4. Manual user data refresh when needed (not automatic to avoid loops)

### Profile Updates
1. Always refresh user data from server before editing
2. Two-step file upload: upload file → update profile with file reference
3. Direct context updates prevent navigation side effects
4. Form validation with real-time error clearing

### Common Pitfalls to Avoid
- Do NOT use automatic session checking in focus effects (causes infinite loops)
- Do NOT call checkSession() after profile updates (use updateUser() instead)
- Always resize images before upload to prevent 413 errors
- Refresh user data before opening edit forms for cross-device consistency