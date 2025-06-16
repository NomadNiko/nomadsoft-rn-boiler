import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Card, H4, BodyText } from '../styled';
import { Post, User } from '../../types';

interface PostCardProps {
  post: Post;
  onPress: (post: Post) => void;
  onUserPress: (user: User) => void;
  getUserDisplayName: (user: User) => string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onUserPress,
  getUserDisplayName,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(post)}>
      <Card className="mb-4">
        <View className="p-4">
          <View className="flex-row items-start">
            <View className="flex-1">
              <H4 className="mb-2">{post.name}</H4>
              <BodyText className="mb-2">{post.content}</BodyText>
              <View className="flex-row items-center">
                <BodyText className="text-sm">by </BodyText>
                <TouchableOpacity onPress={() => onUserPress(post.user)}>
                  <BodyText className="text-sm text-blue-500 underline">
                    {getUserDisplayName(post.user)}
                  </BodyText>
                </TouchableOpacity>
              </View>
            </View>
            {post.images && post.images.length > 0 && (
              <View className="ml-3">
                <Image
                  source={{ uri: post.images[0].path }}
                  className="h-16 w-16 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
