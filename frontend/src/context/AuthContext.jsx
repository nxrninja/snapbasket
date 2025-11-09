import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { BaseUrl } from '../api/ApiUrl';
import { privateAppDomain } from '../api/PrivateAppDomain';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [recentLogin, setRecentLogin] = useState(false);
  const [isAuthReady , setIsAuthReady] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();

  const isTokenNearExpiry = (token) => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 < Date.now() + 5 * 60 * 1000; 
    } catch {
      return true;
    }
  };

  const checkAuth = useCallback(async () => {
    if (recentLogin) {
      setIsLoading(false);
      setRecentLogin(false);
      return;
    }

    setIsLoading(true);
    const cachedAuth = localStorage.getItem('authState');
    if (cachedAuth) {
      const { accessToken: cachedToken } = JSON.parse(cachedAuth);
      if (!isTokenNearExpiry(cachedToken)) {
        setIsAuthenticated(true);
        setAccessToken(cachedToken);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await axios.get(`${BaseUrl}/refreshtoken`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.accessToken) {
        setIsAuthenticated(true);
        setAccessToken(response.data.accessToken);
        localStorage.setItem('authState', JSON.stringify({ accessToken: response.data.accessToken }));
      } else {
        setIsAuthenticated(false);
        setAccessToken(null);
        localStorage.removeItem('authState');
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          navigate('/login', { replace: true, state: { from: location } });
        }
      }
    } catch (error) {
      console.error('Refresh token check failed:');
      setIsAuthenticated(false);
      setAccessToken(null);
      localStorage.removeItem('authState');
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true, state: { from: location } });
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location, recentLogin]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (accessToken && !isTokenNearExpiry(accessToken)) {
      const { exp } = jwtDecode(accessToken);
      const timeout = exp * 1000 - Date.now() - 5 * 60 * 1000;
      const timer = setTimeout(async () => {
        await refreshAccessToken();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [accessToken]);

  const login = async (email, password) => {
    const response = await axios.post(
      `${BaseUrl}/login`,
      { email, password },
      { withCredentials: true }
    );
    if (response.status === 200 && response.data.accessToken) {
      setIsAuthenticated(true);
      setAccessToken(response.data.accessToken);
      setRecentLogin(true);
      localStorage.setItem('authState', JSON.stringify({ accessToken: response.data.accessToken }));
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } else {
      throw new Error(response.data?.message || response.data?.error || 'Login failed: No access token');
    }
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl}refreshtoken`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.accessToken) {
        setIsAuthenticated(true);
        setAccessToken(response.data.accessToken);
        localStorage.setItem('authState', JSON.stringify({ accessToken: response.data.accessToken }));
        return response.data.accessToken;
      }
      throw new Error('Refresh failed');
    } catch (error) {
      console.error('Silent refresh failed:');
      setIsAuthenticated(false);
      setAccessToken(null);
      localStorage.removeItem('authState');
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true, state: { from: location } });
      }
      return null;
    }
  }, [navigate, location]);

const logout = async () => {
  let token = accessToken;
  try {
     await axios.post(
      `${BaseUrl}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    setIsAuthenticated(false);
    setAccessToken(null);
    localStorage.removeItem('authState'); 
    navigate('/login')  
  } catch (error) {
    console.error('Logout failed:');
  }
};


const accountdelete = async () => {
  let token = accessToken;
  try {
    await axios.delete(`${BaseUrl}/users/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    
    setIsAuthenticated(false);
    setAccessToken(null);
    localStorage.removeItem('authState');
    window.location.replace(privateAppDomain);
  } catch (error) {
    console.error('Delete failed:');
  }
};

  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      let token = accessToken;
      if (!token || isTokenNearExpiry(token)) {
        token = await refreshAccessToken();
        if (!token) throw new Error('Authentication failed: No valid token');
      }

      try {
        const response = await axios({
          url,
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        return response;
      } catch (error) {
        if (error.response?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return axios({
              url,
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              },
              withCredentials: true,
            });
          }
        }
        if (error.response?.status === 403) {
          setIsAuthenticated(false);
    setAccessToken(null);
    localStorage.removeItem('authState');
    navigate('/login', { replace: true });
          throw new Error('Unauthorized: You do not have access to this resource.');
        }
        throw error;
      }
    },
    [accessToken, refreshAccessToken, navigate]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        accessToken,
        login,
        logout,
        accountdelete,
        refreshAccessToken,
        makeAuthenticatedRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);