import { ref, readonly } from 'vue';
import { authService, type AuthUser } from '~/services/authService';

export function useAuth() {
  const user = ref<AuthUser | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const loginWithGoogle = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.loginWithGoogle();

      if (response.error) {
        error.value = response.error;
        return false;
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const handleAuthCallback = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.handleAuthCallback();

      if (response.error) {
        error.value = response.error;
        return false;
      }

      if (response.user) {
        user.value = response.user;
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;

    try {
      await authService.logout();
      user.value = null;
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  };

  const checkAuth = async () => {
    isLoading.value = true;

    try {
      const currentUser = await authService.getCurrentUser();
      user.value = currentUser;

      if (!currentUser) {
        // Try to get from localStorage
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          user.value = storedUser;
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated() && !!user.value;
  };

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loginWithGoogle,
    handleAuthCallback,
    logout,
    checkAuth,
    isAuthenticated,
  };
}
