export default defineNuxtPlugin(() => {
  if (process.client) {
    // Clear hash immediately if it contains tokens
    if (window.location.hash && window.location.hash.includes('access_token')) {
      // Remove only the hash, keeping path and query
      const url = window.location.pathname + window.location.search;
      window.history.replaceState(window.history.state, '', url);
    }
  }
});
