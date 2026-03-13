/**
 * Authentication Context
 * Manages user authentication state globally
 * Provides auth methods to all components via useAuth hook
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state on mount
   * Check if user has a valid token
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = AuthService.getToken();
        if (token && AuthService.isAuthenticated()) {
          // Try to get user profile
          const profile = await AuthService.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Register user
   */
  const register = async (firstName, lastName, email, password, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthService.login({ email, password });

      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await AuthService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change password
   */
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Use this hook to access auth context in any component
 * @returns {Object} - Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
