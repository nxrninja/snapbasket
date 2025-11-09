// API URL configuration for SnapBasket
const getApiUrl = () => {
  // Use environment variable if explicitly set (highest priority)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're running in browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    const isVercel = hostname.includes('vercel.app') || hostname.includes('vercel.com');
    
    // Development: use localhost backend
    if (isLocalhost) {
      return 'http://localhost:8443/api/user';
    }
    
    // Production on Vercel: use relative path (backend is on same domain via /api routes)
    if (isVercel || import.meta.env.PROD || import.meta.env.MODE === 'production') {
      return '/api/user';
    }
  }
  
  // Default: use relative path (works for same-domain deployments)
  // Only use localhost if explicitly in dev mode AND not in browser
  if (import.meta.env.DEV && typeof window === 'undefined') {
    return 'http://localhost:8443/api/user';
  }
  
  // Production: relative path (same domain)
  return '/api/user';
};

export const BaseUrl = getApiUrl();
