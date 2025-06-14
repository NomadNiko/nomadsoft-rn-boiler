import { StatusBar } from 'expo-status-bar';
import { Pressable, TextInput, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function NomadsoftTestPopup() {
  const { isDark } = useTheme();
  const navigation = useNavigation();

  return (
    <>
      <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="px-4 py-6">
          {/* Modal Card */}
          <View className={`rounded-3xl shadow-2xl mt-20 p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Nomadsoft Modal
              </Text>
              <Pressable
                onPress={() => navigation.goBack()}
                className={`rounded-xl p-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <Ionicons name="close" size={24} color={isDark ? '#E5E7EB' : '#4B5563'} />
              </Pressable>
            </View>

            {/* Content */}
            <View className="space-y-4">
              <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                This is a beautiful modal demonstrating our new design system with
                support for dark and light modes.
              </Text>

              {/* Input Examples */}
              <View className="mt-4">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Default Input
                </Text>
                <TextInput
                  placeholder="Enter your name"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  className={`px-4 py-3 rounded-2xl ${
                    isDark 
                      ? 'bg-gray-700 border-2 border-gray-600 text-gray-100' 
                      : 'bg-white border-2 border-gray-200 text-gray-900'
                  }`}
                />
              </View>

              <View className="mt-4">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Filled Input
                </Text>
                <TextInput
                  placeholder="Enter email"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  className={`px-4 py-3 rounded-2xl ${
                    isDark 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-gray-100 text-gray-900'
                  }`}
                />
              </View>

              {/* Color Palette Preview */}
              <View className="mt-4">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Color Palette
                </Text>
                <View className="mb-2 flex-row gap-2">
                  <View className="h-10 w-10 rounded-lg bg-indigo-100" />
                  <View className="h-10 w-10 rounded-lg bg-indigo-300" />
                  <View className="h-10 w-10 rounded-lg bg-indigo-500" />
                  <View className="h-10 w-10 rounded-lg bg-indigo-700" />
                  <View className="h-10 w-10 rounded-lg bg-indigo-900" />
                </View>
                <View className="flex-row gap-2">
                  <View className="h-10 w-10 rounded-lg bg-purple-100" />
                  <View className="h-10 w-10 rounded-lg bg-purple-300" />
                  <View className="h-10 w-10 rounded-lg bg-purple-500" />
                  <View className="h-10 w-10 rounded-lg bg-purple-700" />
                  <View className="h-10 w-10 rounded-lg bg-purple-900" />
                </View>
              </View>

              {/* Buttons */}
              <View className="mt-6 flex-row gap-3">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className={`px-4 py-2 rounded-xl flex-1 border-2 items-center ${
                    isDark ? 'border-purple-400' : 'border-purple-600'
                  }`}>
                  <Text className={`text-center font-medium ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="px-4 py-2 rounded-xl flex-1 bg-indigo-600 items-center">
                  <Text className="font-semibold text-white text-center">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}