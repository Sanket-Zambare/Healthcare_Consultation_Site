// src/services/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Vite proxy redirects to https://localhost:44396
});

// Request Interceptor to add Authorization header
instance.interceptors.request.use(
  (config) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = userData?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error parsing user token from localStorage:', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle global errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - maybe token expired
      localStorage.removeItem('user');
      window.location.href = '/login'; // Force logout
    }
    return Promise.reject(error);
  }
);

export default instance;
