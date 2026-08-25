// Authentication storage utility function to determine whether to use localStorage or sessionStorage based on the 'rememberMe' flag.
// Storage helper, so the rest of the app doesn't need to know which storage is active

function getAuthStorage(): Storage {
  return localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
}

export { getAuthStorage };