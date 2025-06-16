import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LabelText, BodyText } from '../styled';
import { components, getThemeStyles } from '../../styles/globalStyles';
import { useTheme } from '../../contexts/ThemeContext';
import authService from '../../services/authService';

interface PrivacySectionProps {
  isVisible: boolean;
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
  isUpdating: boolean;
  setIsUpdating: (updating: boolean) => void;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({
  isVisible,
  isHidden,
  setIsHidden,
  isUpdating,
  setIsUpdating,
}) => {
  const { isDark } = useTheme();
  const themeStyles = getThemeStyles(isDark);

  const handlePrivacyToggle = async () => {
    setIsUpdating(true);
    try {
      const newHiddenStatus = !isHidden;
      const success = await authService.setHiddenStatus(newHiddenStatus);
      if (success) {
        setIsHidden(newHiddenStatus);
        Alert.alert(
          'Privacy Updated',
          newHiddenStatus
            ? 'Your posts are now hidden from All Users feed. Only friends can see your posts.'
            : 'Your posts are now visible in All Users feed.'
        );
      } else {
        Alert.alert('Error', 'Failed to update privacy settings. Please try again.');
      }
    } catch (error) {
      console.error('Privacy toggle error:', error);
      Alert.alert('Error', 'Failed to update privacy settings. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <View className={components.spacing.p4}>
      <View className={components.spacing.mb4}>
        <LabelText className={components.spacing.mb3}>Post Visibility</LabelText>
        <BodyText
          className={`${themeStyles.colors.text.secondary} text-sm ${components.spacing.mb3}`}>
          Control who can see your posts in the main feed. When enabled, only your friends can see
          your posts.
        </BodyText>

        <TouchableOpacity
          onPress={handlePrivacyToggle}
          disabled={isUpdating}
          className={`flex-row items-center justify-between rounded-lg border p-4 ${
            isHidden ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
          } ${isDark ? 'bg-opacity-20' : ''}`}>
          <View className="flex-1">
            <BodyText className={`font-medium ${themeStyles.colors.text.primary}`}>
              Hide from All Users feed
            </BodyText>
            <BodyText className={`text-sm ${themeStyles.colors.text.secondary} mt-1`}>
              {isHidden
                ? 'Your posts are only visible to friends'
                : 'Your posts are visible to everyone'}
            </BodyText>
          </View>

          {isUpdating ? (
            <View className="ml-3 h-6 w-6">
              <View className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </View>
          ) : (
            <View
              className={`ml-3 h-6 w-6 items-center justify-center rounded border-2 ${
                isHidden ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
              {isHidden && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
