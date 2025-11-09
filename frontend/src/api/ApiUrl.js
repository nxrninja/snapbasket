// Use environment variable for API URL, fallback to relative path for same-domain deployment
const getApiUrl = () => {
  // Always check for environment variable first (override if needed)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're running on Vercel (production deployment)
  // Vercel sets VERCEL=1 and VERCEL_ENV environment variables
  const isVercel = typeof window !== 'undefined' && 
    (window.location.hostname.includes('vercel.app') || 
     window.location.hostname.includes('vercel.com'));
  
  // For development mode (localhost), always use localhost backend
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1');
  
  if (isLocalhost) {
    return 'http://localhost:8443/api/user';
  }
  
  // For production on Vercel: use relative path since backend is on same domain
  // This works because both frontend and backend are deployed on the same Vercel domain
  if (isVercel || import.meta.env.MODE === 'production' || import.meta.env.PROD) {
    return '/api/user';
  }
  
  // Default: use relative path (will work for same-domain deployments)
  return '/api/user';
};

export const BaseUrl = getApiUrl();