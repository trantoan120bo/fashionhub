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
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');

        // Trim input
        const email = form.email.trim().toLowerCase();
        const password = form.password.trim();

        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu');
            setLoading(false);
            return;
        }

        try {
            const res = await login(email, password);
            if (res.data.user.role !== 'admin') {
                setError('Bạn không có quyền truy cập khu vực Admin');
                return;
            }
            loginUser(res.data.token, res.data.user);
            navigate('/admin/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu quản trị không chính xác');
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

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>Email Quản Trị</label>
                        <input
                            type="text"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
                            autoComplete="off"
                        />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>Mật Khẩu</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                style={{ width: '100%', padding: '12px 40px 12px 12px', border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
                                autoComplete="new-password"
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
