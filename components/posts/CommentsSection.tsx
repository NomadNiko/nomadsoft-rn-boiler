import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H4, BodyText } from '../styled';
import { Comment, User } from '../../types';

interface CommentsSectionProps {
  comments: Comment[];
  commentsExpanded: boolean;
  visibleCommentsCount: number;
  onToggleComments: () => void;
  onLoadMoreComments: () => void;
  onUserPress: (user: User) => void;
  getUserDisplayName: (user: User) => string;
  themeStyles: any;
  currentUserId?: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  commentsExpanded,
  visibleCommentsCount,
  onToggleComments,
  onLoadMoreComments,
  onUserPress,
  getUserDisplayName,
  themeStyles,
  currentUserId,
}) => {
  return (
    <>
      <View className="mb-4 flex-row items-center justify-between">
        <H4>Comments</H4>
        <TouchableOpacity onPress={onToggleComments} className="flex-row items-center">
          <BodyText className="mr-2 text-blue-500">
            {commentsExpanded ? 'Hide Comments' : `View Comments (${comments?.length || 0})`}
          </BodyText>
          <Ionicons
            name={commentsExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={themeStyles.iconColors.primary}
          />
        </TouchableOpacity>
      </View>

      {commentsExpanded && (
        <View className="mb-4">
          {comments && comments.length > 0 ? (
            <>
              {comments.slice(0, visibleCommentsCount).map((comment) => {
                const isMyComment = currentUserId === comment.user.id;
                const commentTime = new Date(comment.createdAt);
                const timeString = commentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const dateString = commentTime.toLocaleDateString();

                return (
                  <View
                    key={comment.id}
                    className={`mb-3 ${isMyComment ? 'items-end' : 'items-start'}`}>
                    {!isMyComment && (
                      <TouchableOpacity
                        onPress={() => onUserPress(comment.user)}
                        className="mb-1 ml-1">
                        <BodyText className="text-xs text-blue-500 underline">
                          {getUserDisplayName(comment.user)}
                        </BodyText>
                      </TouchableOpacity>
                    )}
                    <View
                      className={`max-w-xs rounded-lg p-3 ${
                        isMyComment ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                      <BodyText className={isMyComment ? 'text-white' : 'text-black'}>
                        {comment.content}
                      </BodyText>
                      <BodyText
                        className={`mt-1 text-xs ${isMyComment ? 'text-blue-100' : 'text-gray-500'}`}>
                        {timeString} • {dateString}
                      </BodyText>
                    </View>
                  </View>
                );
              })}

              {comments.length > visibleCommentsCount && (
                <TouchableOpacity onPress={onLoadMoreComments} className="items-center py-3">
                  <BodyText className="text-blue-500">
                    Load More Comments ({comments.length - visibleCommentsCount} remaining)
                  </BodyText>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <BodyText className="py-4 text-center text-gray-500">No comments yet</BodyText>
          )}
        </View>
      )}
    </>
  );
};
