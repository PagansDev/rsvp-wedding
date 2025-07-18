import { getSupabase } from '~/utils/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: any | null;
  error?: string;
}

export const authService = {
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const supabase = getSupabase();
      const redirectUrl = process.client
        ? `${window.location.origin}/auth/callback`
        : '/auth/callback';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      // OAuth flow: user and session will be handled in callback
      return { user: null, session: null, error: undefined };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async handleAuthCallback(): Promise<AuthResponse> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      let user: AuthUser | null = null;
      if (data.session && process.client) {
        try {
          localStorage.setItem('auth_token', data.session.access_token);
          localStorage.setItem(
            'auth_refresh_token',
            data.session.refresh_token
          );

          if (data.session.user) {
            user = {
              id: data.session.user.id,
              email: data.session.user.email || '',
              name: data.session.user.user_metadata?.full_name,
              avatar_url: data.session.user.user_metadata?.avatar_url,
            };
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
        } catch (error) {
          console.error('Error saving data to localStorage:', error);
        }
      }

      return {
        user,
        session: data.session,
        error: undefined,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();

      if (process.client) {
        try {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');
          localStorage.removeItem('auth_user');
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const supabase = getSupabase();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (process.server) return false;
    if (process.client) {
      try {
        const token = localStorage.getItem('auth_token');
        return !!token;
      } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
      }
    }
    return false;
  },

  getStoredUser(): AuthUser | null {
    if (process.server) return null;
    if (process.client) {
      try {
        const userStr = localStorage.getItem('auth_user');
        if (userStr) {
          try {
            return JSON.parse(userStr);
          } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
          }
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
      }
    }
    return null;
  },
};
