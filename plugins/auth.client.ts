export default defineNuxtPlugin(async () => {
  try {
    const authStore = useAuthStore();

    await authStore.initializeAuth();
  } catch (error) {
    console.error('Error initializing authentication:', error);
  }
});
