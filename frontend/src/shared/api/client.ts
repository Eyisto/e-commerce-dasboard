import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const DEFAULT_API_URL = `${window.location.protocol}//${window.location.hostname}:8000`;
const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    const message = (error.response?.data as { message?: string })?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export { apiClient, USE_MOCK, API_URL };
