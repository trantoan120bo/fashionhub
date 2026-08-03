import api from './axiosInstance';

export const createOrder = (data) => api.post('/orders', data);
// data: { items: [{product_id, quantity, unit_price}], shipping_address }

export const getMyOrders = () => api.get('/orders');

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const getAllOrders = () => api.get('/orders/admin/all');

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });

export const cancelOrder = (id, reason) => api.post(`/orders/${id}/cancel`, { reason });

export const refundOrder = (id) => api.post(`/orders/${id}/refund`);
