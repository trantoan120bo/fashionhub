import axios from 'axios';

const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.startsWith('http')) {
    if (!process.env.REACT_APP_API_URL.includes('localhost') && !process.env.REACT_APP_API_URL.includes('127.0.0.1')) {
      return process.env.REACT_APP_API_URL;
    }
  }
  let url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  if (typeof window !== 'undefined' && window.location.hostname) {
    const hn = window.location.hostname;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hn)) {
      url = url.replace('localhost', hn).replace('127.0.0.1', hn);
    }
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Tự động gắn JWT token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý lỗi 401 toàn cục (token hết hạn), ngoại trừ endpoint đăng nhập /auth/login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
