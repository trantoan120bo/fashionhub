import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/admin-login');
  };

  const navItems = [
    { path: '/admin/orders', label: '📊 Quản lý Đơn hàng' },
    { path: '/admin/products', label: '📦 Sản phẩm' },
    { path: '/admin/categories', label: '📁 Danh mục' },
    { path: '/admin/users-manage', label: '👥 Người dùng' },
    { path: '/admin/users', label: '🚫 Bom hàng' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Admin Navbar */}
      <header style={{
        background: '#1a1d20',
        color: '#fff',
        padding: '0 40px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>
            FashionHub <span style={{ color: '#38ef7d', fontSize: 12, fontWeight: 700, background: 'rgba(56,239,125,0.15)', padding: '3px 8px', borderRadius: 4, marginLeft: 6 }}>ADMIN</span>
          </Link>
        </div>

        {/* Admin Navigation */}
        <nav style={{ display: 'flex', gap: 6 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin/orders' && location.pathname === '/admin');
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: isActive ? '#fff' : '#aaa',
                  background: isActive ? '#2d3238' : 'transparent',
                  padding: '8px 16px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s ease',
                  borderBottom: isActive ? '2px solid #38ef7d' : '2px solid transparent'
                }}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile & actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 13, color: '#e0e0e0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: '#333', width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</span>
            <span>{user?.name || 'Admin'}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 14px',
              background: '#c0392b',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.2s'
            }}>
            Đăng xuất ➔
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, paddingBottom: 40 }}>
        <Outlet />
      </main>

      {/* Admin Dedicated Footer */}
      <footer style={{
        background: '#111418',
        color: '#7a828a',
        padding: '24px 40px',
        fontSize: 13,
        borderTop: '1px solid #22262b'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <strong style={{ color: '#fff' }}>FashionHub Administration Portal</strong> — Hệ thống quản lý đơn hàng & sản phẩm nội bộ.
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span>Trạng thái máy chủ: <strong style={{ color: '#27ae60' }}>Hoạt động 🟢</strong></span>
            <span>|</span>
            <span>© 2026 FashionHub Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminLayout;
