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
import { getThemeStyles } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthScreenNavigationProp = StackNavigationProp<any, 'Auth'>;

interface AuthScreenProps {
  navigation: AuthScreenNavigationProp;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { checkSession } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const themeStyles = getThemeStyles(isDarkMode);

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
    <SafeAreaView className={`flex-1 ${themeStyles.background.primary}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="flex-1">
          <View className="flex-1 justify-center px-6">
            <View className="mb-8">
              <Text className={`mb-2 text-center text-3xl font-bold ${themeStyles.text.primary}`}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Text>
              <Text className={`text-center text-base ${themeStyles.text.secondary}`}>
                {isSignUp
                  ? 'Sign up to get started with Nomadsoft'
                  : 'Sign in to continue to Nomadsoft'}
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className={`mb-2 text-sm font-medium ${themeStyles.text.primary}`}>
                  Email
                </Text>
                <TextInput
                  className={`rounded-2xl px-4 py-3 text-base ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-gray-100'
                      : 'border-gray-200 bg-gray-100 text-gray-900'
                  } border`}
                  placeholder="Enter your email"
                  placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className={`mb-2 text-sm font-medium ${themeStyles.text.primary}`}>
                  Password
                </Text>
                <TextInput
                  className={`rounded-2xl px-4 py-3 text-base ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-gray-100'
                      : 'border-gray-200 bg-gray-100 text-gray-900'
                  } border`}
                  placeholder="Enter your password"
                  placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {isSignUp && (
                <View>
                  <Text className={`mb-2 text-sm font-medium ${themeStyles.text.primary}`}>
                    Confirm Password
                  </Text>
                  <TextInput
                    className={`rounded-2xl px-4 py-3 text-base ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-gray-100'
                        : 'border-gray-200 bg-gray-100 text-gray-900'
                    } border`}
                    placeholder="Confirm your password"
                    placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              )}

              <TouchableOpacity
                className={`mt-4 rounded-2xl py-4 ${
                  isLoading ? 'opacity-50' : ''
                } ${isDarkMode ? 'bg-purple-600' : 'bg-indigo-600'}`}
                onPress={handleAuth}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center text-base font-semibold text-white">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>

              <View className="mt-6 flex-row justify-center">
                <Text className={themeStyles.text.secondary}>
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
                    className={`font-semibold ${
                      isDarkMode ? 'text-purple-400' : 'text-indigo-600'
                    }`}>
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
