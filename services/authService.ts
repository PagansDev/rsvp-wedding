import { getSupabase } from '~/utils/supabase';
import type { AuthUser, AuthResponse } from '~/dtos/auth/authResponse';

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

      return { user: null, session: null, error: undefined };
    } catch (error) {
      console.error('Error in loginWithGoogle:', error);
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async handleAuthCallback(hash?: string): Promise<AuthResponse> {
    try {
      const supabase = getSupabase();

      // Try to get hash from sessionStorage first, then passed parameter, then window.location
      const storedHash = process.client
        ? sessionStorage.getItem('oauth_hash')
        : null;

      const hashToProcess = storedHash || hash || window.location.hash;

      // Process OAuth callback from hash
      if (process.client && hashToProcess) {
        const hashParams = new URLSearchParams(hashToProcess.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

          if (sessionError) {
            return { user: null, session: null, error: sessionError.message };
          }

          if (sessionData.session && sessionData.user) {
            const user: AuthUser = {
              id: sessionData.user.id,
              email: sessionData.user.email || '',
              name: sessionData.user.user_metadata?.full_name,
              avatar_url: sessionData.user.user_metadata?.avatar_url,
            };

            try {
              localStorage.setItem(
                'auth_token',
                sessionData.session.access_token
              );
              localStorage.setItem(
                'auth_refresh_token',
                sessionData.session.refresh_token
              );
              localStorage.setItem('auth_user', JSON.stringify(user));

              // Clean up stored hash
              if (process.client) {
                sessionStorage.removeItem('oauth_hash');
              }
            } catch (error) {
              console.error('Error saving to localStorage:', error);
            }

            return {
              user,
              session: sessionData.session,
              error: undefined,
            };
          }
        }
      }

      // Fallback to normal session check
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
      console.error('Error in handleAuthCallback:', error);
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
