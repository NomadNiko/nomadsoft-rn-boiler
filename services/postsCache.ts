import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Post {
  id: string;
  name: string;
  content: string;
  user: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    photo?: {
      id: string;
      path: string;
    };
  };
  comments: any[];
  images: any[];
  createdAt: string;
}

export interface PostsCache {
  all: Post[];
  friends: Post[];
  mine: Post[];
  lastUpdated: {
    all?: number;
    friends?: number;
    mine?: number;
  };
}

class PostsCacheService {
  private static readonly CACHE_KEY = 'postsCache';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private cache: PostsCache = {
    all: [],
    friends: [],
    mine: [],
    lastUpdated: {},
  };

  async init(): Promise<void> {
    try {
      const cachedData = await AsyncStorage.getItem(PostsCacheService.CACHE_KEY);
      if (cachedData) {
        this.cache = JSON.parse(cachedData);
        console.log('PostsCache: Loaded cache from storage');
      }
    } catch (error) {
      console.error('PostsCache: Failed to load cache:', error);
    }
  }

  async saveCache(): Promise<void> {
    try {
      await AsyncStorage.setItem(PostsCacheService.CACHE_KEY, JSON.stringify(this.cache));
      console.log('PostsCache: Saved cache to storage');
    } catch (error) {
      console.error('PostsCache: Failed to save cache:', error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      this.cache = {
        all: [],
        friends: [],
        mine: [],
        lastUpdated: {},
      };
      await AsyncStorage.removeItem(PostsCacheService.CACHE_KEY);
      console.log('PostsCache: Cleared cache');
    } catch (error) {
      console.error('PostsCache: Failed to clear cache:', error);
    }
  }

  getCachedPosts(tab: 'all' | 'friends' | 'mine'): Post[] {
    return this.cache[tab] || [];
  }

  async setCachedPosts(tab: 'all' | 'friends' | 'mine', posts: Post[]): Promise<void> {
    this.cache[tab] = posts;
    this.cache.lastUpdated[tab] = Date.now();
    await this.saveCache();
    console.log(`PostsCache: Updated ${tab} cache with ${posts.length} posts`);
  }

  isCacheStale(tab: 'all' | 'friends' | 'mine'): boolean {
    const lastUpdated = this.cache.lastUpdated[tab];
    if (!lastUpdated) return true;
    
    const now = Date.now();
    const isStale = now - lastUpdated > PostsCacheService.CACHE_DURATION;
    console.log(`PostsCache: ${tab} cache is ${isStale ? 'stale' : 'fresh'}`);
    return isStale;
  }

  hasCachedData(tab: 'all' | 'friends' | 'mine'): boolean {
    return this.cache[tab].length > 0;
  }

  // Add a new post to all relevant caches
  async addPost(post: Post, userId: string): Promise<void> {
    // Add to 'all' cache
    this.cache.all.unshift(post);
    
    // Add to 'mine' cache if it's the user's post
    if (post.user.id === userId) {
      this.cache.mine.unshift(post);
    }
    
    // Note: We don't automatically add to friends cache since we don't know
    // the friends relationship here. The friends cache will be refreshed normally.
    
    await this.saveCache();
    console.log('PostsCache: Added new post to relevant caches');
  }

  // Update a post in all caches where it exists
  async updatePost(updatedPost: Post): Promise<void> {
    const updateInCache = (posts: Post[]) => {
      const index = posts.findIndex(p => p.id === updatedPost.id);
      if (index !== -1) {
        posts[index] = updatedPost;
        return true;
      }
      return false;
    };

    updateInCache(this.cache.all);
    updateInCache(this.cache.friends);
    updateInCache(this.cache.mine);

    await this.saveCache();
    console.log('PostsCache: Updated post in all caches');
  }

  // Remove a post from all caches
  async removePost(postId: string): Promise<void> {
    const removeFromCache = (posts: Post[]) => {
      const index = posts.findIndex(p => p.id === postId);
      if (index !== -1) {
        posts.splice(index, 1);
        return true;
      }
      return false;
    };

    removeFromCache(this.cache.all);
    removeFromCache(this.cache.friends);
    removeFromCache(this.cache.mine);

    await this.saveCache();
    console.log('PostsCache: Removed post from all caches');
  }

  // Get cache statistics for debugging
  getCacheStats() {
    return {
      all: {
        count: this.cache.all.length,
        lastUpdated: this.cache.lastUpdated.all,
        isStale: this.isCacheStale('all'),
      },
      friends: {
        count: this.cache.friends.length,
        lastUpdated: this.cache.lastUpdated.friends,
        isStale: this.isCacheStale('friends'),
      },
      mine: {
        count: this.cache.mine.length,
        lastUpdated: this.cache.lastUpdated.mine,
        isStale: this.isCacheStale('mine'),
      },
    };
  }
}

export default new PostsCacheService();