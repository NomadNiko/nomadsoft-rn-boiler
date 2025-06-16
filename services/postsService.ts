import authService from './authService';
import postsCache, { Post } from './postsCache';

class PostsService {
  private readonly API_BASE = 'https://cdserver.nomadsoft.us/api/v1';

  async init(): Promise<void> {
    await postsCache.init();
  }

  async clearCache(): Promise<void> {
    await postsCache.clearCache();
  }

  // Get posts with caching strategy
  async getPosts(tab: 'all' | 'friends' | 'mine', forceRefresh = false): Promise<Post[]> {
    console.log(`PostsService: Getting posts for tab '${tab}', forceRefresh: ${forceRefresh}`);

    // If we have cached data and it's not stale (unless forcing refresh), return it immediately
    if (!forceRefresh && postsCache.hasCachedData(tab) && !postsCache.isCacheStale(tab)) {
      console.log(`PostsService: Returning fresh cached data for '${tab}'`);
      return postsCache.getCachedPosts(tab);
    }

    // If we have cached data but it's stale or we're forcing refresh, return cached first then update
    const cachedPosts = postsCache.getCachedPosts(tab);
    const hasCachedData = cachedPosts.length > 0;

    // Fetch fresh data in background
    try {
      const freshPosts = await this.fetchPostsFromServer(tab);
      await postsCache.setCachedPosts(tab, freshPosts);
      console.log(`PostsService: Updated '${tab}' cache with ${freshPosts.length} fresh posts`);
      return freshPosts;
    } catch (error) {
      console.error(`PostsService: Failed to fetch fresh posts for '${tab}':`, error);
      
      // If we have cached data, return it even if the refresh failed
      if (hasCachedData) {
        console.log(`PostsService: Returning cached data due to fetch failure for '${tab}'`);
        return cachedPosts;
      }
      
      // No cached data and fetch failed, return empty array
      return [];
    }
  }

  // Fetch posts from server with proper auth handling
  private async fetchPostsFromServer(tab: 'all' | 'friends' | 'mine'): Promise<Post[]> {
    let endpoint = `${this.API_BASE}/posts`;
    let method = 'GET';
    let body: string | undefined;

    if (tab === 'mine') {
      endpoint = `${this.API_BASE}/posts/my-posts`;
    } else if (tab === 'friends') {
      // First get friends list, then get posts by those users
      try {
        const friendsResponse = await authService.makeAuthenticatedRequest(`${this.API_BASE}/social/friends`);
        
        if (friendsResponse.ok) {
          const friends = await friendsResponse.json();
          const friendIds = friends.map((friend: any) => friend.id);
          
          if (friendIds.length > 0) {
            endpoint = `${this.API_BASE}/posts/by-users`;
            method = 'POST';
            body = JSON.stringify({ userIds: friendIds });
          } else {
            // No friends, return empty array
            return [];
          }
        } else {
          throw new Error('Failed to fetch friends list');
        }
      } catch (error) {
        console.error('PostsService: Error fetching friends for posts:', error);
        throw error;
      }
    }

    const response = await authService.makeAuthenticatedRequest(endpoint, {
      method,
      ...(body && { body }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    return await response.json();
  }

  // Create a new post and update cache
  async createPost(title: string, content: string, images?: { id: string; path: string }[]): Promise<Post> {
    const createData: any = {
      name: title,
      content,
    };

    if (images && images.length > 0) {
      createData.images = images;
    }

    const response = await authService.makeAuthenticatedRequest(`${this.API_BASE}/posts`, {
      method: 'POST',
      body: JSON.stringify(createData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.status}`);
    }

    const newPost = await response.json();
    
    // Add to cache
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      await postsCache.addPost(newPost, currentUser.id);
    }

    return newPost;
  }

  // Add comment to post and update cache
  async addComment(postId: string, content: string): Promise<any> {
    const response = await authService.makeAuthenticatedRequest(`${this.API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.status}`);
    }

    const comment = await response.json();

    // Fetch the updated post with the new comment and update cache
    try {
      const updatedPostResponse = await authService.makeAuthenticatedRequest(`${this.API_BASE}/posts/${postId}`);
      if (updatedPostResponse.ok) {
        const updatedPost = await updatedPostResponse.json();
        await postsCache.updatePost(updatedPost);
        console.log('PostsService: Updated post cache with new comment');
      }
    } catch (error) {
      console.error('PostsService: Failed to update post cache after comment:', error);
      // Don't throw here - the comment was still added successfully
    }

    return comment;
  }

  // Delete post and update cache
  async deletePost(postId: string): Promise<void> {
    const response = await authService.makeAuthenticatedRequest(`${this.API_BASE}/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.status}`);
    }

    // Remove from cache
    await postsCache.removePost(postId);
  }

  // Preload all tabs (call this after login)
  async preloadAllTabs(): Promise<void> {
    console.log('PostsService: Preloading all tabs...');
    
    const promises = [
      this.getPosts('all', true),
      this.getPosts('friends', true),
      this.getPosts('mine', true),
    ];

    try {
      await Promise.allSettled(promises);
      console.log('PostsService: Preload completed');
    } catch (error) {
      console.error('PostsService: Preload failed:', error);
    }
  }

  // Get cache statistics for debugging
  getCacheStats() {
    return postsCache.getCacheStats();
  }
}

export default new PostsService();