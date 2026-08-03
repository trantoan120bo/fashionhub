import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

function AdminLoginPage() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await login(form.email, form.password);
            if (res.data.user.role !== 'admin') {
                setError('Bạn không có quyền truy cập khu vực Admin');
                return;
            }
            loginUser(res.data.token, res.data.user);
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f4f4f4'
        }}>
            <div style={{
                width: 400,
                padding: 40,
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>Admin Portal</h1>
                    <p style={{ color: '#666', fontSize: 13, marginTop: 8 }}>Vui lòng đăng nhập quyền quản trị</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>Email Quản Trị</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
                            placeholder="admin@fashionhub.com"
                        />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>Mật Khẩu</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'background 0.3s'
                        }}
                    >
                        {loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP HỆ THỐNG'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <a href="/" style={{ color: '#666', fontSize: 12, textDecoration: 'none' }}>← Quay lại trang chủ</a>
                </div>
            </div>
        </div>
    );
}

export default AdminLoginPage;
