const pool = require('../config/database');

exports.createOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { fullname, phone, address, note, total_amount, payment_method, items } = req.body;
    if (!fullname || !phone || !address || !items?.length) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
    }

    // === KIỂM TRA BOM HÀNG ===
    const [userRows] = await conn.query('SELECT is_banned, cancel_count FROM users WHERE id = ?', [req.user.id]);
    if (userRows.length && userRows[0].is_banned) {
      await conn.rollback();
      return res.status(403).json({
        message: '⛔ Tài khoản của bạn đã bị khóa do hủy đơn hàng quá nhiều lần. Vui lòng liên hệ shop để được hỗ trợ.',
        banned: true
      });
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0' });
    }
    const [rows, extra] = await conn.query(
      'INSERT INTO orders (user_id, fullname, phone, address, note, total_amount, status) VALUES (?,?,?,?,?,?,?)',
      [req.user.id, fullname, phone, address, note || '', total_amount, 'pending']
    );
    const orderId = extra.insertId;
    for (const item of items) {
      const [productRows] = await conn.query('SELECT stock, name FROM products WHERE id = ?', [item.product_id]);
      if (!productRows.length) {
        throw new Error('Sản phẩm không tồn tại');
      }
      if (productRows[0].stock < item.quantity) {
        throw new Error(`Sản phẩm "${productRows[0].name}" đã hết hàng hoặc không đủ số lượng`);
      }

      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES (?,?,?,?,?,?)',
        [orderId, item.product_id, item.quantity, item.price, item.size || '', item.color || '']
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }
    await conn.commit();
    res.status(201).json({ message: 'Đặt hàng thành công', order_id: orderId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(400).json({ message: err.message || 'Lỗi server' });
  } finally { conn.release(); }
};


exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]
    );
    for (const o of orders) {
      const [items] = await pool.query(
        'SELECT oi.*, p.name AS product_name, (SELECT TOP 1 pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.id ASC) AS image_url FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [o.id]
      );
      o.items = items;
    }
    res.json({ orders });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.getOrderById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    const order = rows[0];
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    const [items] = await pool.query(
      'SELECT oi.*, p.name AS product_name, (SELECT TOP 1 pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.id ASC) AS image_url FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [order.id]
    );
    res.json({ order: { ...order, items } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    for (const o of orders) {
      const [items] = await pool.query(
        'SELECT oi.*, p.name AS product_name, (SELECT TOP 1 pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.id ASC) AS image_url FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [o.id]
      );
      o.items = items;
    }
    res.json({ orders });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' });

    // Nếu chuyển sang cancelled mà trước đó không phải cancelled thì phải hoàn lại stock
    if (status === 'cancelled') {
      const [rows] = await pool.query('SELECT status FROM orders WHERE id = ?', [req.params.id]);
      if (rows.length && rows[0].status !== 'cancelled') {
        const [items] = await pool.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [req.params.id]);
        for (const item of items) {
          await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
        }
        await pool.query("UPDATE orders SET status = ?, refund_status = 'pending_refund' WHERE id = ?", [status, req.params.id]);
        return res.json({ message: 'Cập nhật trạng thái thành công' });
      }
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.cancelOrder = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    const order = rows[0];

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Không thể hủy đơn hàng lúc này vì đơn hàng đang được xử lý' });
    }

    const createdDate = new Date(order.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdDate) / (1000 * 60 * 60);

    if (diffHours > 48) {
      return res.status(400).json({ message: 'Đã qua 2 ngày, không thể hủy đơn hàng' });
    }

    const orderId = req.params.id;
    const { reason } = req.body;

    // Hoàn lại stock
    const [items] = await pool.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
    for (const item of items) {
      await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    await pool.query("UPDATE orders SET status = 'cancelled', cancel_reason = ?, refund_status = 'pending_refund' WHERE id = ?", [reason || '', orderId]);

    // === HỆ THỐNG CHỐNG BOM HÀNG ===
    // Tăng cancel_count của user
    await pool.query('UPDATE users SET cancel_count = cancel_count + 1 WHERE id = ?', [req.user.id]);

    // Lấy cancel_count mới sau khi tăng
    const [userRows] = await pool.query('SELECT cancel_count FROM users WHERE id = ?', [req.user.id]);
    const cancelCount = userRows[0]?.cancel_count || 0;

    let banned = false;
    let warningMessage = '';

    if (cancelCount >= 3) {
      // Ban vĩnh viễn nếu hủy từ lần 3 trở lên
      await pool.query('UPDATE users SET is_banned = 1 WHERE id = ?', [req.user.id]);
      banned = true;
      warningMessage = '⛔ Tài khoản của bạn đã bị khóa vĩnh viễn do hủy đơn hàng quá 2 lần. Vui lòng liên hệ shop để được hỗ trợ.';
    } else if (cancelCount === 2) {
      warningMessage = `⚠️ Cảnh báo: Bạn đã hủy đơn ${cancelCount} lần. Nếu hủy thêm 1 lần nữa, tài khoản sẽ bị khóa vĩnh viễn.`;
    } else if (cancelCount === 1) {
      warningMessage = `⚠️ Lưu ý: Bạn đã hủy đơn ${cancelCount} lần. Hủy quá 2 lần sẽ bị khóa tài khoản.`;
    }

    res.json({
      message: 'Đã hủy đơn hàng thành công',
      cancel_count: cancelCount,
      banned,
      warning: warningMessage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


exports.refundOrder = async (req, res) => {
  try {
    await pool.query("UPDATE orders SET refund_status = 'refunded' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Đã xác nhận hoàn tiền' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
