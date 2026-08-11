const User = require('../models/User');
const Order = require('../models/Order');

// Lấy danh sách toàn bộ người dùng (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('id name email role cancel_count is_banned created_at')
      .sort({ cancel_count: -1, created_at: -1 })
      .lean();
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách người dùng bom hàng (cancel_count > 0)
exports.getSuspiciousUsers = async (req, res) => {
  try {
    const users = await User.find({ cancel_count: { $gt: 0 } })
      .select('id name email role cancel_count is_banned created_at')
      .sort({ cancel_count: -1, is_banned: -1 })
      .lean();
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cấm tài khoản vĩnh viễn (admin)
exports.banUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (userId === Number(req.user.id)) {
      return res.status(400).json({ message: 'Bạn không thể tự cấm chính mình' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    if (user.role === 'admin') return res.status(400).json({ message: 'Không thể cấm tài khoản admin' });
    if (user.is_banned) return res.status(400).json({ message: 'Tài khoản này đã bị cấm rồi' });

    user.is_banned = true;
    await user.save();

    res.json({ message: `Đã cấm tài khoản "${user.name}" vĩnh viễn` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Bỏ cấm tài khoản (admin)
exports.unbanUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    if (!user.is_banned) return res.status(400).json({ message: 'Tài khoản này chưa bị cấm' });

    user.is_banned = false;
    user.cancel_count = 0;
    await user.save();

    res.json({ message: `Đã mở khóa tài khoản "${user.name}" và đặt lại số lần hủy đơn` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đặt lại số lần hủy đơn (admin)
exports.resetCancelCount = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    user.cancel_count = 0;
    await user.save();

    res.json({ message: `Đã đặt lại số lần hủy đơn của "${user.name}"` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xem chi tiết một user (admin)
exports.getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await User.findOne({ id: userId })
      .select('id name email role cancel_count is_banned created_at')
      .lean();

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const orders = await Order.find({ user_id: userId }).lean();
    const total_orders = orders.length;
    const cancelled_orders = orders.filter(o => o.status === 'cancelled').length;
    const delivered_orders = orders.filter(o => o.status === 'delivered').length;
    const total_spent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const stats = {
      total_orders,
      cancelled_orders,
      delivered_orders,
      total_spent
    };

    res.json({ user, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đổi vai trò user (admin)
exports.updateUserRole = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ' });
    }
    if (userId === Number(req.user.id)) {
      return res.status(400).json({ message: 'Bạn không thể thay đổi vai trò của chính mình' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    user.role = role;
    await user.save();

    res.json({ message: `Đã đổi vai trò của "${user.name}" thành ${role === 'admin' ? 'Admin' : 'Khách hàng'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật trạng thái người dùng (admin: 'normal' | 'suspicious' | 'banned')
exports.updateUserStatus = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { status } = req.body;

    if (userId === Number(req.user.id)) {
      return res.status(400).json({ message: 'Bạn không thể tự đổi trạng thái của chính mình' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Không thể thay đổi trạng thái của tài khoản admin' });
    }

    if (status === 'banned') {
      user.is_banned = true;
      await user.save();
      return res.json({ message: `Đã chuyển trạng thái của "${user.name}" thành Cấm vĩnh viễn` });
    } else if (status === 'suspicious') {
      user.is_banned = false;
      if (user.cancel_count === 0) user.cancel_count = 1;
      await user.save();
      return res.json({ message: `Đã chuyển trạng thái của "${user.name}" thành Nghi ngờ bom hàng` });
    } else {
      user.is_banned = false;
      user.cancel_count = 0;
      await user.save();
      return res.json({ message: `Đã chuyển trạng thái của "${user.name}" thành Bình thường` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa user (admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (userId === Number(req.user.id)) {
      return res.status(400).json({ message: 'Bạn không thể tự xóa chính mình' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Không thể xóa tài khoản admin' });
    }

    await Order.deleteMany({ user_id: userId });
    await User.deleteOne({ id: userId });

    res.json({ message: `Đã xóa tài khoản "${user.name}" thành công` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa người dùng' });
  }
};

// Xem lịch sử đơn hàng của 1 user (admin)
exports.getUserOrders = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const orders = await Order.find({ user_id: userId })
      .select('id total_amount status cancel_reason created_at')
      .sort({ created_at: -1 })
      .limit(20)
      .lean();

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
