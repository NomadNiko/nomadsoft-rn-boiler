import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getThemeStyles, components } from '../styles/globalStyles';
import authService from '../services/authService';
import {
  Screen,
  Card,
  H4,
  BodyText,
  LabelText,
  Row,
  PrimaryButton,
  OutlineButton,
} from './styled';

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

interface Post {
  id: string;
  name: string;
  content: string;
  user: User;
  comments: any[];
  images: any[];
  createdAt: string;
}

interface UserProfileModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onPostPress?: (post: Post) => void;
}

export default function UserProfileModal({ 
  visible, 
  user: profileUserProp, 
  onClose, 
  onPostPress 
}: UserProfileModalProps) {
  const { isDark } = useTheme();
  const { user: currentUser } = useAuth();
  const theme = getThemeStyles(isDark);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendActionLoading, setFriendActionLoading] = useState(false);

  const isOwnProfile = currentUser?.id === profileUserProp?.id;
  const profileUser = isOwnProfile ? currentUser : profileUserProp;

  useEffect(() => {
    if (visible && profileUserProp) {
      fetchUserPosts();
      fetchFriendsCount();
      if (!isOwnProfile) {
        fetchFriends();
      }
    }
  }, [visible, profileUserProp]);


  const fetchUserPosts = async () => {
    if (!profileUserProp?.id) return;
    
    setLoading(true);
    try {
      const posts = await authService.getUserPosts(profileUserProp.id);
      setUserPosts(posts);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    if (isOwnProfile) return;
    
    try {
      const friendsList = await authService.getFriendsList();
      setFriends(friendsList);
      setIsFriend(friendsList.some(friend => friend.id === profileUserProp?.id));
    } catch (error) {
      console.error('Failed to fetch friends list:', error);
    }
  };

  const fetchFriendsCount = async () => {
    if (!profileUserProp?.id) return;
    
    try {
      const count = await authService.getFriendsCount(profileUserProp.id);
      setFriendsCount(count);
    } catch (error) {
      console.error('Failed to fetch friends count:', error);
    }
  };

  const handleFriendAction = async () => {
    if (!profileUserProp?.id || isOwnProfile) return;
    
    setFriendActionLoading(true);
    try {
      if (isFriend) {
        const success = await authService.removeFriend(profileUserProp.id);
        if (success) {
          setIsFriend(false);
          Alert.alert('Success', 'Friend removed successfully');
        } else {
          Alert.alert('Error', 'Failed to remove friend');
        }
      } else {
        const success = await authService.addFriend(profileUserProp.id);
        if (success) {
          setIsFriend(true);
          Alert.alert('Success', 'Friend added successfully');
        } else {
          Alert.alert('Error', 'Failed to add friend');
        }
      }
    } catch (error) {
      console.error('Friend action error:', error);
      Alert.alert('Error', 'Failed to update friendship status');
    } finally {
      setFriendActionLoading(false);
    }
  };

  const getUserDisplayName = (user: User | null) => {
    if (!user) return 'User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.username) {
      return user.username;
    }
    return user.email;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity onPress={() => onPostPress?.(item)}>
      <Card className="mb-3">
        <View className="p-4">
          <H4 className="mb-2">{item.name}</H4>
          <BodyText className={`${theme.colors.text.secondary} mb-2`} numberOfLines={3}>
            {item.content}
          </BodyText>
          
          {item.images && item.images.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {item.images.slice(0, 3).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.path }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
              ))}
              {item.images.length > 3 && (
                <View className="w-20 h-20 rounded-lg bg-gray-200 items-center justify-center">
                  <BodyText className="text-gray-600 text-xs">
                    +{item.images.length - 3}
                  </BodyText>
                </View>
              )}
            </View>
          )}
          
          <Row className="justify-between items-center">
            <BodyText className={`text-xs ${theme.colors.text.secondary}`}>
              {formatDate(item.createdAt)}
            </BodyText>
            <BodyText className={`text-xs ${theme.colors.text.secondary}`}>
              {item.comments.length} comments
            </BodyText>
          </Row>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="mb-6">
      {/* Profile Header */}
      <Card>
        <View className="items-center p-6">
          {profileUser?.photo?.path ? (
            <View className={`${components.image.profileWrapper} ${components.utils.p1} mb-4`}>
              <Image
                source={{ uri: profileUser.photo.path }}
                className={components.image.profile}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View className={`${theme.colors.background.tertiary} ${components.image.profileWrapper} ${components.utils.p1} mb-4`}>
              <Image
                source={require('../assets/nomadsoft-black-centered.png')}
                className={components.image.profile}
                resizeMode="contain"
              />
            </View>
          )}
          
          <H4 className="text-center mb-1">
            {getUserDisplayName(profileUser)}
          </H4>
          
          <BodyText className={`text-center ${theme.colors.text.secondary} mb-2`}>
            {profileUser?.email}
          </BodyText>
          
          {profileUser?.username && profileUser?.firstName && profileUser?.lastName && (
            <BodyText className={`text-center text-xs ${theme.colors.text.secondary} opacity-75 mb-4`}>
              @{profileUser.username}
            </BodyText>
          )}
          
          {/* Stats */}
          <Row className="justify-around w-full mb-4">
            <View className="items-center">
              <H4>{userPosts.length}</H4>
              <LabelText>Posts</LabelText>
            </View>
            <View className="items-center">
              <H4>{friendsCount}</H4>
              <LabelText>Friends</LabelText>
            </View>
          </Row>
          
          {/* Friend Action Button */}
          {!isOwnProfile && (
            <View className="w-full">
              {isFriend ? (
                <OutlineButton 
                  onPress={handleFriendAction} 
                  disabled={friendActionLoading}
                >
                  {friendActionLoading ? 'Removing...' : 'Remove Friend'}
                </OutlineButton>
              ) : (
                <PrimaryButton 
                  onPress={handleFriendAction} 
                  disabled={friendActionLoading}
                >
                  {friendActionLoading ? 'Adding...' : 'Add Friend'}
                </PrimaryButton>
              )}
            </View>
          )}
        </View>
      </Card>
      
      {/* Posts Section Header */}
      <View className="mt-6 mb-3">
        <H4>{isOwnProfile ? 'My Posts' : 'Posts'} ({userPosts.length})</H4>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Screen>
        <View className="flex-1">
          {/* Header */}
          <View className={`${components.responsive.feedContainer} flex-row justify-between items-center py-4 border-b border-gray-200`}>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color={theme.iconColors.close} />
            </TouchableOpacity>
            <H4>{isOwnProfile ? 'My Profile' : 'Profile'}</H4>
            <View className="w-8" />
          </View>
          
          {/* Content */}
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <BodyText>Loading profile...</BodyText>
            </View>
          ) : (
            <FlatList
              data={userPosts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={renderHeader}
              contentContainerClassName={components.responsive.feedContainer}
              contentContainerStyle={{ paddingVertical: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="items-center py-8">
                  <BodyText className={theme.colors.text.secondary}>
                    {isOwnProfile ? "You haven't posted anything yet" : "No posts to show"}
                  </BodyText>
                </View>
              }
            />
          )}
        </View>
      </Screen>
    </Modal>
  );
}