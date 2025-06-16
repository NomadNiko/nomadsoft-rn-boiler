import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Modal, Alert, ScrollView, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, Card, H4, BodyText, Input, PrimaryButton } from '../components/styled';
import { components } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeStyles } from '../styles/globalStyles';
import authService from '../services/authService';
import postsService from '../services/postsService';
import UserProfileModal from '../components/UserProfileModal';

interface User {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photo?: {
    id: string;
    path: string;
  };
}

interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

interface PostImage {
  id: string;
  path: string;
}

interface Post {
  id: string;
  name: string;
  content: string;
  user: User;
  comments: Comment[];
  images: PostImage[];
  createdAt: string;
}

export default function PostsScreen() {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const themeStyles = getThemeStyles(isDark);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(20);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'mine'>('all');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [postToReopenAfterProfile, setPostToReopenAfterProfile] = useState<Post | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async (forceRefresh = false): Promise<void> => {
    console.log('PostsScreen: Fetching posts for tab:', activeTab, 'forceRefresh:', forceRefresh);
    
    if (!isAuthenticated) {
      console.log('PostsScreen: User not authenticated');
      setPosts([]);
      return;
    }

    try {
      if (!forceRefresh) {
        setLoading(true);
      }
      const data = await postsService.getPosts(activeTab, forceRefresh);
      setPosts(data);
      console.log(`PostsScreen: Loaded ${data.length} posts for '${activeTab}' tab`);
    } catch (error) {
      console.error('PostsScreen: Error fetching posts:', error);
      // Don't clear posts on error - keep showing cached data
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load saved tab preference on mount
  useEffect(() => {
    const loadTabPreference = async () => {
      try {
        const savedTab = await AsyncStorage.getItem('postsActiveTab');
        if (savedTab && ['all', 'friends', 'mine'].includes(savedTab)) {
          setActiveTab(savedTab as 'all' | 'friends' | 'mine');
        }
      } catch (error) {
        console.error('Failed to load tab preference:', error);
      }
    };
    
    loadTabPreference();
  }, []);

  // Save tab preference when it changes
  useEffect(() => {
    const saveTabPreference = async () => {
      try {
        await AsyncStorage.setItem('postsActiveTab', activeTab);
      } catch (error) {
        console.error('Failed to save tab preference:', error);
      }
    };
    
    saveTabPreference();
  }, [activeTab]);

  // Load posts when tab changes or user becomes authenticated
  useEffect(() => {
    console.log('PostsScreen: Tab changed to:', activeTab, 'authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      fetchPosts(); // Uses smart caching - shows cached data immediately if available
    }
  }, [isAuthenticated, activeTab]);

  // Refresh posts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('PostsScreen: Screen focused');
      
      if (isAuthenticated) {
        // Check for updates when screen is focused (background refresh)
        fetchPosts(true); // Force refresh to check for updates
      }
    }, [isAuthenticated, activeTab])
  );

  // Keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  const openPostModal = (post: Post) => {
    // Prevent opening if post modal is already open with the same post
    if (modalVisible && selectedPost?.id === post.id) {
      return;
    }
    
    // Close profile modal if it's open
    if (profileModalVisible) {
      closeProfileModal();
      setTimeout(() => {
        setSelectedPost(post);
        setModalVisible(true);
      }, 150);
    } else {
      setSelectedPost(post);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPost(null);
    setNewComment('');
    setCommentsExpanded(false);
    setVisibleCommentsCount(20);
    setKeyboardHeight(0);
    setPostToReopenAfterProfile(null);
    Keyboard.dismiss();
  };

  const closeCreatePostModal = () => {
    setShowCreatePostModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setSelectedImage(null);
    setSelectedImageId(null);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processAndUploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permissions are required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processAndUploadImage(result.assets[0].uri);
    }
  };

  const processAndUploadImage = async (uri: string) => {
    setUploadingImage(true);
    try {
      // Resize image to 512x512
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 512, height: 512 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Upload to server
      const imageFile = await authService.uploadFile({
        uri: resizedImage.uri,
        name: 'post-image.jpg',
        type: 'image/jpeg',
      });

      setSelectedImage(resizedImage.uri);
      setSelectedImageId(imageFile.id);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setUploadingImage(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setCreatingPost(true);
    try {
      // Prepare images array if image is selected
      const images = selectedImageId ? [{ id: selectedImageId, path: selectedImage || '' }] : undefined;

      await postsService.createPost(
        newPostTitle.trim(),
        newPostContent.trim(),
        images
      );

      closeCreatePostModal();
      await fetchPosts();
      console.log('PostsScreen: New post created, posts refreshed');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setCreatingPost(false);
    }
  };

  const deletePost = async (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const token = authService.getToken();
            if (!token) {
              Alert.alert('Error', 'Not authenticated');
              return;
            }

            try {
              const response = await fetch(`https://cdserver.nomadsoft.us/api/v1/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (response.ok) {
                closeModal();
                await fetchPosts();
                console.log('PostsScreen: Post deleted, posts refreshed');
              } else {
                Alert.alert('Error', 'Failed to delete post');
              }
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const toggleComments = () => {
    setCommentsExpanded(!commentsExpanded);
    if (!commentsExpanded) {
      setVisibleCommentsCount(20); // Reset to initial count when expanding
      // If keyboard is open, scroll to bottom after expanding to ensure visibility
      if (keyboardHeight > 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  };

  const loadMoreComments = () => {
    setVisibleCommentsCount(prev => prev + 20);
  };

  const handleCommentInputFocus = () => {
    // Scroll to bottom when comment input is focused to ensure it's visible
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const openProfileModal = (user: User, fromPostModal: boolean = false) => {
    // Prevent opening if profile modal is already open
    if (profileModalVisible) {
      return;
    }
    
    // If opening from post modal, close it first and remember to reopen it
    if (fromPostModal && modalVisible && selectedPost) {
      setPostToReopenAfterProfile(selectedPost);
      closeModal();
      // Delay opening profile modal to ensure post modal is fully closed
      setTimeout(() => {
        setSelectedUser(user);
        setProfileModalVisible(true);
      }, 150);
    } else {
      // Close post modal if it's open (shouldn't normally happen but safety check)
      if (modalVisible) {
        closeModal();
        setTimeout(() => {
          setSelectedUser(user);
          setProfileModalVisible(true);
        }, 150);
      } else {
        setSelectedUser(user);
        setProfileModalVisible(true);
      }
    }
  };

  const closeProfileModal = () => {
    setProfileModalVisible(false);
    setSelectedUser(null);
    
    // If we need to reopen a post after closing profile, do it
    if (postToReopenAfterProfile) {
      setTimeout(() => {
        openPostModal(postToReopenAfterProfile);
        setPostToReopenAfterProfile(null);
      }, 100);
    }
  };

  const handlePostFromProfile = (post: Post) => {
    // Clear any pending post reopen since we're explicitly opening a different post
    setPostToReopenAfterProfile(null);
    closeProfileModal();
    openPostModal(post);
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.username) {
      return user.username;
    }
    return user.email;
  };

  const addComment = async () => {
    if (!selectedPost || !newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    const token = authService.getToken();
    if (!token) {
      Alert.alert('Error', 'Not authenticated');
      return;
    }

    setAddingComment(true);
    try {
      const response = await fetch(`https://cdserver.nomadsoft.us/api/v1/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment('');
        // Hide keyboard after successful comment submission
        Keyboard.dismiss();
        // Refresh the posts data to get the updated comments
        const refreshedPosts = await fetchPosts();
        // Find the updated post and set it as selected to refresh the modal
        const refreshedPost = refreshedPosts.find(p => p.id === selectedPost.id);
        if (refreshedPost) {
          setSelectedPost(refreshedPost);
          // Auto-expand comments when user adds a comment
          setCommentsExpanded(true);
        }
      } else {
        Alert.alert('Error', 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity onPress={() => openPostModal(item)}>
      <Card className="mb-4">
        <View className="p-4">
          <View className="flex-row items-start">
            <View className="flex-1">
              <H4 className="mb-2">{item.name}</H4>
              <BodyText className="mb-2">{item.content}</BodyText>
              <View className="flex-row items-center">
                <BodyText className="text-sm">by </BodyText>
                <TouchableOpacity onPress={() => openProfileModal(item.user)}>
                  <BodyText className="text-sm text-blue-500 underline">{getUserDisplayName(item.user)}</BodyText>
                </TouchableOpacity>
              </View>
            </View>
            {item.images && item.images.length > 0 && (
              <View className="ml-3">
                <Image
                  source={{ uri: item.images[0].path }}
                  className="w-16 h-16 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <View className="flex-1">
        <View className={components.responsive.feedContainer}>
          <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
            <H4>Posts</H4>
            <TouchableOpacity
              onPress={() => setShowCreatePostModal(true)}
              className="bg-blue-500 px-4 py-2 rounded-lg"
            >
              <BodyText className="text-white font-semibold">Create Post</BodyText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tab Navigation */}
        <View className={`${components.responsive.feedContainer} border-b border-gray-200`}>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setActiveTab('all')}
              className={`flex-1 py-3 items-center border-b-2 ${
                activeTab === 'all' ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <BodyText className={`font-medium ${
                activeTab === 'all' ? 'text-blue-500' : themeStyles.colors.text.secondary
              }`}>
                All Users
              </BodyText>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setActiveTab('friends')}
              className={`flex-1 py-3 items-center border-b-2 ${
                activeTab === 'friends' ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <BodyText className={`font-medium ${
                activeTab === 'friends' ? 'text-blue-500' : themeStyles.colors.text.secondary
              }`}>
                Friends
              </BodyText>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setActiveTab('mine')}
              className={`flex-1 py-3 items-center border-b-2 ${
                activeTab === 'mine' ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <BodyText className={`font-medium ${
                activeTab === 'mine' ? 'text-blue-500' : themeStyles.colors.text.secondary
              }`}>
                My Posts
              </BodyText>
            </TouchableOpacity>
          </View>
        </View>
        
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerClassName={components.responsive.feedContainer}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            fetchPosts(true);
          }}
        />
      </View>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <Screen>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
          >
            <View className={`${components.responsive.cardContainer} flex-1`}>
              <View className="flex-row justify-start mb-6 pt-2">
                <TouchableOpacity onPress={closeModal} className="p-2">
                  <Ionicons name="close" size={24} color={themeStyles.iconColors.close} />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                ref={scrollViewRef}
                className="flex-1"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'ios' ? 20 : 0 }}
              >
              {selectedPost && (
                <View className="pb-4">
                  {/* Post Header */}
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                      <H4 className="mb-3">{selectedPost.name}</H4>
                    </View>
                    {(user?.id === selectedPost.user.id || user?.role?.id === 1) && (
                      <TouchableOpacity
                        onPress={() => deletePost(selectedPost.id)}
                        className="bg-red-500 px-3 py-1 rounded"
                      >
                        <BodyText className="text-white text-xs">Delete</BodyText>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {/* Post Image */}
                  {selectedPost.images && selectedPost.images.length > 0 && (
                    <View className="mb-4">
                      <Image
                        source={{ uri: selectedPost.images[0].path }}
                        className="w-full aspect-square rounded-lg"
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  
                  {/* Post Content */}
                  <BodyText className="mb-3">{selectedPost.content}</BodyText>
                  <View className="flex-row items-center mb-2">
                    <BodyText className="text-sm">by </BodyText>
                    <TouchableOpacity onPress={() => openProfileModal(selectedPost.user, true)}>
                      <BodyText className="text-sm text-blue-500 underline">{getUserDisplayName(selectedPost.user)}</BodyText>
                    </TouchableOpacity>
                  </View>
                  <BodyText className="text-xs mb-6">
                    Created: {new Date(selectedPost.createdAt).toLocaleString()}
                  </BodyText>
                  
                  {/* Comments Section */}
                  <View className="flex-row justify-between items-center mb-4">
                    <H4>Comments</H4>
                    <TouchableOpacity 
                      onPress={toggleComments}
                      className="flex-row items-center"
                    >
                      <BodyText className="text-blue-500 mr-2">
                        {commentsExpanded ? 'Hide Comments' : `View Comments (${selectedPost.comments?.length || 0})`}
                      </BodyText>
                      <Ionicons 
                        name={commentsExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={16} 
                        color={themeStyles.iconColors.primary} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Comments List - Only show when expanded */}
                  {commentsExpanded && (
                    <View className="mb-4">
                      {selectedPost.comments && selectedPost.comments.length > 0 ? (
                        <>
                          {selectedPost.comments.slice(0, visibleCommentsCount).map((comment) => {
                            const isMyComment = user?.id === comment.user.id;
                            const commentTime = new Date(comment.createdAt);
                            const timeString = commentTime.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            });
                            const dateString = commentTime.toLocaleDateString();
                            
                            return (
                              <View key={comment.id} className={`mb-3 ${isMyComment ? 'items-end' : 'items-start'}`}>
                                {!isMyComment && (
                                  <TouchableOpacity onPress={() => openProfileModal(comment.user, true)} className="mb-1 ml-1">
                                    <BodyText className="text-xs text-blue-500 underline">
                                      {getUserDisplayName(comment.user)}
                                    </BodyText>
                                  </TouchableOpacity>
                                )}
                                <View 
                                  className={`p-3 rounded-lg max-w-xs ${
                                    isMyComment ? 'bg-blue-500' : 'bg-gray-200'
                                  }`}
                                >
                                  <BodyText className={isMyComment ? 'text-white' : 'text-black'}>
                                    {comment.content}
                                  </BodyText>
                                  <BodyText className={`text-xs mt-1 ${isMyComment ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {timeString} • {dateString}
                                  </BodyText>
                                </View>
                              </View>
                            );
                          })}
                          
                          {/* Load More Button */}
                          {selectedPost.comments.length > visibleCommentsCount && (
                            <TouchableOpacity 
                              onPress={loadMoreComments}
                              className="py-3 items-center"
                            >
                              <BodyText className="text-blue-500">
                                Load More Comments ({selectedPost.comments.length - visibleCommentsCount} remaining)
                              </BodyText>
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <BodyText className="text-center text-gray-500 py-4">
                          No comments yet
                        </BodyText>
                      )}
                    </View>
                  )}
                  
                  {/* Add Comment */}
                  <View className="flex-row items-center">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChangeText={setNewComment}
                      onFocus={handleCommentInputFocus}
                      className="flex-1 mr-2"
                    />
                    <TouchableOpacity
                      onPress={addComment}
                      disabled={addingComment || !newComment.trim()}
                      className="bg-blue-500 px-4 py-2 rounded-lg"
                    >
                      <BodyText className="text-white">
                        {addingComment ? '...' : 'Send'}
                      </BodyText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Screen>
      </Modal>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePostModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeCreatePostModal}
      >
        <Screen>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
          >
            <ScrollView 
              className="flex-1"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'ios' ? 20 : 0 }}
            >
              <View className={components.responsive.formContainer}>
            <View className="flex-row justify-between items-center mb-6 pt-2">
              <TouchableOpacity onPress={closeCreatePostModal} className="p-2">
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
                  value={newPostTitle}
                  onChangeText={setNewPostTitle}
                  className="mb-4"
                />
                
                <BodyText className="mb-2 font-semibold">Content</BodyText>
                <Input
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChangeText={setNewPostContent}
                  multiline
                  numberOfLines={6}
                  className="mb-4"
                />
                
                <BodyText className="mb-2 font-semibold">Image (Optional)</BodyText>
                {selectedImage ? (
                  <View className="mb-4">
                    <Image
                      source={{ uri: selectedImage }}
                      className="w-full aspect-square rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedImage(null);
                        setSelectedImageId(null);
                      }}
                      className="bg-red-500 px-3 py-2 rounded-lg self-start"
                    >
                      <BodyText className="text-white text-sm">Remove Image</BodyText>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={showImagePicker}
                    disabled={uploadingImage}
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 items-center ${
                      uploadingImage ? 'opacity-50' : ''
                    }`}
                  >
                    <BodyText className="text-gray-500 text-center">
                      {uploadingImage ? 'Uploading...' : 'Tap to add image'}
                    </BodyText>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  onPress={createPost}
                  disabled={creatingPost || !newPostTitle.trim() || !newPostContent.trim()}
                  className={`py-3 rounded-lg ${
                    creatingPost || !newPostTitle.trim() || !newPostContent.trim()
                      ? 'bg-gray-300' 
                      : 'bg-blue-500'
                  }`}
                >
                  <BodyText className={`text-center font-semibold ${
                    creatingPost || !newPostTitle.trim() || !newPostContent.trim()
                      ? 'text-gray-500' 
                      : 'text-white'
                  }`}>
                    {creatingPost ? 'Creating...' : 'Create Post'}
                  </BodyText>
                </TouchableOpacity>
              </View>
            </Card>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Screen>
      </Modal>
      
      {/* User Profile Modal */}
      <UserProfileModal
        visible={profileModalVisible}
        user={selectedUser}
        onClose={closeProfileModal}
        onPostPress={handlePostFromProfile}
      />
    </Screen>
  );
}