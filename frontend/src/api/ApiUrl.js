// Use environment variable for API URL, fallback to localhost for development
const getApiUrl = () => {
  // Always check for environment variable first (for Vercel or custom deployments)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For development mode, always use localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:8443/api/user';
  }
  
  // For production builds, use the production API URL
  // NOTE: Make sure this domain actually exists and is accessible!
  // If your backend is deployed elsewhere, update this URL or set VITE_API_URL in Vercel
  if (import.meta.env.MODE === 'production' || import.meta.env.PROD) {
    // Update this to your actual backend URL, or set VITE_API_URL in Vercel environment variables
    return 'https://api-snapbasket.cloudcoderhub.in/api/user';
  }
  
  // Default fallback to localhost
  return 'http://localhost:8443/api/user';
};

export const BaseUrl = getApiUrl();