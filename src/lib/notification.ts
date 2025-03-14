
// A utility function for showing notifications using the existing notify function from main.js
export const notify = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  // Check if we're in a browser environment and if the function exists
  if (typeof window !== 'undefined' && typeof (window as any).notify === 'function') {
    return (window as any).notify(message, type);
  } else {
    // Fallback if the global notify function isn't available
    console.log(`${type.toUpperCase()}: ${message}`);
    return null;
  }
};
