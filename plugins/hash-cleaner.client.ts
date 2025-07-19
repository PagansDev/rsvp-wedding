export default defineNuxtPlugin(() => {
  if (process.client) {
    // Clean hash from URL after authentication
    const cleanHash = () => {
      if (
        window.location.hash &&
        window.location.hash.includes('access_token')
      ) {
        // Remove only the hash, keeping the base URL
        const cleanUrl = window.location.href.split('#')[0];
        window.history.replaceState({}, document.title, cleanUrl);
      }
    };

    // Execute immediately
    cleanHash();

    // Execute when the route changes
    const router = useRouter();
    router.afterEach(() => {
      cleanHash();
    });
  }
});
