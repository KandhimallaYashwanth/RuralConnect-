
// A utility function for showing notifications using the existing notify function from main.js
export const notify = (message, type = 'info') => {
  // Check if we're in a browser environment and if the function exists
  if (typeof window !== 'undefined' && typeof window.notify === 'function') {
    return window.notify(message, type);
  } else {
    // Fallback if the global notify function isn't available
    console.log(`${type.toUpperCase()}: ${message}`);
    return null;
  }
};
