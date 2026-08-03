import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 40px' }}>
        <p style={{ fontSize: 16, marginBottom: 20 }}>Giỏ hàng trống</p>
        <Link to="/products" style={{ color: '#000', fontWeight: 'bold' }}>← Tiếp tục mua hàng</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {/* Danh sách sản phẩm */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Giỏ hàng ({totalItems} sản phẩm)</h2>
        {cartItems.map((item) => (
          <div key={item.key} style={{ display: 'flex', gap: 16, paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid #eee' }}>
            <img src={item.image || 'https://via.placeholder.com/100x120?text=No+Image'} alt={item.name}
              style={{ width: 100, height: 120, objectFit: 'cover', background: '#f5f5f5' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.name}</p>
              <p style={{ fontSize: 12, color: '#777', marginBottom: 8 }}>Size: {item.size} | Màu: {item.color}</p>
              <p style={{ color: '#c0392b', fontWeight: 'bold', fontSize: 15 }}>
                {Number(item.price).toLocaleString('vi-VN')}₫
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
              <button onClick={() => removeFromCart(item.key)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>✕</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #ddd', padding: '4px 8px' }}>
                <button onClick={() => updateQuantity(item.key, item.qty - 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                <span style={{ minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => updateQuantity(item.key, item.qty + 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
              <p style={{ fontWeight: 'bold', fontSize: 14 }}>
                {(item.price * item.qty).toLocaleString('vi-VN')}₫
              </p>
            </div>
          </div>
        ))}
        <Link to="/products" style={{ color: '#333', fontSize: 13 }}>← Tiếp tục mua hàng</Link>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div style={{ width: 300, border: '1px solid #ddd', padding: 24, flexShrink: 0 }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: 16 }}>Tóm tắt đơn hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
          <span>Tạm tính ({totalItems} sản phẩm)</span>
          <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
          <span>Phí vận chuyển</span>
          <span style={{ color: '#27ae60' }}>Miễn phí</span>
        </div>
        <div style={{ borderTop: '1px solid #ddd', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 16 }}>
          <span>Tổng cộng</span>
          <span style={{ color: '#c0392b' }}>{totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
        <button onClick={handleCheckout}
          style={{ width: '100%', marginTop: 20, padding: '14px', background: '#000', color: '#fff', fontWeight: 'bold', fontSize: 14, border: 'none', cursor: 'pointer' }}>
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  );
}

export default CartPage;
