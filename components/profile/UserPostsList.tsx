import React from 'react';
import { View, Image } from 'react-native';
import { Card, H4, BodyText, Row } from '../styled';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeStyles } from '../../styles/globalStyles';

interface UserPost {
  id: string;
  name: string;
  content: string;
  images?: { path: string }[];
  comments?: any[];
  createdAt: string;
}

interface UserPostsListProps {
  posts: UserPost[];
  loading: boolean;
}

export const UserPostsList: React.FC<UserPostsListProps> = ({ posts, loading }) => {
  const { isDark } = useTheme();
  const themeStyles = getThemeStyles(isDark);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderPost = (post: UserPost, index: number) => (
    <Card key={post.id} className="mb-3">
      <View className="p-4">
        <H4 className="mb-2">{post.name}</H4>
        <BodyText className={`${themeStyles.colors.text.secondary} mb-2`} numberOfLines={3}>
          {post.content}
        </BodyText>

        {post.images && post.images.length > 0 && (
          <View className="mb-3 flex-row flex-wrap gap-2">
            {post.images.slice(0, 3).map((image: any, imgIndex: number) => (
              <Image
                key={imgIndex}
                source={{ uri: image.path }}
                className="h-20 w-20 rounded-lg"
                resizeMode="cover"
              />
            ))}
            {post.images.length > 3 && (
              <View className="h-20 w-20 items-center justify-center rounded-lg bg-gray-200">
                <BodyText className="text-xs text-gray-600">+{post.images.length - 3}</BodyText>
              </View>
            )}
          </View>
        )}

        <Row className="items-center justify-between">
          <BodyText className={`text-xs ${themeStyles.colors.text.secondary}`}>
            {formatDate(post.createdAt)}
          </BodyText>
          <BodyText className={`text-xs ${themeStyles.colors.text.secondary}`}>
            {post.comments?.length || 0} comments
          </BodyText>
        </Row>
      </View>
    </Card>
  );

  return (
    <View className="mb-6">
      <Row className="mb-4 items-center justify-between">
        <H4>My Posts ({posts.length})</H4>
        {loading && (
          <View className="h-4 w-4">
            <View className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </View>
        )}
      </Row>

      {posts.length > 0 ? (
        <View>{posts.map((post, index) => renderPost(post, index))}</View>
      ) : (
        <Card>
          <View className="items-center p-8">
            <BodyText className={`text-center ${themeStyles.colors.text.secondary}`}>
              {loading ? 'Loading your posts...' : "You haven't posted anything yet"}
            </BodyText>
          </View>
        </Card>
      )}
    </View>
  );
};
