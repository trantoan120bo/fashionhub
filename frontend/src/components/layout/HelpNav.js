import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function HelpNav({ activeTab, title, subtitle }) {
  const location = useLocation();

  const navItems = [
    { key: 'shipping', label: 'Chính sách vận chuyển', icon: '🚚', path: '/shipping-policy' },
    { key: 'return', label: 'Chính sách đổi trả', icon: '🔄', path: '/return-policy' },
    { key: 'size', label: 'Hướng dẫn chọn size', icon: '📐', path: '/size-guide' },
    { key: 'contact', label: 'Liên hệ hỗ trợ', icon: '📞', path: '/contact' },
  ];

  return (
    <div style={{ backgroundColor: '#fcfcfc', borderBottom: '1px solid #f0f0f0', marginBottom: 40 }}>
      {/* Banner Top */}
      <div style={{
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        color: '#ffffff',
        padding: '50px 20px 60px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '2.5px', color: '#9ca3af', marginBottom: 10, fontWeight: 700 }}>
            FASHIONHUB • TRUNG TÂM HỖ TRỢ
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            {title || 'Trung Tâm Hỗ Trợ Khách Hàng'}
          </h1>
          <p style={{ fontSize: 15, color: '#d1d5db', maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>
            {subtitle || 'Mọi giải đáp về chính sách giao hàng, quy trình đổi trả, bảng thông số chọn size và cổng tiếp nhận thông tin hỗ trợ 24/7.'}
          </p>
        </div>
      </div>

      {/* Container Điều Hướng Tabs */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginTop: -26,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 10
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.key || location.pathname === item.path;
            return (
              <Link
                key={item.key}
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: 14,
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#000000' : '#4b5563',
                  backgroundColor: isActive ? '#ffffff' : '#f9fafb',
                  boxShadow: isActive ? '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
                  border: isActive ? '2px solid #000000' : '1px solid #e5e7eb',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HelpNav;
