const router = require('express').Router();
const { createOrder, calculateShipping, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, refundOrder, getOrderStats } = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { validateOrderInput, validateShippingInput } = require('../middlewares/validator');

router.post('/calculate-shipping', validateShippingInput, calculateShipping);
router.post('/', authenticate, validateOrderInput, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/admin/all', authenticate, isAdmin, getAllOrders);
router.get('/admin/stats', authenticate, isAdmin, getOrderStats);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, isAdmin, updateOrderStatus);
router.put('/:id/status', authenticate, isAdmin, updateOrderStatus);
router.post('/:id/cancel', authenticate, cancelOrder);
router.post('/:id/refund', authenticate, isAdmin, refundOrder);

module.exports = router;
