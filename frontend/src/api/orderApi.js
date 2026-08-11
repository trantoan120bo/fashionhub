import api from './axiosInstance';

export const calculateShippingApi = (address, subtotal) => api.post('/orders/calculate-shipping', { address, subtotal });

export const createOrder = (data) => api.post('/orders', data);
// data: { items: [{product_id, quantity, unit_price}], shipping_address }

export const getMyOrders = () => api.get('/orders');

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const getAllOrders = () => api.get('/orders/admin/all');

export const getOrderStats = () => api.get('/orders/admin/stats');

export const updateOrderStatus = (id, status, cancel_reason) =>
  api.put(`/orders/${id}/status`, { status, cancel_reason });

export const cancelOrder = (id, reason) => api.post(`/orders/${id}/cancel`, { reason });

export const refundOrder = (id) => api.post(`/orders/${id}/refund`);
