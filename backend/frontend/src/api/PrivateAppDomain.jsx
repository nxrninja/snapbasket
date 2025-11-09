// Private app domain configuration for redirects
const getPrivateAppDomain = () => {
  // Use environment variable if explicitly set (highest priority)
  if (import.meta.env.VITE_PRIVATE_APP_DOMAIN) {
    return import.meta.env.VITE_PRIVATE_APP_DOMAIN;
  }
  
  // Check if we're running in browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    const isVercel = hostname.includes('vercel.app') || hostname.includes('vercel.com');
    
    // Development: use localhost
    if (isLocalhost) {
      return 'http://localhost:5175';
    }
    
    // Production on Vercel: use current domain
    if (isVercel) {
      return window.location.origin; // Use current Vercel URL
    }
  }
  
  // Check for production mode
  if (import.meta.env.MODE === 'production' || import.meta.env.PROD) {
    // Use the deployed Vercel URL for production
    return 'https://snapbasket-102.vercel.app';
  }
  
  // Default to localhost for development
  return 'http://localhost:5175';
};

export const privateAppDomain = getPrivateAppDomain();