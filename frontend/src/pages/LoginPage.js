import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    // Validate email format
    if (!email) {
      return setError('Vui lòng nhập email');
    }
    if (!emailRegex.test(email)) {
      return setError('Email không đúng định dạng. Ví dụ: ten@email.com');
    }
    if (!password) {
      return setError('Vui lòng nhập mật khẩu');
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      loginUser(res.data.token, res.data.user);
      if (res.data.user?.role === 'admin') {
        navigate('/admin/orders', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, marginBottom: 32 }}>Đăng nhập</h2>
        
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
            gap: 10,
            animation: 'fadeIn 0.3s ease'
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <span style={{ lineHeight: 1.4 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>Email</label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Nhập email của bạn"
              autoComplete="email"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
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
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 12 }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: '#000', fontWeight: 'bold' }}>Đăng ký ngay</Link>
        </p>
        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid #eee' }}>
          <Link to="/admin-login" style={{ fontSize: 12, color: '#aaa', textDecoration: 'none' }}>Đăng nhập quyền quản trị</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
