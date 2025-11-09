// Use environment variable for API URL, fallback to localhost for development
const getApiUrl = () => {
  // Check for Vercel environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check for Node environment
  if (import.meta.env.MODE === 'production' || import.meta.env.PROD) {
    return 'https://api-snapbasket.cloudcoderhub.in/api/user';
  }
  
  // Default to localhost for development
  return 'http://localhost:8443/api/user';
};

export const BaseUrl = getApiUrl();