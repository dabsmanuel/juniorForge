'use client'
import { useState, useEffect } from 'react';
import { authApi } from '../lib/util';

export const useAuth = () => {
  const [currentView, setCurrentView] = useState('login');
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        // Verify token and get admin data
        const result = await authApi.getCurrentAdmin(storedToken);
        
        // Handle both possible response structures
        const adminData = result.data || result;
        
        // Only allow approved admins to access dashboard
        if (adminData.status === 'approved') {
          setAdmin(adminData);
          setToken(storedToken);
          setCurrentView('dashboard');
        } else {
          // If admin is pending, rejected, or suspended
          localStorage.removeItem('adminToken');
          setCurrentView('login');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      setCurrentView('login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials); // Debug log
      const result = await authApi.login(credentials);
      console.log('Login response:', result); // Debug log
      
      // Handle different possible response structures
      const adminData = result.data?.admin || result.admin || result.data;
      const tokenData = result.data?.token || result.token;
      
      if (!adminData || !tokenData) {
        console.error('Invalid response structure:', result);
        return { 
          success: false, 
          message: 'Invalid response from server. Please try again.' 
        };
      }
      
      if (adminData.status === 'approved') {
        setAdmin(adminData);
        setToken(tokenData);
        localStorage.setItem('adminToken', tokenData);
        setCurrentView('dashboard');
        return { success: true, message: 'Login successful!' };
      } else if (adminData.status === 'pending') {
        return { 
          success: false, 
          message: 'Your account is pending approval. Please wait for admin approval.' 
        };
      } else if (adminData.status === 'rejected') {
        return { 
          success: false, 
          message: 'Your account has been rejected. Please contact support for more information.' 
        };
      } else if (adminData.status === 'suspended') {
        return { 
          success: false, 
          message: 'Your account has been suspended. Please contact support.' 
        };
      } else {
        return { 
          success: false, 
          message: `Account status: ${adminData.status}. Please contact support.` 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const handleRegister = async (userData) => {
    try {
      console.log('Attempting registration with:', userData); // Debug log
      const result = await authApi.register(userData);
      console.log('Registration response:', result); // Debug log
      
      return { 
        success: true, 
        message: result.message || 'Registration successful! Please wait for admin approval before you can login.' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setToken(null);
    setCurrentView('login');
  };

  const switchToRegister = () => setCurrentView('register');
  const switchToLogin = () => setCurrentView('login');

  return {
    currentView,
    admin,
    token,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    switchToRegister,
    switchToLogin,
    checkAuthStatus
  };
};