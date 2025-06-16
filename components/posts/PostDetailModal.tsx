import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, H4, BodyText, Input } from '../styled';
import { components, getThemeStyles } from '../../styles/globalStyles';
import { useTheme } from '../../contexts/ThemeContext';
import { Post, User } from '../../types';
import { CommentsSection } from './CommentsSection';

interface PostDetailModalProps {
  visible: boolean;
  post: Post | null;
  currentUser: User | null;
  onClose: () => void;
  onUserPress: (user: User, fromPostModal?: boolean) => void;
  onDeletePost: (postId: string) => Promise<boolean>;
  onAddComment: (postId: string, content: string) => Promise<boolean>;
  getUserDisplayName: (user: User) => string;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  visible,
  post,
  currentUser,
  onClose,
  onUserPress,
  onDeletePost,
  onAddComment,
  getUserDisplayName,
}) => {
  const { isDark } = useTheme();
  const themeStyles = getThemeStyles(isDark);

  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(20);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Keep comments expanded when post updates and user was adding comments
  const [wasAddingComment, setWasAddingComment] = useState(false);
  
  useEffect(() => {
    if (addingComment) {
      setWasAddingComment(true);
    }
  }, [addingComment]);

  useEffect(() => {
    if (post && wasAddingComment && !addingComment && commentsExpanded) {
      // Scroll to bottom when new comments are loaded
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      setWasAddingComment(false);
    }
  }, [post, wasAddingComment, addingComment, commentsExpanded]);

  const handleClose = () => {
    setNewComment('');
    setCommentsExpanded(false);
    setVisibleCommentsCount(20);
    setKeyboardHeight(0);
    Keyboard.dismiss();
    onClose();
  };

  const handleDeletePost = async () => {
    if (!post) return;

    const success = await onDeletePost(post.id);
    if (success) {
      handleClose();
    }
  };

  const handleAddComment = async () => {
    if (!post || !newComment.trim()) return;

    setAddingComment(true);
    try {
      const success = await onAddComment(post.id, newComment);
      if (success) {
        setNewComment('');
        setCommentsExpanded(true);
        // Scroll to bottom to show the new comment
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
      }
    } finally {
      setAddingComment(false);
    }
  };

  const toggleComments = () => {
    setCommentsExpanded(!commentsExpanded);
    if (!commentsExpanded) {
      setVisibleCommentsCount(20);
      // If keyboard is open, scroll to bottom after expanding to ensure visibility
      if (keyboardHeight > 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  };

  const loadMoreComments = () => {
    setVisibleCommentsCount((prev) => prev + 20);
  };

  const handleCommentInputFocus = () => {
    // Scroll to bottom when comment input is focused to ensure it's visible
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (!post) return null;

  const canDeletePost = currentUser?.id === post.user.id || currentUser?.role?.id === '1';

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
          <View className={`${components.responsive.cardContainer} flex-1`}>
            <View className="mb-6 flex-row justify-start pt-2">
              <TouchableOpacity onPress={handleClose} className="p-2">
                <Ionicons name="close" size={24} color={themeStyles.iconColors.close} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              className="flex-1"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: Platform.OS === 'ios' ? 20 : 0,
              }}>
              <View className="pb-4">
                {/* Post Header */}
                <View className="mb-4 flex-row items-start justify-between">
                  <View className="flex-1">
                    <H4 className="mb-3">{post.name}</H4>
                  </View>
                  {canDeletePost && (
                    <TouchableOpacity
                      onPress={handleDeletePost}
                      className="rounded bg-red-500 px-3 py-1">
                      <BodyText className="text-xs text-white">Delete</BodyText>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Post Image */}
                {post.images && post.images.length > 0 && (
                  <View className="mb-4">
                    <Image
                      source={{ uri: post.images[0].path }}
                      className="aspect-square w-full rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Post Content */}
                <BodyText className="mb-3">{post.content}</BodyText>
                <View className="mb-2 flex-row items-center">
                  <BodyText className="text-sm">by </BodyText>
                  <TouchableOpacity onPress={() => onUserPress(post.user, true)}>
                    <BodyText className="text-sm text-blue-500 underline">
                      {getUserDisplayName(post.user)}
                    </BodyText>
                  </TouchableOpacity>
                </View>
                <BodyText className="mb-6 text-xs">
                  Created: {new Date(post.createdAt).toLocaleString()}
                </BodyText>

                {/* Comments Section */}
                <CommentsSection
                  comments={post.comments}
                  commentsExpanded={commentsExpanded}
                  visibleCommentsCount={visibleCommentsCount}
                  onToggleComments={toggleComments}
                  onLoadMoreComments={loadMoreComments}
                  onUserPress={(user) => onUserPress(user, true)}
                  getUserDisplayName={getUserDisplayName}
                  themeStyles={themeStyles}
                  currentUserId={currentUser?.id}
                />

                {/* Add Comment */}
                <View className="flex-row items-center">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    onFocus={handleCommentInputFocus}
                    className="mr-2 flex-1"
                  />
                  <TouchableOpacity
                    onPress={handleAddComment}
                    disabled={addingComment || !newComment.trim()}
                    className="rounded-lg bg-blue-500 px-4 py-2">
                    <BodyText className="text-white">{addingComment ? '...' : 'Send'}</BodyText>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Screen>
    </Modal>
  );
};
