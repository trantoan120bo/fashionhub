const pool = require('../config/database');

// Lấy danh sách toàn bộ người dùng (admin)
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, name, email, role, cancel_count, is_banned, created_at
       FROM users
       ORDER BY cancel_count DESC, created_at DESC`
        );
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy danh sách người dùng bom hàng (cancel_count > 0)
exports.getSuspiciousUsers = async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, name, email, role, cancel_count, is_banned, created_at
       FROM users
       WHERE cancel_count > 0
       ORDER BY cancel_count DESC, is_banned DESC`
        );
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cấm tài khoản vĩnh viễn (admin)
exports.banUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Không cho phép admin tự ban chính mình
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Bạn không thể tự cấm chính mình' });
        }

        const [rows] = await pool.query('SELECT id, name, role, is_banned FROM users WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        const user = rows[0];
        if (user.role === 'admin') return res.status(400).json({ message: 'Không thể cấm tài khoản admin' });
        if (user.is_banned) return res.status(400).json({ message: 'Tài khoản này đã bị cấm rồi' });

        await pool.query('UPDATE users SET is_banned = 1 WHERE id = ?', [id]);
        res.json({ message: `Đã cấm tài khoản "${user.name}" vĩnh viễn` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Bỏ cấm tài khoản (admin)
exports.unbanUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query('SELECT id, name, is_banned FROM users WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        const user = rows[0];
        if (!user.is_banned) return res.status(400).json({ message: 'Tài khoản này chưa bị cấm' });

        // Khi mở khóa, reset cancel_count về 0 để cho cơ hội mới
        await pool.query('UPDATE users SET is_banned = 0, cancel_count = 0 WHERE id = ?', [id]);
        res.json({ message: `Đã mở khóa tài khoản "${user.name}" và đặt lại số lần hủy đơn` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Đặt lại số lần hủy đơn (admin)
exports.resetCancelCount = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query('SELECT id, name FROM users WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        await pool.query('UPDATE users SET cancel_count = 0 WHERE id = ?', [id]);
        res.json({ message: `Đã đặt lại số lần hủy đơn của "${rows[0].name}"` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xem chi tiết một user (admin)
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            `SELECT id, name, email, role, cancel_count, is_banned, created_at FROM users WHERE id = ?`, [id]
        );
        if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        // Thống kê đơn hàng
        const [orderStats] = await pool.query(
            `SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                SUM(CASE WHEN status != 'cancelled' THEN total_amount ELSE 0 END) as total_spent
             FROM orders WHERE user_id = ?`, [id]
        );

        res.json({ user: rows[0], stats: orderStats[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Đổi vai trò user (admin)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['customer', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Bạn không thể thay đổi vai trò của chính mình' });
        }

        const [rows] = await pool.query('SELECT id, name FROM users WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ message: `Đã đổi vai trò của "${rows[0].name}" thành ${role === 'admin' ? 'Admin' : 'Khách hàng'}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa user (admin)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Bạn không thể tự xóa chính mình' });
        }

        const [rows] = await pool.query('SELECT id, name, role FROM users WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        if (rows[0].role === 'admin') {
            return res.status(400).json({ message: 'Không thể xóa tài khoản admin' });
        }

        // Xóa user (orders sẽ vẫn còn vì FK không cascade trên orders)
        // Đặt user_id của orders thành NULL hoặc giữ nguyên tùy chính sách
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: `Đã xóa tài khoản "${rows[0].name}"` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xem lịch sử đơn hàng của 1 user (admin)
exports.getUserOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const [orders] = await pool.query(
            'SELECT id, total_amount, status, cancel_reason, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
            [id]
        );
        res.json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
