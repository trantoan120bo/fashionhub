import api from './axiosInstance';

export const getAllUsers = () => api.get('/users');
export const getSuspiciousUsers = () => api.get('/users/suspicious');
export const getUserById = (id) => api.get(`/users/${id}`);
export const getUserOrders = (id) => api.get(`/users/${id}/orders`);
export const updateUserRole = (id, role) => api.patch(`/users/${id}/role`, { role });
export const banUser = (id) => api.post(`/users/${id}/ban`);
export const unbanUser = (id) => api.post(`/users/${id}/unban`);
export const resetCancelCount = (id) => api.post(`/users/${id}/reset-cancel`);
export const deleteUser = (id) => api.delete(`/users/${id}`);

