import './global.css';

import 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';

import RootStack from './navigation';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useOxaniumFonts } from './hooks/useFonts';

export default function App() {
  const fontsLoaded = useOxaniumFonts();

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </ThemeProvider>
  );
}
