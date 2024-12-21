import axios from 'axios';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: '/api', // This will be proxied by Vite
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
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

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden access:', error.response.data);
          break;
        case 404:
          // Handle not found
          console.error('Resource not found:', error.response.data);
          break;
        case 500:
          // Handle server error
          console.error('Server error:', error.response.data);
          break;
      }
    } else if (error.request) {
      // Handle network error
      console.error('Network Error:', error.request);
    } else {
      // Handle other errors
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
