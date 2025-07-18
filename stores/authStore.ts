import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService, type AuthUser } from '~/services/authService';
import { authorizationService } from '~/services/authorizationService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    if (process.server) return false;
    return (
      authService.isAuthenticated() && !!user.value && isUserAuthorized.value
    );
  });

  const isUserAuthorized = computed(() => {
    if (!user.value?.email) return false;
    return authorizationService.isEmailAuthorized(user.value.email);
  });

  const getUser = computed(() => user.value);
  const getError = computed(() => error.value);
  const getIsLoading = computed(() => isLoading.value);

  const setUser = (newUser: AuthUser | null) => {
    user.value = newUser;
  };

  const setError = (newError: string | null) => {
    error.value = newError;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.loginWithGoogle();
      if (response.error) {
        setError(response.error);
        return false;
      }
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAuthCallback = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.handleAuthCallback();
      if (response.error) {
        setError(response.error);
        return false;
      }
      if (response.user) {
        const authValidation = authorizationService.validateUserAuthorization(
          response.user.email
        );
        if (!authValidation.isAuthorized) {
          setError(authValidation.message || 'Usuário não autorizado');
          await logout();
          return false;
        }
        setUser(response.user);
      }
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          setUser(storedUser);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initializeAuth = async () => {
    if (process.server) return;
    try {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          const authValidation = authorizationService.validateUserAuthorization(
            storedUser.email
          );
          if (!authValidation.isAuthorized) {
            await logout();
            return;
          }
          setUser(storedUser);
        } else {
          await checkAuth();
        }
      }
    } catch (error) {
      // silent error
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isUserAuthorized,
    getUser,
    getError,
    getIsLoading,
    setUser,
    setError,
    setLoading,
    loginWithGoogle,
    handleAuthCallback,
    logout,
    checkAuth,
    initializeAuth,
  };
});
