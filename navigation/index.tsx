import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeStyles } from '../styles/globalStyles';

import NomadsoftTestPopup from '../screens/NomadsoftTestPopup';
import TabNavigator from './tab-navigator';

export type RootStackParamList = {
  TabNavigator: undefined;
  NomadsoftTestPopup: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);

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
              backgroundColor: theme.navigationColors.headerBackground,
            },
            headerTintColor: theme.navigationColors.headerTint,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
