import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';

import NomadsoftTestPopup from '../screens/NomadsoftTestPopup';
import TabNavigator from './tab-navigator';

export type RootStackParamList = {
  TabNavigator: undefined;
  NomadsoftTestPopup: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { isDark } = useTheme();
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TabNavigator">
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NomadsoftTestPopup"
          component={NomadsoftTestPopup}
          options={{ 
            presentation: 'modal', 
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            },
            headerTintColor: isDark ? '#F3F4F6' : '#111827',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}