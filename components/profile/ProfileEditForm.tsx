import React from 'react';
import { View, Alert } from 'react-native';
import { LabelText, ErrorText, Input, Row, OutlineButton, PrimaryButton } from '../styled';
import { components, getThemeStyles } from '../../styles/globalStyles';
import { useTheme } from '../../contexts/ThemeContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import authService from '../../services/authService';
import { User, ProfileFormData } from '../../types';

interface ProfileEditFormProps {
  user: User | null;
  onUserUpdate: (updatedUser: User) => void;
  onCancel: () => void;
  isVisible: boolean;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onUserUpdate,
  onCancel,
  isVisible,
}) => {
  const { isDark } = useTheme();
  const themeStyles = getThemeStyles(isDark);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const initialFormData: ProfileFormData = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
  };

  const { formData, errors, validateForm, handleInputChange, resetForm } =
    useFormValidation(initialFormData);

  // Update form when user data changes
  React.useEffect(() => {
    if (user) {
      resetForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user, resetForm]);

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);

      // Prepare update data - only include non-empty values
      const updateData: any = {};
      if (formData.firstName.trim()) updateData.firstName = formData.firstName.trim();
      if (formData.lastName.trim()) updateData.lastName = formData.lastName.trim();
      if (formData.email.trim()) updateData.email = formData.email.trim();
      if (formData.username.trim()) updateData.username = formData.username.trim();

      console.log('Updating profile with data:', updateData);

      const updatedUser = await authService.updateProfile(updateData);
      onUserUpdate(updatedUser);

      Alert.alert('Success', 'Profile updated successfully!');
      onCancel(); // Close the form
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to user data
    if (user) {
      resetForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
      });
    }
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <View className={components.spacing.p4}>
      {/* First Name */}
      <View className={components.spacing.mb4}>
        <LabelText className={components.spacing.mb2}>First Name *</LabelText>
        <Input
          value={formData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
          placeholder="Enter your first name"
          autoCapitalize="words"
        />
        {errors.firstName && (
          <ErrorText className={components.spacing.mt1}>{errors.firstName}</ErrorText>
        )}
      </View>

      {/* Last Name */}
      <View className={components.spacing.mb4}>
        <LabelText className={components.spacing.mb2}>Last Name *</LabelText>
        <Input
          value={formData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
          placeholder="Enter your last name"
          autoCapitalize="words"
        />
        {errors.lastName && (
          <ErrorText className={components.spacing.mt1}>{errors.lastName}</ErrorText>
        )}
      </View>

      {/* Username */}
      <View className={components.spacing.mb4}>
        <LabelText className={components.spacing.mb2}>Username</LabelText>
        <Input
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
          placeholder="Enter a username"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.username && (
          <ErrorText className={components.spacing.mt1}>{errors.username}</ErrorText>
        )}
        <LabelText
          className={`${components.spacing.mt1} text-xs ${themeStyles.colors.text.secondary}`}>
          Optional - this will be displayed as @{formData.username || 'username'}
        </LabelText>
      </View>

      {/* Email */}
      <View className={components.spacing.mb4}>
        <LabelText className={components.spacing.mb2}>Email Address *</LabelText>
        <Input
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="Enter your email address"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        {errors.email && <ErrorText className={components.spacing.mt1}>{errors.email}</ErrorText>}
      </View>

      {/* Action Buttons */}
      <Row className={components.spacing.gap3}>
        <View className="flex-1">
          <OutlineButton onPress={handleCancel} disabled={isUpdating}>
            Cancel
          </OutlineButton>
        </View>
        <View className="flex-1">
          <PrimaryButton onPress={handleSave} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </PrimaryButton>
        </View>
      </Row>
    </View>
  );
};
