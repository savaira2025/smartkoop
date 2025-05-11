import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      // This would be replaced with an actual API call
      // const response = await axios.get('/api/v1/users/me');
      // setCurrentUser(response.data);
      
      // For now, we'll use a mock user
      setCurrentUser({
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        full_name: 'Admin User'
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
      logout();
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with an actual API call
      // const response = await axios.post('/api/v1/auth/login', { email, password });
      // const { access_token, user } = response.data;
      
      // For now, we'll use a mock token and user
      const access_token = 'mock_token_12345';
      const user = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        full_name: 'Admin User'
      };
      
      // Store the token in local storage
      localStorage.setItem('token', access_token);
      
      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Set the current user
      setCurrentUser(user);
      
      setLoading(false);
      
      // Navigate to dashboard
      navigate('/dashboard');
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with an actual API call
      // const response = await axios.post('/api/v1/auth/register', userData);
      
      setLoading(false);
      
      // Navigate to login page
      navigate('/login');
      
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    
    // Remove the token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear the current user
    setCurrentUser(null);
    
    // Navigate to login page
    navigate('/login');
  };

  // Password reset request
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with an actual API call
      // await axios.post('/api/v1/auth/password-reset', { email });
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(err.response?.data?.detail || 'Password reset request failed');
      setLoading(false);
      return false;
    }
  };

  // Value object to be provided by the context
  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    login,
    register,
    logout,
    requestPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
