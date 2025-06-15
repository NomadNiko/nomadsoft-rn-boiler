// Temporary simple auth service until server configuration is fixed
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  email: string;
}

class SimpleAuthService {
  private currentUser: User | null = null;

  async signIn(email: string, password: string): Promise<{ status: string; user?: User }> {
    try {
      // For demo purposes, accept any email/password combination
      // In production, this would make a real API call
      if (email && password) {
        this.currentUser = { email };
        await AsyncStorage.setItem('user', JSON.stringify(this.currentUser));
        await AsyncStorage.setItem('isLoggedIn', 'true');
        return { status: 'OK', user: this.currentUser };
      } else {
        return { status: 'FIELD_ERROR' };
      }
    } catch (error) {
      console.error('Simple auth sign in error:', error);
      return { status: 'ERROR' };
    }
  }

  async signUp(email: string, password: string): Promise<{ status: string; user?: User }> {
    // For demo purposes, same as sign in
    return this.signIn(email, password);
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('isLoggedIn');
  }

  async checkSession(): Promise<boolean> {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const userString = await AsyncStorage.getItem('user');

      if (isLoggedIn === 'true' && userString) {
        this.currentUser = JSON.parse(userString);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Simple auth session check error:', error);
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export default new SimpleAuthService();
