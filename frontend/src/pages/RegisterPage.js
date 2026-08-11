import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^0\d{9}$/;

function RegisterPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Trim all inputs
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const password = form.password.trim();
    const confirm = form.confirm.trim();

    // Validate required fields
    if (!name) return setError('Vui lòng nhập họ và tên');
    if (!email) return setError('Vui lòng nhập email');
    if (!emailRegex.test(email)) return setError('Email không đúng định dạng. Ví dụ: ten@email.com');

    // Validate phone (optional but if entered, must be valid)
    if (phone && !phoneRegex.test(phone)) {
      return setError('Số điện thoại phải có 10 số và bắt đầu bằng số 0. Ví dụ: 0912345678');
    }

    if (!password) return setError('Vui lòng nhập mật khẩu');
    if (password !== confirm) return setError('Mật khẩu xác nhận không khớp');

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      const res = await login(email, password);
      loginUser(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại mạng hoặc máy chủ Backend.');
      } else {
        setError(err.response?.data?.message || 'Đăng ký thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div style={{ width: 420 }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, marginBottom: 32 }}>Tạo tài khoản</h2>
        
        {error && (
          <div style={{
            background: '#fdf2f2',
            border: '1px solid #f8b4b4',
            color: '#9b1c1c',
            padding: '12px 14px',
            borderRadius: 6,
            fontSize: 13,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <span style={{ lineHeight: 1.4 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>Họ và tên *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nhập họ và tên"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>Email *</label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Nhập email. Ví dụ: ten@email.com"
              autoComplete="email"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>
              Số điện thoại
              <span style={{ fontWeight: 'normal', color: '#999', marginLeft: 6 }}>(không bắt buộc)</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Ví dụ: 0912345678"
              autoComplete="tel"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>Mật khẩu *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Ít nhất 8 ký tự, gồm hoa, thường, số, đặc biệt"
                autoComplete="new-password"
                style={{ width: '100%', padding: '10px 40px 10px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>Xác nhận mật khẩu *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                style={{ width: '100%', padding: '10px 40px 10px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', fontWeight: 'bold', fontSize: 14, border: 'none', borderRadius: 4, cursor: 'pointer', marginBottom: 16 }}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13 }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#000', fontWeight: 'bold' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
