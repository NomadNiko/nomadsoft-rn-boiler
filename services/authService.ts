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
        body: JSON.stringify({ email, password }),
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

  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}${API_ENDPOINTS.auth.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          firstName: firstName || '',
          lastName: lastName || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return await response.json();
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
            'Authorization': `Bearer ${this.token}`,
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
          'Authorization': `Bearer ${this.token}`,
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
          'Authorization': `Bearer ${this.refreshToken}`,
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

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }
}

export default new AuthService();