import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeStyles } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemeToggle from '../components/ThemeToggle';
import { Ionicons } from '@expo/vector-icons';

type AuthScreenNavigationProp = StackNavigationProp<any, 'Auth'>;

interface AuthScreenProps {
  navigation: AuthScreenNavigationProp;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { checkSession } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const themeStyles = getThemeStyles(isDark);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      console.log('AuthScreen: Starting auth process, isSignUp:', isSignUp);
      if (isSignUp) {
        console.log('AuthScreen: Calling signUp');
        const response = await authService.signUp(email, password);
        console.log('AuthScreen: SignUp response:', response);

        if (response.status === 'OK') {
          console.log('AuthScreen: SignUp successful, checking session');
          await checkSession();
          console.log('AuthScreen: Session check completed');
          // The auth screen will be automatically replaced by the navigation logic
        } else if (response.status === 'FIELD_ERROR') {
          const errors =
            response.formFields?.map((field: any) => field.error).join('\n') ||
            'Please check your email and password';
          Alert.alert('Sign Up Error', errors);
        } else if (response.status === 'SIGN_UP_NOT_ALLOWED') {
          Alert.alert('Error', response.reason || 'Sign up not allowed');
        } else {
          Alert.alert('Error', 'Sign up failed. Please try again.');
        }
      } else {
        console.log('AuthScreen: Calling signIn');
        const response = await authService.signIn(email, password);
        console.log('AuthScreen: SignIn response:', response);

        if (response.status === 'OK') {
          console.log('AuthScreen: SignIn successful, checking session');
          await checkSession();
          console.log('AuthScreen: Session check completed');
          // The auth screen will be automatically replaced by the navigation logic
        } else if (response.status === 'FIELD_ERROR') {
          const errors =
            response.formFields?.map((field: any) => field.error).join('\n') ||
            'Please check your email and password';
          Alert.alert('Sign In Error', errors);
        } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
          Alert.alert('Error', 'Invalid email or password');
        } else if (response.status === 'SIGN_IN_NOT_ALLOWED') {
          Alert.alert('Error', response.reason || 'Sign in not allowed');
        } else {
          Alert.alert('Error', 'Sign in failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.colors.background.primary}`}>
      {/* Theme Toggle Button */}
      <View className="absolute right-4 top-12 z-10">
        <ThemeToggle size={28} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="flex-1">
          <View className="flex-1 justify-center px-6">
            <View className="mb-8">
              <Text
                className={`mb-2 text-center font-oxanium-bold text-3xl ${themeStyles.colors.text.primary}`}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Text>
              <Text
                className={`text-center font-oxanium-regular text-base ${themeStyles.colors.text.secondary}`}>
                {isSignUp
                  ? 'Sign up to get started with Nomadsoft'
                  : 'Sign in to continue to Nomadsoft'}
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text
                  className={`mb-2 font-oxanium-medium text-sm ${themeStyles.colors.text.primary}`}>
                  Email
                </Text>
                <TextInput
                  className={`rounded-2xl px-4 py-4 text-base leading-6 ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-gray-100'
                      : 'border-gray-200 bg-gray-100 text-gray-900'
                  } border`}
                  style={{ minHeight: 50, fontFamily: 'Oxanium-Regular' }}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text
                  className={`mb-2 font-oxanium-medium text-sm ${themeStyles.colors.text.primary}`}>
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className={`rounded-2xl px-4 py-4 pr-12 text-base leading-6 ${
                      isDark
                        ? 'border-gray-600 bg-gray-700 text-gray-100'
                        : 'border-gray-200 bg-gray-100 text-gray-900'
                    } border`}
                    style={{ minHeight: 50, fontFamily: 'Oxanium-Regular' }}
                    placeholder="Enter your password"
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ top: '50%', marginTop: -12 }}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {isSignUp && (
                <View>
                  <Text
                    className={`mb-2 font-oxanium-medium text-sm ${themeStyles.colors.text.primary}`}>
                    Confirm Password
                  </Text>
                  <View className="relative">
                    <TextInput
                      className={`rounded-2xl px-4 py-4 pr-12 text-base leading-6 ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-100'
                          : 'border-gray-200 bg-gray-100 text-gray-900'
                      } border`}
                      style={{ minHeight: 50 }}
                      placeholder="Confirm your password"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ top: '50%', marginTop: -12 }}>
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color={isDark ? '#9CA3AF' : '#6B7280'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity
                className={`mt-4 rounded-2xl py-4 ${
                  isLoading ? 'opacity-50' : ''
                } ${isDark ? 'bg-purple-600' : 'bg-indigo-600'}`}
                onPress={handleAuth}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center font-oxanium-semibold text-base text-white">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>

              <View className="mt-6 flex-row justify-center">
                <Text className={`font-oxanium-regular ${themeStyles.colors.text.secondary}`}>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsSignUp(!isSignUp);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}>
                  <Text
                    className={`font-oxanium-semibold ${isDark ? 'text-purple-400' : 'text-indigo-600'}`}>
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
