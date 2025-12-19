import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('keyorbit_token');
    const userData = localStorage.getItem('keyorbit_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Verify token is still valid by making a quick API call
        authAPI.getProfile().catch(() => {
          // Token is invalid, clear auth data
          clearAuthData();
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuthData();
      }
    }
    setLoading(false);
  };

  const clearAuthData = () => {
    localStorage.removeItem('keyorbit_user');
    localStorage.removeItem('keyorbit_token');
    localStorage.removeItem('keyorbit_remember');
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data.user && response.data.token) {
        localStorage.setItem('keyorbit_user', JSON.stringify(response.data.user));
        localStorage.setItem('keyorbit_token', response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('keyorbit_token');
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuthData();
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('keyorbit_token');
    const userData = localStorage.getItem('keyorbit_user');
    return !!token && !!userData;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const refreshUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.user) {
        localStorage.setItem('keyorbit_user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return false;
    }
  };

  return { 
    user, 
    loading, 
    login, 
    logout, 
    isAuthenticated,
    hasRole,
    hasAnyRole,
    refreshUserData,
    checkAuthStatus
  };
};