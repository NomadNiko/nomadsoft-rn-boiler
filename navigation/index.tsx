import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getThemeStyles } from '../styles/globalStyles';
import { ActivityIndicator, View } from 'react-native';

import NomadsoftTestPopup from '../screens/NomadsoftTestPopup';
import TabNavigator from './tab-navigator';
import AuthScreen from '../screens/AuthScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TabNavigator: undefined;
  NomadsoftTestPopup: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);

  return (
    <Stack.Navigator initialRouteName="TabNavigator">
      <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="NomadsoftTestPopup"
        component={NomadsoftTestPopup}
        options={{
          presentation: 'modal',
          headerLeft: () => null,
          headerStyle: {
            backgroundColor: theme.navigationColors.headerBackground,
          },
          headerTintColor: theme.navigationColors.headerTint,
          headerTitleStyle: {
            fontFamily: 'Oxanium-SemiBold',
            fontSize: 18,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default function RootStack() {
  const { isDark } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color={isDark ? '#A78BFA' : '#6366F1'} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
