import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';

// Create axios instance
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    const url = error.config?.url || '';

    // Don't show toast for Cloudbeds API 404 errors (endpoints might not be available)
    const isCloudbedsEndpoint = url.includes('/cloudbeds/');
    
    // Handle specific status codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        // Only show toast for non-Cloudbeds endpoints
        if (!isCloudbedsEndpoint) {
          toast.error('Resource not found');
        }
        // For Cloudbeds endpoints, silently fail (endpoint might not be available yet)
        break;
      case 409:
        toast.error(message);
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        // Only show toast for non-Cloudbeds endpoints
        if (!isCloudbedsEndpoint) {
          toast.error('Server error. Please try again later.');
        }
        break;
      default:
        // Only show toast for non-Cloudbeds endpoints
        if (!isCloudbedsEndpoint) {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  }
);

export default api;
