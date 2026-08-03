const router = require('express').Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, refundOrder } = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/admin/all', authenticate, isAdmin, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, isAdmin, updateOrderStatus);
router.post('/:id/cancel', authenticate, cancelOrder);
router.post('/:id/refund', authenticate, isAdmin, refundOrder);

module.exports = router;
