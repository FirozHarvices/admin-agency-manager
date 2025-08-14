import axios from 'axios';
import { toast } from 'sonner';

export const setupAxios = () => {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  axios.interceptors.request.use(
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

  axios.interceptors.response.use(
    (response) => {
      // Check if backend response indicates failure even with 200 status
      const data = response.data;
      if (data && data.status === false) {
        // Convert backend error to rejected promise
        const error = new Error(data.message || 'Request failed');
      error.response = response;
        return Promise.reject(error);
      }
      return response;
    },
    (error) => {
      const status = error?.response?.status;
      const isLoginEndpoint = error.config?.url?.includes('/auth/') || 
                             error.config?.url?.includes('/user/getotp') ||
                             error.config?.url?.includes('/user/login') ||
                             error.config?.url?.includes('/user/adminLogin');

      // Handle 401 errors (real HTTP 401)
      if (status === 401) {
        if (!isLoginEndpoint) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }

      // Don't show global toast for login endpoints
      if (status !== 401 && !isLoginEndpoint) {
        const message = error?.response?.data?.message || 'Something went wrong';
        toast.error("Request Failed", {
          description: message,
        });
      }

      return Promise.reject(error);
    }
  );
};