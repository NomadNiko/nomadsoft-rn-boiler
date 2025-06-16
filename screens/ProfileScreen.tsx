import React from 'react';
import { View, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getThemeStyles, layout, components } from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import authService from '../services/authService';
import postsService from '../services/postsService';
import {
  ScreenScroll,
  ProfileCard,
  Card,
  H4,
  BodyText,
  LabelText,
  Row,
  ListItem,
  Badge,
  Divider,
  ErrorText,
  Input,
  PrimaryButton,
  OutlineButton,
} from '../components/styled';

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const { signOut, user, updateUser, refreshUserData, socialStats, refreshSocialStats } = useAuth();
  const theme = getThemeStyles(isDark);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = React.useState(false);
  const [isEditExpanded, setIsEditExpanded] = React.useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isPrivacyExpanded, setIsPrivacyExpanded] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = React.useState(false);
  const [userPosts, setUserPosts] = React.useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });
  const [errors, setErrors] = React.useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
  }>({});

  // Sync form data with user data
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Refresh social stats, privacy status, and posts when profile screen becomes visible
  React.useEffect(() => {
    if (user) {
      // Refresh social stats in the background to get latest data
      refreshSocialStats();
      // Fetch privacy status
      fetchPrivacyStatus();
      // Fetch user posts
      fetchUserPosts();
    }
  }, [user]);

  const fetchPrivacyStatus = async () => {
    try {
      const hidden = await authService.getHiddenStatus();
      setIsHidden(hidden);
    } catch (error) {
      console.error('Failed to fetch privacy status:', error);
    }
  };

  const handlePrivacyToggle = async () => {
    setIsUpdatingPrivacy(true);
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
      setIsUpdatingPrivacy(false);
    }
  };

  const fetchUserPosts = async () => {
    if (!user?.id) return;
    
    setLoadingPosts(true);
    try {
      const posts = await postsService.getPosts('mine');
      setUserPosts(posts);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderPost = (post: any, index: number) => (
    <Card key={post.id} className="mb-3">
      <View className="p-4">
        <H4 className="mb-2">{post.name}</H4>
        <BodyText className={`${theme.colors.text.secondary} mb-2`} numberOfLines={3}>
          {post.content}
        </BodyText>
        
        {post.images && post.images.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-3">
            {post.images.slice(0, 3).map((image: any, imgIndex: number) => (
              <Image
                key={imgIndex}
                source={{ uri: image.path }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
              />
            ))}
            {post.images.length > 3 && (
              <View className="w-20 h-20 rounded-lg bg-gray-200 items-center justify-center">
                <BodyText className="text-gray-600 text-xs">
                  +{post.images.length - 3}
                </BodyText>
              </View>
            )}
          </View>
        )}
        
        <Row className="justify-between items-center">
          <BodyText className={`text-xs ${theme.colors.text.secondary}`}>
            {formatDate(post.createdAt)}
          </BodyText>
          <BodyText className={`text-xs ${theme.colors.text.secondary}`}>
            {post.comments?.length || 0} comments
          </BodyText>
        </Row>
      </View>
    </Card>
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUserData();
      await refreshSocialStats();
    } catch (error) {
      console.error('Manual refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate username (optional but if provided, must meet criteria)
    if (formData.username.trim()) {
      if (formData.username.trim().length < 3) {
        newErrors.username = 'Username must be at least 3 characters long';
      } else if (formData.username.trim().length > 20) {
        newErrors.username = 'Username must be no more than 20 characters long';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username.trim())) {
        newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdatingProfile(true);

      // Prepare update data - only include non-empty values
      const updateData: any = {};
      if (formData.firstName.trim()) updateData.firstName = formData.firstName.trim();
      if (formData.lastName.trim()) updateData.lastName = formData.lastName.trim();
      if (formData.email.trim()) updateData.email = formData.email.trim();
      if (formData.username.trim()) updateData.username = formData.username.trim();

      console.log('Updating profile with data:', updateData);

      const updatedUser = await authService.updateProfile(updateData);
      updateUser(updatedUser);

      // Collapse the form and show success
      setIsEditExpanded(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
      });
    }
    setErrors({});
    setIsEditExpanded(false);
  };

  const profileStats = [
    { label: 'Posts', value: socialStats.postsCount.toString(), icon: 'document-text-outline' },
    { label: 'Comments', value: socialStats.commentsCount.toString(), icon: 'chatbubble-outline' },
    { label: 'Friends', value: socialStats.friendsCount.toString(), icon: 'people-outline' },
  ];

  const profileItems = [
    { title: 'Edit Profile', icon: 'person-outline' },
    { title: 'Settings', icon: 'settings-outline' },
    { title: 'Notifications', icon: 'notifications-outline' },
    { title: 'Privacy', icon: 'lock-closed-outline' },
    { title: 'Help & Support', icon: 'help-circle-outline' },
    { title: 'Sign Out', icon: 'log-out-outline', isError: true },
  ];

  const handlePhotoEdit = async () => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos.');
        return;
      }

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
    try {
      setIsUpdatingPhoto(true);

      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant camera permission.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Resize image to 512x512 and convert to JPEG
        console.log('Resizing image from:', asset.width, 'x', asset.height);
        const resizedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [
            {
              resize: {
                width: 512,
                height: 512,
              },
            },
          ],
          {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        console.log('Resized image to:', resizedImage.width, 'x', resizedImage.height);

        // Upload resized file to backend
        const fileData = {
          uri: resizedImage.uri,
          name: asset.fileName || `profile-${Date.now()}.jpg`,
          type: 'image/jpeg',
        };

        console.log('Uploading file:', fileData);
        const uploadedFile = await authService.uploadFile(fileData);
        console.log('File uploaded:', uploadedFile);

        // Update user profile with new photo
        const updatedUser = await authService.updateProfile({
          photo: uploadedFile,
        });
        console.log('Profile updated:', updatedUser);

        // Update user in context directly without triggering navigation
        updateUser(updatedUser);

        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to update profile photo. Please try again.');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsUpdatingPhoto(true);

      // Update profile with null photo
      const updatedUser = await authService.updateProfile({ photo: null });

      // Update user in context directly without triggering navigation
      updateUser(updatedUser);

      Alert.alert('Success', 'Profile photo removed successfully!');
    } catch (error) {
      console.error('Remove photo error:', error);
      Alert.alert('Error', 'Failed to remove profile photo. Please try again.');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleItemPress = async (item: { title: string }) => {
    if (item.title === 'Sign Out') {
      signOut();
    } else if (item.title === 'Edit Profile') {
      if (!isEditExpanded) {
        // Refresh user data from server before opening edit form
        console.log('Edit Profile clicked - refreshing user data from server');
        try {
          await refreshUserData();
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      }
      setIsEditExpanded(!isEditExpanded);
      // Close privacy section if it's open
      if (isPrivacyExpanded) {
        setIsPrivacyExpanded(false);
      }
    } else if (item.title === 'Privacy') {
      setIsPrivacyExpanded(!isPrivacyExpanded);
      // Close edit section if it's open
      if (isEditExpanded) {
        setIsEditExpanded(false);
      }
    }
    // Handle other items here as needed
  };

  return (
    <ScreenScroll
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={theme.iconColors.primary}
          colors={[theme.iconColors.primary]}
        />
      }>
      <View className={components.responsive.cardContainer}>
        {/* Profile Header Card */}
        <ProfileCard>
          <TouchableOpacity
            onPress={handlePhotoEdit}
            disabled={isUpdatingPhoto}
            className="relative">
            {user?.photo?.path ? (
              <View className={`${components.image.profileWrapper} ${components.utils.p1}`}>
                <Image
                  source={{ uri: user.photo.path }}
                  className={components.image.profile}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View
                className={`${theme.colors.background.tertiary} ${components.image.profileWrapper} ${components.utils.p1}`}>
                <Image
                  source={require('../assets/nomadsoft-black-centered.png')}
                  className={components.image.profile}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Edit Overlay */}
            <View className="absolute bottom-0 right-0">
              <View className={`rounded-full p-2 ${isDark ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                {isUpdatingPhoto ? (
                  <View className="h-4 w-4">
                    <View className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </View>
                ) : (
                  <Ionicons name="camera" size={16} color="white" />
                )}
              </View>
            </View>
          </TouchableOpacity>
          <BodyText className={`text-lg font-medium ${theme.colors.text.primary}`}>
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.username
                ? user.username
                : 'User'}
          </BodyText>
          <BodyText className={`text-sm ${theme.colors.text.secondary}`}>
            {user?.email || 'user@example.com'}
          </BodyText>
          {user?.username && user?.firstName && user?.lastName && (
            <BodyText
              className={`${components.spacing.mb6} text-xs ${theme.colors.text.secondary} opacity-75`}>
              @{user.username}
            </BodyText>
          )}
          {!user?.username && <View className={components.spacing.mb6} />}

          {/* Stats */}
          <View className={`${components.utils.wFull} ${layout.flex.row} ${layout.flex.around}`}>
            {profileStats.map((stat, index) => (
              <View key={index} className={components.utils.itemsCenter}>
                <Ionicons name={stat.icon as any} size={24} color={theme.iconColors.primary} />
                <H4 className={components.spacing.mt2}>{stat.value}</H4>
                <LabelText>{stat.label}</LabelText>
              </View>
            ))}
          </View>
        </ProfileCard>

        {/* Profile Options */}
        <Card>
          {profileItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <ListItem>
                  <Row className={components.utils.itemsCenter}>
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={item.isError ? theme.iconColors.error : theme.iconColors.primary}
                    />
                    {item.isError ? (
                      <ErrorText className={components.spacing.ml3}>{item.title}</ErrorText>
                    ) : (
                      <BodyText
                        className={`${components.spacing.ml3} ${theme.colors.text.primary}`}>
                        {item.title}
                      </BodyText>
                    )}
                  </Row>
                  <Ionicons
                    name={
                      (item.title === 'Edit Profile' && isEditExpanded) ||
                      (item.title === 'Privacy' && isPrivacyExpanded)
                        ? 'chevron-down'
                        : 'chevron-forward'
                    }
                    size={20}
                    color={theme.iconColors.secondary}
                  />
                </ListItem>
              </TouchableOpacity>

              {/* Expandable Edit Profile Form */}
              {item.title === 'Edit Profile' && isEditExpanded && (
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
                    <BodyText
                      className={`${components.spacing.mt1} text-xs ${theme.colors.text.secondary}`}>
                      Optional - this will be displayed as @{formData.username || 'username'}
                    </BodyText>
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
                    {errors.email && (
                      <ErrorText className={components.spacing.mt1}>{errors.email}</ErrorText>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <Row className={components.spacing.gap3}>
                    <View className="flex-1">
                      <OutlineButton onPress={handleCancelEdit} disabled={isUpdatingProfile}>
                        Cancel
                      </OutlineButton>
                    </View>
                    <View className="flex-1">
                      <PrimaryButton onPress={handleSaveProfile} disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                      </PrimaryButton>
                    </View>
                  </Row>
                </View>
              )}

              {/* Expandable Privacy Section */}
              {item.title === 'Privacy' && isPrivacyExpanded && (
                <View className={components.spacing.p4}>
                  <View className={components.spacing.mb4}>
                    <LabelText className={components.spacing.mb3}>Post Visibility</LabelText>
                    <BodyText className={`${theme.colors.text.secondary} text-sm ${components.spacing.mb3}`}>
                      Control who can see your posts in the main feed. When enabled, only your friends can see your posts.
                    </BodyText>
                    
                    <TouchableOpacity
                      onPress={handlePrivacyToggle}
                      disabled={isUpdatingPrivacy}
                      className={`flex-row items-center justify-between p-4 rounded-lg border ${
                        isHidden ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      } ${isDark ? 'bg-opacity-20' : ''}`}
                    >
                      <View className="flex-1">
                        <BodyText className={`font-medium ${theme.colors.text.primary}`}>
                          Hide from All Users feed
                        </BodyText>
                        <BodyText className={`text-sm ${theme.colors.text.secondary} mt-1`}>
                          {isHidden 
                            ? 'Your posts are only visible to friends' 
                            : 'Your posts are visible to everyone'
                          }
                        </BodyText>
                      </View>
                      
                      {isUpdatingPrivacy ? (
                        <View className="h-6 w-6 ml-3">
                          <View className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        </View>
                      ) : (
                        <View className={`w-6 h-6 rounded border-2 ml-3 items-center justify-center ${
                          isHidden 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {isHidden && (
                            <Ionicons name="checkmark" size={16} color="white" />
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {index < profileItems.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        {/* User Posts */}
        <View className="mb-6">
          <Row className="justify-between items-center mb-4">
            <H4>My Posts ({userPosts.length})</H4>
            {loadingPosts && (
              <View className="h-4 w-4">
                <View className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              </View>
            )}
          </Row>
          
          {userPosts.length > 0 ? (
            <View>
              {userPosts.map((post, index) => renderPost(post, index))}
            </View>
          ) : (
            <Card>
              <View className="p-8 items-center">
                <BodyText className={`text-center ${theme.colors.text.secondary}`}>
                  {loadingPosts ? 'Loading your posts...' : "You haven't posted anything yet"}
                </BodyText>
              </View>
            </Card>
          )}
        </View>
      </View>
    </ScreenScroll>
  );
}
