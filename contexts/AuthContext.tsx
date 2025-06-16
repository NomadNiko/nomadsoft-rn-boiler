import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';
import postsService from '../services/postsService';

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
}

interface SocialStats {
  postsCount: number;
  commentsCount: number;
  friendsCount: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  socialStats: SocialStats;
  checkSession: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshSocialStats: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [socialStats, setSocialStats] = useState<SocialStats>({
    postsCount: 0,
    commentsCount: 0,
    friendsCount: 0,
  });

  const checkSession = async () => {
    try {
      console.log('AuthContext: Starting session check');
      setIsLoading(true);

      // Initialize auth service and posts cache
      await authService.init();
      await postsService.init();

      const sessionExists = await authService.checkSession();
      console.log('AuthContext: Session exists:', sessionExists);
      setIsAuthenticated(sessionExists);
      console.log('AuthContext: Updated isAuthenticated to:', sessionExists);

      if (sessionExists) {
        // Get user info if session exists
        const userInfo = await authService.getCurrentUser();
        console.log('AuthContext: User info:', userInfo);
        setUser(userInfo);
        
        // Load cached social stats immediately
        await loadCachedSocialStats();
        
        // Then fetch fresh social stats in the background
        refreshSocialStats();
        
        // Preload posts data for all tabs
        postsService.preloadAllTabs();
      } else {
        setUser(null);
        setSocialStats({ postsCount: 0, commentsCount: 0, friendsCount: 0 });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      if (isAuthenticated) {
        console.log('AuthContext: Refreshing user data');
        const userInfo = await authService.getCurrentUser();
        console.log('AuthContext: Refreshed user info:', userInfo);
        setUser(userInfo);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const updateUser = (user: User) => {
    setUser(user);
  };

  const loadCachedSocialStats = async () => {
    try {
      const cachedStats = await AsyncStorage.getItem('socialStats');
      if (cachedStats) {
        const parsedStats = JSON.parse(cachedStats);
        console.log('AuthContext: Loaded cached social stats:', parsedStats);
        setSocialStats(parsedStats);
      }
    } catch (error) {
      console.error('Error loading cached social stats:', error);
    }
  };

  const saveSocialStats = async (stats: SocialStats) => {
    try {
      await AsyncStorage.setItem('socialStats', JSON.stringify(stats));
      console.log('AuthContext: Saved social stats to cache:', stats);
    } catch (error) {
      console.error('Error saving social stats to cache:', error);
    }
  };

  const refreshSocialStats = async () => {
    try {
      if (isAuthenticated) {
        console.log('AuthContext: Refreshing social stats');
        const stats = await authService.getSocialInfo();
        if (stats) {
          console.log('AuthContext: Received updated social stats:', stats);
          setSocialStats(stats);
          await saveSocialStats(stats);
        }
      }
    } catch (error) {
      console.error('Error refreshing social stats:', error);
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      // Clear cached social stats and posts on sign out
      setSocialStats({ postsCount: 0, commentsCount: 0, friendsCount: 0 });
      await AsyncStorage.removeItem('socialStats');
      await postsService.clearCache();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        socialStats,
        checkSession,
        refreshUserData,
        updateUser,
        refreshSocialStats,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
