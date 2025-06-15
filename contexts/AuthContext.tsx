import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

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

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkSession = async () => {
    try {
      console.log('AuthContext: Starting session check');
      setIsLoading(true);
      
      // Initialize auth service
      await authService.init();
      
      const sessionExists = await authService.checkSession();
      console.log('AuthContext: Session exists:', sessionExists);
      setIsAuthenticated(sessionExists);
      console.log('AuthContext: Updated isAuthenticated to:', sessionExists);

      if (sessionExists) {
        // Get user info if session exists
        const userInfo = await authService.getCurrentUser();
        console.log('AuthContext: User info:', userInfo);
        setUser(userInfo);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, checkSession, signOut }}>
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
