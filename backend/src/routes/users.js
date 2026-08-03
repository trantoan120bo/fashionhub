const router = require('express').Router();
const {
    getAllUsers, getSuspiciousUsers,
    banUser, unbanUser, resetCancelCount,
    getUserById, updateUserRole, deleteUser, getUserOrders
} = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Tất cả route đều yêu cầu đăng nhập với quyền admin
router.get('/', authenticate, isAdmin, getAllUsers);
router.get('/suspicious', authenticate, isAdmin, getSuspiciousUsers);
router.get('/:id', authenticate, isAdmin, getUserById);
router.get('/:id/orders', authenticate, isAdmin, getUserOrders);
router.patch('/:id/role', authenticate, isAdmin, updateUserRole);
router.post('/:id/ban', authenticate, isAdmin, banUser);
router.post('/:id/unban', authenticate, isAdmin, unbanUser);
router.post('/:id/reset-cancel', authenticate, isAdmin, resetCancelCount);
router.delete('/:id', authenticate, isAdmin, deleteUser);

module.exports = router;

