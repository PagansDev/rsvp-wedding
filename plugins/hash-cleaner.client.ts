export default defineNuxtPlugin(() => {
  if (process.client) {
    // Capture hash before Vue Router processes it
    const originalHash = window.location.hash;

    if (originalHash && originalHash.includes('access_token')) {
      // Store the hash temporarily
      sessionStorage.setItem('oauth_hash', originalHash);
    }
  }
});
