import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPERTOKENS_CONFIG } from '../config/supertokens';

const API_BASE = `${SUPERTOKENS_CONFIG.apiDomain}${SUPERTOKENS_CONFIG.apiBasePath}`;

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

class AuthService {
  private tokens: AuthTokens = {};

  async signUp(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anti-csrf': 'VIA_TOKEN',
        },
        credentials: 'include',
        body: JSON.stringify({
          formFields: [
            { id: 'email', value: email },
            { id: 'password', value: password },
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.log('Sign up error response:', text);

        if (text.includes('use https on your apiDomain')) {
          throw new Error(
            'Server configuration error: The server needs to be configured with HTTPS domain.'
          );
        }

        // Try to parse as JSON for SuperTokens error format
        try {
          const errorData = JSON.parse(text);
          return errorData;
        } catch {
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
      }

      const data = await response.json();
      console.log('Auth response data:', data);

      if (data.status === 'OK') {
        console.log('Auth successful, handling auth success');
        await this.handleAuthSuccess(response);
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anti-csrf': 'VIA_TOKEN',
        },
        credentials: 'include',
        body: JSON.stringify({
          formFields: [
            { id: 'email', value: email },
            { id: 'password', value: password },
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.log('Sign in error response:', text);

        if (text.includes('use https on your apiDomain')) {
          throw new Error(
            'Server configuration error: The server needs to be configured with HTTPS domain.'
          );
        }

        // Try to parse as JSON for SuperTokens error format
        try {
          const errorData = JSON.parse(text);
          return errorData;
        } catch {
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
      }

      const data = await response.json();
      console.log('Auth response data:', data);

      if (data.status === 'OK') {
        console.log('Auth successful, handling auth success');
        await this.handleAuthSuccess(response);
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await fetch(`${API_BASE}/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Clear tokens regardless
      await this.clearTokens();
    }
  }

  async checkSession(): Promise<boolean> {
    try {
      console.log('Checking session...');
      // For SuperTokens, session is managed via cookies
      // Check if we have session info stored locally first
      const sessionData = await AsyncStorage.getItem('supertokens-session');
      console.log('Local session data:', sessionData);
      
      if (!sessionData) {
        console.log('No local session data found');
        return false;
      }

      // For initial login, trust the local session data
      // Only verify with server if session data exists for some time
      const sessionTime = await AsyncStorage.getItem('supertokens-session-time');
      const now = Date.now();
      
      if (!sessionTime || (now - parseInt(sessionTime)) < 5000) {
        // Session is recent (less than 5 seconds), trust it
        console.log('Recent session, trusting local data');
        return true;
      }

      // Verify session with the server for older sessions
      const response = await fetch(`${SUPERTOKENS_CONFIG.apiDomain}/sessioninfo`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Session check response status:', response.status);
      
      if (response.ok) {
        console.log('Session is valid');
        return true;
      } else {
        console.log('Session is invalid, clearing tokens');
        // Session is invalid, clear local data
        await this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Session check error:', error);
      // Don't clear tokens on network error if we have local session
      const sessionData = await AsyncStorage.getItem('supertokens-session');
      return sessionData === 'active';
    }
  }

  private async handleAuthSuccess(response: Response) {
    // For SuperTokens, tokens are managed via httpOnly cookies
    // We just need to store a flag that we have an active session
    await AsyncStorage.setItem('supertokens-session', 'active');
    await AsyncStorage.setItem('supertokens-session-time', Date.now().toString());

    // Extract any user info from the response if available
    const frontToken = response.headers.get('front-token');
    if (frontToken) {
      await AsyncStorage.setItem('front-token', frontToken);
    }
    
    console.log('Auth success handled, session stored');
  }

  private async clearTokens() {
    this.tokens = {};
    await AsyncStorage.removeItem('supertokens-session');
    await AsyncStorage.removeItem('supertokens-session-time');
    await AsyncStorage.removeItem('front-token');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  }

  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.tokens.accessToken && { Authorization: `Bearer ${this.tokens.accessToken}` }),
    };
  }
}

export default new AuthService();
