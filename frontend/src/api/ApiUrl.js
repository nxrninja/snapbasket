// Simple API URL configuration
const getApiUrl = () => {
  // Use environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development: localhost
  if (import.meta.env.DEV || (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
    return 'http://localhost:8443/api/user';
  }
  
  // Production: relative path (same domain)
  return '/api/user';
};

export const BaseUrl = getApiUrl();
