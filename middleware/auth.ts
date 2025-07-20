export default defineNuxtRouteMiddleware((to) => {
  // Only run on client
  if (process.client) {
    try {
      const authStore = useAuthStore();

      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        return navigateTo('/login');
      }
    } catch (error) {
      console.error(
        '🔴 [AUTH_MIDDLEWARE] Authentication middleware error:',
        error
      );
      // In case of error, redirect to login
      return navigateTo('/login');
    }
  }
});
