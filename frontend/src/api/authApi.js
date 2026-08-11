import api from './axiosInstance';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, password, phone) =>
  api.post('/auth/register', { name, email, password, phone });

export const getProfile = () => api.get('/auth/profile');
