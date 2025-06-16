import React from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BodyText } from '../styled';
import { useTheme } from '../../contexts/ThemeContext';
import { components } from '../../styles/globalStyles';
import { useImagePicker } from '../../hooks/useImagePicker';
import authService from '../../services/authService';
import { User } from '../../types';

interface ProfilePhotoSectionProps {
  user: User | null;
  onUserUpdate: (updatedUser: User) => void;
  isUpdating: boolean;
  setIsUpdating: (updating: boolean) => void;
}

export const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({
  user,
  onUserUpdate,
  isUpdating,
  setIsUpdating,
}) => {
  const { isDark } = useTheme();

  const { isUploading } = useImagePicker({
    onSuccess: async (fileId, uri) => {
      try {
        const updatedUser = await authService.updateProfile({
          photo: { id: fileId, path: uri },
        });
        onUserUpdate(updatedUser);
        Alert.alert('Success', 'Profile photo updated successfully!');
      } catch (error) {
        console.error('Profile update error:', error);
        Alert.alert('Error', 'Failed to update profile photo. Please try again.');
      }
    },
  });

  const handlePhotoEdit = async () => {
    try {
      // Show options: Take Photo, Choose from Library, Remove Photo
      Alert.alert('Update Profile Photo', 'Choose an option', [
        {
          text: 'Take Photo',
          onPress: () => handleImagePicker('camera'),
        },
        {
          text: 'Choose from Library',
          onPress: () => handleImagePicker('library'),
        },
        ...(user?.photo
          ? [
              {
                text: 'Remove Photo',
                onPress: () => handleRemovePhoto(),
                style: 'destructive' as const,
              },
            ]
          : []),
        {
          text: 'Cancel',
          style: 'cancel' as const,
        },
      ]);
    } catch (error) {
      console.error('Photo edit error:', error);
      Alert.alert('Error', 'Unable to update photo');
    }
  };

  const handleImagePicker = async (source: 'camera' | 'library') => {
    setIsUpdating(true);
    // The useImagePicker hook will handle the actual image picking and uploading
  };

  const handleRemovePhoto = async () => {
    try {
      setIsUpdating(true);

      // Update profile with null photo
      const updatedUser = await authService.updateProfile({ photo: null });
      onUserUpdate(updatedUser);

      Alert.alert('Success', 'Profile photo removed successfully!');
    } catch (error) {
      console.error('Remove photo error:', error);
      Alert.alert('Error', 'Failed to remove profile photo. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  React.useEffect(() => {
    setIsUpdating(isUploading);
  }, [isUploading, setIsUpdating]);

  return (
    <TouchableOpacity onPress={handlePhotoEdit} disabled={isUpdating} className="relative">
      {user?.photo?.path ? (
        <View className={`${components.image.profileWrapper} ${components.utils.p1}`}>
          <Image
            source={{ uri: user.photo.path }}
            className={components.image.profile}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View className={`bg-gray-200 ${components.image.profileWrapper} ${components.utils.p1}`}>
          <Image
            source={require('../../assets/nomadsoft-black-centered.png')}
            className={components.image.profile}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Edit Overlay */}
      <View className="absolute bottom-0 right-0">
        <View className={`rounded-full p-2 ${isDark ? 'bg-purple-600' : 'bg-indigo-600'}`}>
          {isUpdating ? (
            <View className="h-4 w-4">
              <View className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </View>
          ) : (
            <Ionicons name="camera" size={16} color="white" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
