import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';

import { RootStackParamList } from '.';
import { HeaderButton } from '../components/HeaderButton';
import { TabBarIcon } from '../components/TabBarIcon';
import ThemeToggle from '../components/ThemeToggle';
import NomadsoftScreen from '../screens/NomadsoftScreen';
import PostsScreen from '../screens/PostsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeStyles } from '../styles/globalStyles';

const Tab = createBottomTabNavigator();

type Props = StackScreenProps<RootStackParamList, 'TabNavigator'>;

export default function TabLayout({ navigation }: Props) {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.navigationColors.tabBarActive,
        tabBarInactiveTintColor: theme.navigationColors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.navigationColors.tabBarBackground,
          borderTopColor: theme.navigationColors.tabBarBorder,
        },
        tabBarLabelStyle: {
          fontFamily: 'Oxanium-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: theme.navigationColors.headerBackground,
        },
        headerTintColor: theme.navigationColors.headerTint,
        headerTitleStyle: {
          fontFamily: 'Oxanium-SemiBold',
          fontSize: 18,
        },
      }}>
      <Tab.Screen
        name="Nomadsoft"
        component={NomadsoftScreen}
        options={{
          title: 'Nomadsoft',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
              <ThemeToggle size={20} />
              <HeaderButton onPress={() => navigation.navigate('TabNavigator' as never)} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          title: 'Posts',
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-outline" color={color} />,
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              <ThemeToggle size={20} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="skull-outline" color={color} />,
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              <ThemeToggle size={20} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
