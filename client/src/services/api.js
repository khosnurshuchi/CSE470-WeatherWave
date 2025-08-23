import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Email verification failed' };
    }
  },

  resendVerification: async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to resend verification email' };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send reset link' };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// User API calls
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/user/profile', userData);

      // Update stored user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  deleteAccount: async () => {
    try {
      const response = await api.delete('/user/account');

      // Clear stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete account' };
    }
  }
};

// Weather API calls
export const weatherAPI = {
  // Get all user locations with current weather
  getLocations: async () => {
    try {
      const response = await api.get('/weather/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get locations' };
    }
  },

  // Add new location - NOW SUPPORTS NICKNAME
  addLocation: async (locationData) => {
    try {
      const response = await api.post('/weather/locations', locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add location' };
    }
  },

  // Remove location - NOW USES userLocationId
  removeLocation: async (userLocationId) => {
    try {
      const response = await api.delete(`/weather/locations/${userLocationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove location' };
    }
  },

  // Set default location - NOW USES userLocationId
  setDefaultLocation: async (userLocationId) => {
    try {
      const response = await api.put(`/weather/locations/${userLocationId}/default`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to set default location' };
    }
  },

  // NEW: Search locations for autocomplete
  searchLocations: async (query) => {
    try {
      const response = await api.get(`/weather/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search locations' };
    }
  },

  // NEW: Get all available locations
  getAllLocations: async () => {
    try {
      const response = await api.get('/weather/locations/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get all locations' };
    }
  },

  // Get weather data for specific location - STILL USES locationId (global location ID)
  getLocationWeather: async (locationId, unit = 'celsius') => {
    try {
      const response = await api.get(`/weather/locations/${locationId}/weather?unit=${unit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get weather data' };
    }
  },

  // Get hourly weather trends - STILL USES locationId (global location ID)
  getHourlyTrends: async (locationId, unit = 'celsius', hours = 24) => {
    try {
      const response = await api.get(`/weather/locations/${locationId}/hourly?unit=${unit}&hours=${hours}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get hourly trends' };
    }
  },

  // Update weather data - STILL USES locationId (global location ID)
  updateWeatherData: async (locationId, weatherData) => {
    try {
      const response = await api.post(`/weather/locations/${locationId}/update`, weatherData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update weather data' };
    }
  },

  // Weather alerts - NO CHANGES
  getAlerts: async (isActive = true, limit = 50) => {
    try {
      const response = await api.get(`/weather/alerts?isActive=${isActive}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get weather alerts' };
    }
  },

  markAlertAsRead: async (alertId) => {
    try {
      const response = await api.put(`/weather/alerts/${alertId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark alert as read' };
    }
  },

  dismissAlert: async (alertId) => {
    try {
      const response = await api.put(`/weather/alerts/${alertId}/dismiss`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to dismiss alert' };
    }
  }
};

// Auth utility functions
export const authUtils = {
  getToken: () => localStorage.getItem('token'),

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default api;