export default defineNuxtRouteMiddleware((to) => {
  // Only execute on client
  if (process.client) {
    try {
      const authStore = useAuthStore();

      // Check if user is already authenticated
      if (authStore.isAuthenticated) {
        return navigateTo('/admin');
      }
    } catch (error) {
      console.error('Error in redirection middleware:', error);
    }
  }
});
