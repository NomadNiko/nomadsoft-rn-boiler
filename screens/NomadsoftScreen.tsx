import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function NomadsoftScreen() {
  const { isDark } = useTheme();

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <View className="items-center p-6">
        <Image
          source={require('../assets/nomadsoft-black-centered.png')}
          className="mb-6 h-64 w-64 rounded-2xl"
          resizeMode="contain"
        />
        <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Nomadsoft
        </Text>
        <View className={`h-[1px] w-32 my-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          For Nomads, By Nomads
        </Text>
      </View>

      <View className="mt-8 gap-4">
        <TouchableOpacity 
          onPress={() => {}}
          className="px-6 py-3 rounded-2xl bg-indigo-600 items-center">
          <Text className="font-semibold text-white text-center">Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {}}
          className={`px-6 py-3 rounded-2xl border-2 items-center ${
            isDark ? 'border-purple-400' : 'border-purple-600'
          }`}>
          <Text className={`text-center font-semibold ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}