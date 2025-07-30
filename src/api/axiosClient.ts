import axios from 'axios';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://harvices.websitebuilder.magicpagez.com:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with smart toast handling
axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    
    if (data && data.status === false) {
      const error = new Error(data.message || 'Request failed');
      error.response = response;
      error.backendError = true;
      return Promise.reject(error);
    }
    
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const url = error.config?.url || '';
    
    // Check if it's an auth endpoint
    const isAuthEndpoint = url.includes('/user/getotp') || url.includes('/user/login');
    
    // Handle 401 errors
    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    if (!isAuthEndpoint) {
      const message = error?.response?.data?.message || error?.message || 'Something went wrong';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;