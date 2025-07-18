export default defineNuxtRouteMiddleware((to) => {
  // Only run on client
  if (process.client) {
    try {
      const authStore = useAuthStore();

      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        // If not authenticated, redirect to login
        return navigateTo('/login');
      }
    } catch (error) {
      console.error('Authentication middleware error:', error);
      // In case of error, redirect to login
      return navigateTo('/login');
    }
  }
});
