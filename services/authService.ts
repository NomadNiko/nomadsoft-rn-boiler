import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

const API_BASE = `${API_CONFIG.baseUrl}${API_CONFIG.apiPath}`;

interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
}

interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photo?: {
    id: string;
    path: string;
  };
  role?: {
    id: string;
  };
  status?: {
    id: string;
  };
  provider?: string;
  socialId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  async init() {
    // Load tokens from storage on init
    this.token = await AsyncStorage.getItem('token');
    this.refreshToken = await AsyncStorage.getItem('refreshToken');
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE}${API_ENDPOINTS.auth.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();

      // Store tokens
      await this.storeTokens(data.token, data.refreshToken);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    username?: string
  ): Promise<any> {
    try {
      const requestBody = {
        email: email.trim(),
        password,
        firstName: (firstName || '').trim(),
        lastName: (lastName || '').trim(),
        username: (username || '').trim(),
      };
      
      console.log('Registration request URL:', `${API_BASE}${API_ENDPOINTS.auth.register}`);
      console.log('Registration request body:', requestBody);
      
      const response = await fetch(`${API_BASE}${API_ENDPOINTS.auth.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Registration response status:', response.status);
      console.log('Registration response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Registration error response text:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Registration failed');
        } catch (parseError) {
          throw new Error(`Registration failed with status ${response.status}: ${errorText}`);
        }
      }

      const responseText = await response.text();
      console.log('Registration success response:', responseText);
      
      if (responseText) {
        return JSON.parse(responseText);
      }
      return {};
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE}${API_ENDPOINTS.auth.googleLogin}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Google login failed');
      }

      const data: LoginResponse = await response.json();

      // Store tokens
      await this.storeTokens(data.token, data.refreshToken);

      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_BASE}${API_ENDPOINTS.auth.logout}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.token) {
        return null;
      }

      const response = await fetch(`${API_BASE}${API_ENDPOINTS.auth.me}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Retry with new token
            return this.getCurrentUser();
          }
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE}${API_ENDPOINTS.auth.refresh}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.refreshToken}`,
        },
      });

      if (!response.ok) {
        await this.clearTokens();
        return false;
      }

      const data: LoginResponse = await response.json();
      await this.storeTokens(data.token, data.refreshToken);

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.clearTokens();
      return false;
    }
  }

  // Helper method for making authenticated requests with automatic token refresh
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    // First attempt with current token
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${this.token}`,
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, try refreshing token once
    if (response.status === 401) {
      console.log('Auth request failed, attempting token refresh...');
      const refreshed = await this.refreshAccessToken();
      
      if (refreshed) {
        console.log('Token refreshed successfully, retrying request...');
        // Retry with new token
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${this.token}`,
        };
        
        response = await fetch(url, {
          ...options,
          headers: newHeaders,
        });
      } else {
        console.log('Token refresh failed');
      }
    }

    return response;
  }

  async checkSession(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return false;
      }

      this.token = token;
      this.refreshToken = await AsyncStorage.getItem('refreshToken');

      // Verify token by getting user info
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      console.error('Session check error:', error);
      return false;
    }
  }

  private async storeTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  }

  private async clearTokens() {
    this.token = null;
    this.refreshToken = null;
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
  }

  async uploadFile(file: {
    uri: string;
    name: string;
    type: string;
  }): Promise<{ id: string; path: string }> {
    try {
      if (!this.token) {
        throw new Error('Not authenticated');
      }

      console.log('Uploading file to:', `${API_CONFIG.baseUrl}${API_CONFIG.apiPath}/files/upload`);
      console.log('With token:', this.token.substring(0, 20) + '...');

      // Create FormData for file upload (matching mantine-boilerplate)
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type.includes('image') ? file.type : 'image/jpeg',
      } as any);

      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.apiPath}/files/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          // Don't set Content-Type for FormData - let the browser set it with boundary
        },
        body: formData,
      });

      console.log('Upload response status:', response.status);
      const responseText = await response.text();
      console.log('Upload response text:', responseText);

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}: ${responseText}`);
      }

      try {
        const data = JSON.parse(responseText);
        // Return just the file object, not the wrapper
        return data.file || data;
      } catch (parseError) {
        console.error('Failed to parse upload response:', parseError);
        throw new Error('Invalid response format from file upload');
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  async updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    photo?: { id: string; path: string } | null;
  }): Promise<User> {
    try {
      if (!this.token) {
        throw new Error('Not authenticated');
      }

      // Trim string fields to remove trailing spaces
      const trimmedUpdates = {
        ...updates,
        ...(updates.firstName !== undefined && { firstName: updates.firstName.trim() }),
        ...(updates.lastName !== undefined && { lastName: updates.lastName.trim() }),
        ...(updates.username !== undefined && { username: updates.username.trim() }),
        ...(updates.email !== undefined && { email: updates.email.trim() }),
      };

      console.log('Updating profile with:', JSON.stringify(trimmedUpdates, null, 2));

      const response = await fetch(`${API_BASE}${API_ENDPOINTS.auth.me}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(trimmedUpdates),
      });

      console.log('Profile update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Profile update error response:', errorText);
        throw new Error(`Profile update failed: ${response.status} - ${errorText}`);
      }

      const updatedUser = await response.json();
      console.log('Profile update successful:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async getSocialInfo(): Promise<{ postsCount: number; commentsCount: number; friendsCount: number } | null> {
    try {
      if (!this.token) {
        return null;
      }

      const response = await fetch(`${API_BASE}/social/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Retry with new token
            return this.getSocialInfo();
          }
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get social info error:', error);
      return null;
    }
  }


  async getUserPosts(userId: string): Promise<any[]> {
    try {
      if (!this.token) {
        return [];
      }

      const response = await fetch(`${API_BASE}/posts/by-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ userIds: [userId] }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.getUserPosts(userId);
          }
        }
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Get user posts error:', error);
      return [];
    }
  }

  async getFriendsList(): Promise<User[]> {
    try {
      if (!this.token) {
        return [];
      }

      const response = await fetch(`${API_BASE}/social/friends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.getFriendsList();
          }
        }
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Get friends list error:', error);
      return [];
    }
  }

  async addFriend(friendId: string): Promise<boolean> {
    try {
      if (!this.token) {
        return false;
      }

      const response = await fetch(`${API_BASE}/social/friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.addFriend(friendId);
          }
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Add friend error:', error);
      return false;
    }
  }

  async removeFriend(friendId: string): Promise<boolean> {
    try {
      if (!this.token) {
        return false;
      }

      const response = await fetch(`${API_BASE}/social/friends/${friendId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.removeFriend(friendId);
          }
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Remove friend error:', error);
      return false;
    }
  }

  async getFriendsCount(userId: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE}/public/users/${userId}/friends-count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to get friends count:', response.status);
        return 0;
      }

      const data = await response.json();
      return data.friendsCount || 0;
    } catch (error) {
      console.error('Get friends count error:', error);
      return 0;
    }
  }

  async getHiddenStatus(): Promise<boolean> {
    try {
      if (!this.token) {
        return false;
      }

      const response = await fetch(`${API_BASE}/hidden-users/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.getHiddenStatus();
          }
        }
        return false;
      }

      const data = await response.json();
      return data.isHidden || false;
    } catch (error) {
      console.error('Get hidden status error:', error);
      return false;
    }
  }

  async setHiddenStatus(hidden: boolean): Promise<boolean> {
    try {
      if (!this.token) {
        return false;
      }

      const endpoint = hidden ? `${API_BASE}/hidden-users/hide` : `${API_BASE}/hidden-users/hide`;
      const method = hidden ? 'POST' : 'DELETE';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.setHiddenStatus(hidden);
          }
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Set hidden status error:', error);
      return false;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }
}

export default new AuthService();
