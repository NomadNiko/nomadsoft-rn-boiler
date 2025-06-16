import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, H4, BodyText, Input } from '../styled';
import { components, getThemeStyles } from '../../styles/globalStyles';
import { useTheme } from '../../contexts/ThemeContext';
import { useImagePicker } from '../../hooks/useImagePicker';
import postsService from '../../services/postsService';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onPostCreated,
}) => {
  const { isDark } = useTheme();
  const themeStyles = getThemeStyles(isDark);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { isUploading, showImagePicker } = useImagePicker({
    onSuccess: (fileId, uri) => {
      setSelectedImageId(fileId);
      setSelectedImage(uri);
    },
  });

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedImage(null);
    setSelectedImageId(null);
    onClose();
  };

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setIsCreating(true);
    try {
      const images = selectedImageId
        ? [{ id: selectedImageId, path: selectedImage || '' }]
        : undefined;

      await postsService.createPost(title.trim(), content.trim(), images);

      handleClose();
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsCreating(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setSelectedImageId(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <Screen>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'ios' ? 20 : 0 }}>
            <View className={components.responsive.formContainer}>
              <View className="mb-6 flex-row items-center justify-between pt-2">
                <TouchableOpacity onPress={handleClose} className="p-2">
                  <Ionicons name="close" size={24} color={themeStyles.iconColors.close} />
                </TouchableOpacity>
                <H4>Create New Post</H4>
                <View className="w-8" />
              </View>

              <Card>
                <View className="p-4">
                  <BodyText className="mb-2 font-semibold">Title</BodyText>
                  <Input
                    placeholder="Enter post title..."
                    value={title}
                    onChangeText={setTitle}
                    className="mb-4"
                  />

                  <BodyText className="mb-2 font-semibold">Content</BodyText>
                  <Input
                    placeholder="What's on your mind?"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={6}
                    className="mb-4"
                  />

                  <BodyText className="mb-2 font-semibold">Image (Optional)</BodyText>
                  {selectedImage ? (
                    <View className="mb-4">
                      <Image
                        source={{ uri: selectedImage }}
                        className="mb-2 aspect-square w-full rounded-lg"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={removeImage}
                        className="self-start rounded-lg bg-red-500 px-3 py-2">
                        <BodyText className="text-sm text-white">Remove Image</BodyText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={showImagePicker}
                      disabled={isUploading}
                      className={`mb-4 items-center rounded-lg border-2 border-dashed border-gray-300 p-6 ${
                        isUploading ? 'opacity-50' : ''
                      }`}>
                      <BodyText className="text-center text-gray-500">
                        {isUploading ? 'Uploading...' : 'Tap to add image'}
                      </BodyText>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={handleCreate}
                    disabled={isCreating || !title.trim() || !content.trim()}
                    className={`rounded-lg py-3 ${
                      isCreating || !title.trim() || !content.trim() ? 'bg-gray-300' : 'bg-blue-500'
                    }`}>
                    <BodyText
                      className={`text-center font-semibold ${
                        isCreating || !title.trim() || !content.trim()
                          ? 'text-gray-500'
                          : 'text-white'
                      }`}>
                      {isCreating ? 'Creating...' : 'Create Post'}
                    </BodyText>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    </Modal>
  );
};
