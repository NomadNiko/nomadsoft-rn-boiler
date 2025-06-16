import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import authService from '../services/authService';
import { FileUpload } from '../types';

interface UseImagePickerOptions {
  onSuccess?: (fileId: string, uri: string) => void;
  onError?: (error: string) => void;
  resize?: { width: number; height: number };
  quality?: number;
}

export const useImagePicker = (options: UseImagePickerOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    onSuccess,
    onError,
    resize = { width: 512, height: 512 },
    quality = 0.8
  } = options;

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your photos.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permission.');
      return false;
    }
    return true;
  };

  const processAndUploadImage = async (uri: string, fileName?: string): Promise<{ id: string; uri: string } | null> => {
    try {
      setIsUploading(true);

      // Resize image
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Upload to server
      const fileData: FileUpload = {
        uri: resizedImage.uri,
        name: fileName || `image-${Date.now()}.jpg`,
        type: 'image/jpeg',
      };

      const uploadedFile = await authService.uploadFile(fileData);
      
      const result = { id: uploadedFile.id, uri: resizedImage.uri };
      onSuccess?.(uploadedFile.id, resizedImage.uri);
      
      return result;
    } catch (error) {
      console.error('Image processing error:', error);
      const errorMessage = 'Failed to process image. Please try again.';
      onError?.(errorMessage);
      Alert.alert('Error', errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const pickFromLibrary = async (): Promise<{ id: string; uri: string } | null> => {
    if (!(await requestPermissions())) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return await processAndUploadImage(
        result.assets[0].uri, 
        result.assets[0].fileName || undefined
      );
    }
    return null;
  };

  const takePhoto = async (): Promise<{ id: string; uri: string } | null> => {
    if (!(await requestCameraPermissions())) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return await processAndUploadImage(
        result.assets[0].uri,
        result.assets[0].fileName || undefined
      );
    }
    return null;
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return {
    isUploading,
    pickFromLibrary,
    takePhoto,
    showImagePicker,
    processAndUploadImage,
  };
};