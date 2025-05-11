import api from './api';

const authService = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise with login result
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    // Store the token in localStorage
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with registration result
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Get the current user's profile
   * @returns {Promise} - Promise with user profile data
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Update the current user's profile
   * @param {Object} userData - User profile data to update
   * @returns {Promise} - Promise with updated user profile data
   */
  updateProfile: async (userData) => {
    const response = await api.put('/auth/me', userData);
    return response.data;
  },

  /**
   * Change the current user's password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} - Promise with password change result
   */
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  },

  /**
   * Request a password reset
   * @param {string} email - User email
   * @returns {Promise} - Promise with password reset request result
   */
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/password-reset', { email });
    return response.data;
  },

  /**
   * Reset password with token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise} - Promise with password reset result
   */
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return response.data;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

export default authService;
