import { Text, View, Image, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { isDark } = useTheme();

  const profileStats = [
    { label: 'Projects', value: '12', icon: 'folder-outline' },
    { label: 'Clients', value: '8', icon: 'people-outline' },
    { label: 'Hours', value: '1.2k', icon: 'time-outline' },
  ];

  const profileItems = [
    { title: 'Edit Profile', icon: 'person-outline' },
    { title: 'Settings', icon: 'settings-outline' },
    { title: 'Notifications', icon: 'notifications-outline' },
    { title: 'Privacy', icon: 'lock-closed-outline' },
    { title: 'Help & Support', icon: 'help-circle-outline' },
    { title: 'Sign Out', icon: 'log-out-outline', isError: true },
  ];

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="px-4 py-6">
        {/* Profile Header Card */}
        <View className={`rounded-3xl p-6 mt-8 items-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
          <View className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'} mb-4 rounded-full p-1`}>
            <Image
              source={require('../assets/nomadsoft-black-centered.png')}
              className="h-32 w-32 rounded-full"
              resizeMode="contain"
            />
          </View>
          <Text className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-1`}>
            John Nomad
          </Text>
          <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            john@nomadsoft.us
          </Text>

          {/* Stats */}
          <View className="w-full flex-row justify-around">
            {profileStats.map((stat, index) => (
              <View key={index} className="items-center">
                <Ionicons
                  name={stat.icon as any}
                  size={24}
                  color={isDark ? '#A78BFA' : '#6366F1'}
                />
                <Text className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mt-2`}>
                  {stat.value}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Profile Options */}
        <View className={`rounded-2xl p-4 mt-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          {profileItems.map((item, index) => (
            <View key={index}>
              <View className="px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.isError ? '#EF4444' : (isDark ? '#A78BFA' : '#6366F1')}
                  />
                  <Text
                    className={`text-base ml-3 ${
                      item.isError 
                        ? 'text-red-600' 
                        : (isDark ? 'text-gray-100' : 'text-gray-900')
                    }`}>
                    {item.title}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={isDark ? '#6B7280' : '#9CA3AF'} 
                />
              </View>
              {index < profileItems.length - 1 && (
                <View className={`h-[1px] mx-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              )}
            </View>
          ))}
        </View>

        {/* Badge Examples */}
        <View className={`rounded-2xl p-4 mt-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <Text className={`text-lg font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-3`}>
            Status Badges
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="px-3 py-1 rounded-full bg-indigo-100">
              <Text className="text-indigo-700">Pro Member</Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-purple-100">
              <Text className="text-purple-700">Verified</Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-green-100">
              <Text className="text-green-700">Active</Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-yellow-100">
              <Text className="text-yellow-700">2 Pending</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}