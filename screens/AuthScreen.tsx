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
import { getThemeStyles, components } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const themeStyles = getThemeStyles(isDark);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp) {
      if (!firstName || !lastName || !username) {
        Alert.alert('Error', 'Please fill in your first name, last name, and username');
        return;
      }
      
      // Validate username
      const trimmedUsername = username.trim();
      if (trimmedUsername.length < 3) {
        Alert.alert('Error', 'Username must be at least 3 characters long');
        return;
      }
      if (trimmedUsername.length > 20) {
        Alert.alert('Error', 'Username must be no more than 20 characters long');
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
        Alert.alert('Error', 'Username can only contain letters, numbers, underscores, and hyphens');
        return;
      }
      
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }

    setIsLoading(true);

    try {
      console.log('AuthScreen: Starting auth process, isSignUp:', isSignUp);
      if (isSignUp) {
        console.log('AuthScreen: Calling register');
        try {
          await authService.register(email.trim(), password, firstName.trim(), lastName.trim(), username.trim());
          console.log('AuthScreen: Registration successful, attempting auto-login');
          
          // Auto-login after successful registration (following Mantine boilerplate pattern)
          const loginResponse = await authService.login(email.trim(), password);
          console.log('AuthScreen: Auto-login after registration successful:', loginResponse);
          
          if (loginResponse.token) {
            console.log('AuthScreen: Auto-login successful, checking session');
            await checkSession();
            console.log('AuthScreen: Session check completed');
          } else {
            // If auto-login fails, show success message and switch to sign in
            Alert.alert(
              'Success',
              'Account created successfully! Please sign in to continue.',
              [{ text: 'OK', onPress: () => setIsSignUp(false) }]
            );
          }
        } catch (registerError) {
          console.log('Registration failed:', registerError);
          throw registerError;
        }
      } else {
        console.log('AuthScreen: Calling login');
        const response = await authService.login(email.trim(), password);
        console.log('AuthScreen: Login response:', response);

        if (response.token) {
          console.log('AuthScreen: Login successful, checking session');
          await checkSession();
          console.log('AuthScreen: Session check completed');
          // The auth screen will be automatically replaced by the navigation logic
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      console.log('AuthScreen: Starting Google auth process');

      // For Expo Go, we'll show a message about Google Sign-In limitations
      Alert.alert(
        'Google Sign-In',
        'Google Sign-In works in production builds but has limitations in Expo Go. You can test with email/password login using:\n\nEmail: aloha@ixplor.app\nPassword: password',
        [{ text: 'OK' }]
      );

      // In production, you would:
      // 1. Configure Google Sign-In
      // 2. Get the idToken
      // 3. Send it to your backend

      // Example implementation (for production):
      /*
      import { GoogleSignin } from '@react-native-google-signin/google-signin';
      
      GoogleSignin.configure({
        webClientId: GOOGLE_SIGN_IN_CONFIG.webClientId,
      });
      
      const { idToken } = await GoogleSignin.signIn();
      const response = await authService.googleLogin(idToken);
      
      if (response.token) {
        await checkSession();
      }
      */
    } catch (error) {
      console.error('Google auth error:', error);
      Alert.alert('Error', 'An unexpected error occurred during Google authentication');
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
          <View className="flex-1 justify-center">
            <View className={components.responsive.formContainer}>
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
              {isSignUp && (
                <>
                  <View>
                    <Text
                      className={`mb-2 font-oxanium-medium text-sm ${themeStyles.colors.text.primary}`}>
                      First Name
                    </Text>
                    <TextInput
                      className={`rounded-2xl px-4 py-4 text-base leading-6 ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-100'
                          : 'border-gray-200 bg-gray-100 text-gray-900'
                      } border`}
                      style={{ minHeight: 50, fontFamily: 'Oxanium-Regular' }}
                      placeholder="Enter your first name"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>

                  <View>
                    <Text
                      className={`mb-2 font-oxanium-medium text-sm ${themeStyles.colors.text.primary}`}>
                      Last Name
                    </Text>
                    <TextInput
                      className={`rounded-2xl px-4 py-4 text-base leading-6 ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-100'
                          : 'border-gray-200 bg-gray-100 text-gray-900'
                      } border`}
                      style={{ minHeight: 50, fontFamily: 'Oxanium-Regular' }}
                      placeholder="Enter your last name"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>

                  <View>
                    <Text
                      className={`mb-2 font-oxanium-medium text-sm ${themeStyles.colors.text.primary}`}>
                      Username
                    </Text>
                    <TextInput
                      className={`rounded-2xl px-4 py-4 text-base leading-6 ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-100'
                          : 'border-gray-200 bg-gray-100 text-gray-900'
                      } border`}
                      style={{ minHeight: 50, fontFamily: 'Oxanium-Regular' }}
                      placeholder="Enter your username"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </>
              )}

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
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    passwordRules=""
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
                      autoCorrect={false}
                      autoComplete="off"
                      textContentType="none"
                      passwordRules=""
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

              {/* Divider */}
              <View className="my-6 flex-row items-center">
                <View className={`h-px flex-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                <Text
                  className={`mx-4 font-oxanium-regular text-sm ${themeStyles.colors.text.secondary}`}>
                  or
                </Text>
                <View className={`h-px flex-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity
                className={`flex-row items-center justify-center rounded-2xl py-4 ${
                  isLoading ? 'opacity-50' : ''
                } ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} border`}
                onPress={handleGoogleAuth}
                disabled={isLoading}>
                <View className="mr-3">
                  <Text className="text-xl">🔍</Text>
                </View>
                <Text
                  className={`font-oxanium-semibold text-base ${themeStyles.colors.text.primary}`}>
                  Continue with Google
                </Text>
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
                    setFirstName('');
                    setLastName('');
                    setUsername('');
                  }}>
                  <Text
                    className={`font-oxanium-semibold ${isDark ? 'text-purple-400' : 'text-indigo-600'}`}>
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
