import { useState, useEffect, useCallback } from 'react';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Post, PostTabType } from '../types';
import postsService from '../services/postsService';
import authService from '../services/authService';

interface UsePostsOptions {
  isAuthenticated: boolean;
}

export const usePosts = ({ isAuthenticated }: UsePostsOptions) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<PostTabType>('all');

  // Load saved tab preference on mount
  useEffect(() => {
    const loadTabPreference = async () => {
      try {
        const savedTab = await AsyncStorage.getItem('postsActiveTab');
        if (savedTab && ['all', 'friends', 'mine'].includes(savedTab)) {
          setActiveTab(savedTab as PostTabType);
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

  const fetchPosts = useCallback(async (forceRefresh = false): Promise<void> => {
    console.log('usePosts: Fetching posts for tab:', activeTab, 'forceRefresh:', forceRefresh);
    
    if (!isAuthenticated) {
      console.log('usePosts: User not authenticated');
      setPosts([]);
      return;
    }

    try {
      if (!forceRefresh) {
        setLoading(true);
      }
      const data = await postsService.getPosts(activeTab, forceRefresh);
      setPosts(data);
      console.log(`usePosts: Loaded ${data.length} posts for '${activeTab}' tab`);
    } catch (error) {
      console.error('usePosts: Error fetching posts:', error);
      // Don't clear posts on error - keep showing cached data
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [isAuthenticated, activeTab]);

  // Load posts when tab changes or user becomes authenticated
  useEffect(() => {
    console.log('usePosts: Tab changed to:', activeTab, 'authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      fetchPosts(); // Uses smart caching - shows cached data immediately if available
    }
  }, [isAuthenticated, activeTab, fetchPosts]);

  // Refresh posts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('usePosts: Screen focused');
      
      if (isAuthenticated) {
        // Check for updates when screen is focused (background refresh)
        fetchPosts(true); // Force refresh to check for updates
      }
    }, [isAuthenticated, fetchPosts])
  );

  const refreshPosts = useCallback(() => {
    setIsRefreshing(true);
    fetchPosts(true);
  }, [fetchPosts]);

  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    const token = authService.getToken();
    if (!token) {
      Alert.alert('Error', 'Not authenticated');
      return false;
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
        await fetchPosts();
        console.log('usePosts: Post deleted, posts refreshed');
        return true;
      } else {
        Alert.alert('Error', 'Failed to delete post');
        return false;
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
      return false;
    }
  }, [fetchPosts]);

  const addComment = useCallback(async (postId: string, content: string): Promise<Post | null> => {
    try {
      await postsService.addComment(postId, content.trim());
      Keyboard.dismiss();
      // Force refresh to get updated data (cache should already be updated)
      await fetchPosts(false); // Use cache if available since we just updated it
      
      // Return the updated post
      const updatedPost = posts.find((p: Post) => p.id === postId);
      return updatedPost || null;
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
      return null;
    }
  }, [fetchPosts, posts]);

  return {
    posts,
    loading,
    isRefreshing,
    activeTab,
    setActiveTab,
    fetchPosts,
    refreshPosts,
    deletePost,
    addComment,
  };
};