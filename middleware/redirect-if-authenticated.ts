export default defineNuxtRouteMiddleware((to) => {
  // Only execute on client
  if (process.client) {
    try {
      const authStore = useAuthStore();

      // Wait a bit for the store to be initialized
      setTimeout(() => {
        // If user is already authenticated, redirect to admin
        if (authStore.isAuthenticated) {
          navigateTo('/admin');
        }
      }, 1500);
    } catch (error) {
      console.error('Error in redirection middleware:', error);
    }
  }
});
