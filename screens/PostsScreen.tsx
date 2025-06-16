import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Screen, H4, BodyText } from '../components/styled';
import { components , getThemeStyles } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import UserProfileModal from '../components/UserProfileModal';
import { CreatePostModal } from '../components/posts/CreatePostModal';
import { PostCard } from '../components/posts/PostCard';
import { TabNavigation } from '../components/posts/TabNavigation';
import { PostDetailModal } from '../components/posts/PostDetailModal';
import { usePosts } from '../hooks/usePosts';
import { Post, User } from '../types';

export default function PostsScreen() {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const themeStyles = getThemeStyles(isDark);
  
  const {
    posts,
    loading,
    isRefreshing,
    activeTab,
    setActiveTab,
    refreshPosts,
    deletePost,
    addComment,
  } = usePosts({ isAuthenticated });

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Update selected post when posts are refreshed
  React.useEffect(() => {
    if (selectedPost && posts.length > 0) {
      const updatedPost = posts.find((p: Post) => p.id === selectedPost.id);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    }
  }, [posts, selectedPost]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [postToReopenAfterProfile, setPostToReopenAfterProfile] = useState<Post | null>(null);




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
    setPostToReopenAfterProfile(null);
  };

  const closeCreatePostModal = () => {
    setShowCreatePostModal(false);
  };

  const handlePostCreated = () => {
    closeCreatePostModal();
    // Posts will be automatically refreshed by the hook
  };

  const handleDeletePost = async (postId: string): Promise<boolean> => {
    const success = await deletePost(postId);
    if (success) {
      closeModal();
    }
    return success;
  };

  const handleAddComment = async (postId: string, content: string): Promise<boolean> => {
    const updatedPost = await addComment(postId, content);
    if (updatedPost) {
      // Immediately update the selected post with the fresh data
      setSelectedPost(updatedPost);
      return true;
    }
    return false;
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

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onPress={openPostModal}
      onUserPress={openProfileModal}
      getUserDisplayName={getUserDisplayName}
    />
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
        
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          themeStyles={themeStyles}
        />
        
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerClassName={components.responsive.feedContainer}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshing={isRefreshing}
          onRefresh={refreshPosts}
        />
      </View>
      
      <PostDetailModal
        visible={modalVisible}
        post={selectedPost}
        currentUser={user}
        onClose={closeModal}
        onUserPress={openProfileModal}
        onDeletePost={handleDeletePost}
        onAddComment={handleAddComment}
        getUserDisplayName={getUserDisplayName}
      />

      <CreatePostModal
        visible={showCreatePostModal}
        onClose={closeCreatePostModal}
        onPostCreated={handlePostCreated}
      />
      
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