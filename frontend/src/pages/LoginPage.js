import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

function SocialButton({ label, bgColor, textColor, border, onClick, icon }) {
  return (
    <button onClick={onClick} type="button"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        width: '100%', padding: '11px', border: border || 'none',
        background: bgColor, color: textColor, fontWeight: 'bold', fontSize: 14,
        cursor: 'pointer', marginBottom: 12, boxSizing: 'border-box'
      }}>
      {icon}
      {label}
    </button>
  );
}

function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await login(form.email, form.password);
      loginUser(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleMockOAuth = async (provider) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${provider}/mock`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      loginUser(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || `Đăng nhập ${provider} thất bại`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, marginBottom: 32 }}>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          {[['email', 'Email', 'email'], ['password', 'Mật khẩu', 'password']].map(([name, label, type]) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>{label}</label>
              <input type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
          ))}
          {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', fontWeight: 'bold', fontSize: 14, border: 'none', cursor: 'pointer', marginBottom: 16 }}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#ddd' }} />
          <span style={{ margin: '0 12px', color: '#999', fontSize: 13 }}>Hoặc đăng nhập với</span>
          <div style={{ flex: 1, height: 1, background: '#ddd' }} />
        </div>

        {/* Google Mock Button */}
        <SocialButton
          label="Đăng nhập với Google"
          bgColor="#fff"
          textColor="#333"
          border="1px solid #ddd"
          onClick={() => handleMockOAuth('google')}
          icon={
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
          }
        />

        {/* Facebook Mock Button */}
        <SocialButton
          label="Đăng nhập với Facebook"
          bgColor="#1877F2"
          textColor="#fff"
          onClick={() => handleMockOAuth('facebook')}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
          }
        />

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
