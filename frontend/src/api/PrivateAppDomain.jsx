// Use environment variable for private app domain, fallback to localhost for development
const getPrivateAppDomain = () => {
  // Check for Vercel environment variable first
  if (import.meta.env.VITE_PRIVATE_APP_DOMAIN) {
    return import.meta.env.VITE_PRIVATE_APP_DOMAIN;
  }
  
  // Check for Node environment
  if (import.meta.env.MODE === 'production' || import.meta.env.PROD) {
    // Use the same domain as the API for production
    return 'https://snapbasket.cloudcoderhub.in';
  }
  
  // Default to localhost for development
  return 'http://localhost:5175';
};

export const privateAppDomain = getPrivateAppDomain();