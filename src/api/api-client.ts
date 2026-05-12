import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { ENV } from '../config/env';

const apiClient = axios.create({
  baseURL: '', // Using empty baseURL and prefixing hooks with /api for proxying
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    const onboardToken = localStorage.getItem('onboardToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (onboardToken && config.headers) {
      // Fallback to onboardToken for incomplete registrations
      config.headers.Authorization = `Bearer ${onboardToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (e.g., redirect to login or refresh token)
    if (error.response?.status === 401 && originalRequest) {
      // Logic for token refresh or logout can go here
      console.error('Unauthorized, please login again.');
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }

    // Handle other common errors
    const errorMessage = (error.response?.data as any)?.message || 'Something went wrong';
    
    // Show toast globally
    toast.error(errorMessage);
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
