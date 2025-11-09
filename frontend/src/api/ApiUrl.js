// Use environment variable for API URL, fallback to relative path for same-domain deployment
const getApiUrl = () => {
  // Always check for environment variable first (override if needed)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For development mode, always use localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:8443/api/user';
  }
  
  // For production on Vercel: use relative path since backend is on same domain
  // Frontend and backend are both on Vercel, so we can use relative URLs
  if (import.meta.env.MODE === 'production' || import.meta.env.PROD) {
    return '/api/user';
  }
  
  // Default fallback to localhost
  return 'http://localhost:8443/api/user';
};

export const BaseUrl = getApiUrl();