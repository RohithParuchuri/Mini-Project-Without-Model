/**
 * API Service - Backend Integration
 * Handles all HTTP requests to the backend API
 * Includes error handling and token management
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - { firstName, lastName, email, password, confirmPassword }
   * @returns {Promise} - { user, accessToken, refreshToken }
   */
  static async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store tokens
      if (data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      return data.data;
    } catch (error) {
      throw new Error(error.message || 'Registration error');
    }
  }

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { user, accessToken, refreshToken }
   */
  static async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens
      if (data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      return data.data;
    } catch (error) {
      throw new Error(error.message || 'Login error');
    }
  }

  /**
   * Get user profile
   * @returns {Promise} - User profile data
   */
  static async getProfile() {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get profile');
      }

      return data.data.user;
    } catch (error) {
      throw new Error(error.message || 'Profile error');
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - { firstName, lastName, bio, profileImage }
   * @returns {Promise} - Updated user data
   */
  static async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data.data.user;
    } catch (error) {
      throw new Error(error.message || 'Update profile error');
    }
  }

  /**
   * Change password
   * @param {Object} passwordData - { currentPassword, newPassword, confirmPassword }
   * @returns {Promise} - Success message
   */
  static async changePassword(passwordData) {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Change password error');
    }
  }

  /**
   * Logout user
   * @returns {Promise} - Success
   */
  static async logout() {
    try {
      const token = localStorage.getItem('accessToken');

      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      // Clear tokens from storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return { success: true };
    } catch (error) {
      // Clear tokens even if request fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return { success: true };
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if token exists
   */
  static isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Get access token
   * @returns {string} - Access token or null
   */
  static getToken() {
    return localStorage.getItem('accessToken');
  }
}

export default AuthService;
