const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^0\d{9}$/;

exports.register = async (req, res) => {
  try {
    let { name, email, password, phone } = req.body;

    name = (name || '').trim();
    email = (email || '').trim().toLowerCase();
    password = (password || '').trim();
    phone = (phone || '').trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không đúng định dạng. Ví dụ: ten@email.com' });
    }

    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0' });
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email này đã được đăng ký. Vui lòng sử dụng email khác.' });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(409).json({ message: 'Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const maxUser = await User.findOne().sort('-id');
    const newId = maxUser && maxUser.id ? maxUser.id + 1 : 1;

    const newUser = await User.create({
      id: newId,
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: 'customer'
    });

    res.status(201).json({ message: 'Đăng ký thành công', user_id: newUser.id });
  } catch (err) {
    console.error('Register Error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email hoặc Số điện thoại này đã được sử dụng trên hệ thống.' });
    }
    res.status(500).json({ message: err.message || 'Lỗi server' });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = (email || '').trim().toLowerCase();
    password = (password || '').trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không đúng định dạng. Vui lòng nhập đúng email.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản Email này chưa được đăng ký trong hệ thống.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác với mật khẩu đã đăng ký trước đó.' });
    }

    if (user.is_banned) {
      return res.status(403).json({
        message: '⛔ Tài khoản của bạn đã bị khóa vĩnh viễn do vi phạm chính sách bom hàng. Vui lòng liên hệ shop để được hỗ trợ.',
        banned: true
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.user.id) }).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
