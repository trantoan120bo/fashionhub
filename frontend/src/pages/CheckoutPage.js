import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderApi';
import { useCart } from '../context/CartContext';

function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: '', phone: '', address: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullname || !form.phone || !form.address) return setError('Vui lòng điền đầy đủ thông tin');

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phone)) return setError('Số điện thoại phải có 10 số và bắt đầu bằng số 0');
    setLoading(true); setError('');
    try {
      const orderData = {
        fullname: form.fullname,
        phone: form.phone,
        address: form.address,
        note: form.note,
        total_amount: totalPrice,
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
      };
      const res = await createOrder(orderData);
      clearCart();
      navigate(`/order-success/${res.data.order_id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {/* Form thông tin */}
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24 }}>Thông tin giao hàng</h2>
        {[['fullname', 'Họ và tên'], ['phone', 'Số điện thoại'], ['address', 'Địa chỉ']].map(([name, label]) => (
          <div key={name} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>{label} *</label>
            <input name={name} value={form[name]} onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box' }} />
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 'bold' }}>Ghi chú</label>
          <textarea name="note" value={form.note} onChange={handleChange} rows={3}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
        </div>

        {/* Phương thức thanh toán */}
        <div style={{ padding: 16, background: '#f9f9f9', border: '1px solid #eee', marginBottom: 20 }}>
          <p style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 14 }}>Phương thức thanh toán</p>

          {/* COD */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12,
            padding: '12px 16px', border: `2px solid ${paymentMethod === 'cod' ? '#000' : '#ddd'}`,
            background: paymentMethod === 'cod' ? '#f0f0f0' : '#fff', borderRadius: 4
          }}>
            <input type="radio" name="payment" value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              style={{ accentColor: '#000' }} />
            <span style={{ fontSize: 22 }}>💵</span>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>Thanh toán khi nhận hàng (COD)</div>
              <div style={{ fontSize: 12, color: '#777' }}>Trả tiền mặt khi nhận hàng</div>
            </div>
          </label>

          {/* Chuyển khoản */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            padding: '12px 16px', border: `2px solid ${paymentMethod === 'bank' ? '#1565c0' : '#ddd'}`,
            background: paymentMethod === 'bank' ? '#e8f0fe' : '#fff', borderRadius: 4
          }}>
            <input type="radio" name="payment" value="bank"
              checked={paymentMethod === 'bank'}
              onChange={() => setPaymentMethod('bank')}
              style={{ accentColor: '#1565c0' }} />
            <span style={{ fontSize: 22 }}>🏦</span>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>Chuyển khoản ngân hàng</div>
              <div style={{ fontSize: 12, color: '#777' }}>Quét mã QR để thanh toán</div>
            </div>
          </label>

          {/* QR hiện khi chọn chuyển khoản */}
          {paymentMethod === 'bank' && (
            <div style={{
              marginTop: 16, padding: 20, background: '#fff', border: '1px solid #c5d8ff',
              borderRadius: 8, textAlign: 'center'
            }}>
              <p style={{ fontWeight: 'bold', color: '#1565c0', marginBottom: 12, fontSize: 14 }}>
                📲 Quét mã QR để thanh toán
              </p>
              <img
                src="/qr-payment.png"
                alt="QR thanh toán"
                style={{
                  width: 200, height: 200, objectFit: 'contain', border: '2px solid #1565c0',
                  borderRadius: 8, marginBottom: 12
                }}
              />
              <div style={{
                fontSize: 13, background: '#f0f4ff', padding: '12px 16px', borderRadius: 6,
                textAlign: 'left', lineHeight: 1.8
              }}>
                <div>🏦 <strong>Ngân hàng:</strong> VietQR / Napas 247</div>
                <div>💳 <strong>Số TK:</strong> 19203667799</div>
                <div>👤 <strong>Chủ TK:</strong> TRAN VAN NAM</div>
                <div>💰 <strong>Số tiền:</strong> <span style={{ color: '#c0392b', fontWeight: 'bold' }}>{totalPrice.toLocaleString('vi-VN')}₫</span></div>
                <div>📝 <strong>Nội dung:</strong> FashionHub - {form.phone || 'SĐT của bạn'}</div>
              </div>
              <p style={{ fontSize: 12, color: '#888', marginTop: 10 }}>
                ⚠️ Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán
              </p>
            </div>
          )}
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button type="submit" disabled={loading}
          style={{ padding: '14px 40px', background: '#000', color: '#fff', fontWeight: 'bold', fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
        </button>
      </form>

      {/* Tóm tắt */}
      <div style={{ width: 300, border: '1px solid #ddd', padding: 24, flexShrink: 0 }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: 16 }}>Đơn hàng của bạn</h3>
        {cartItems.map((item) => (
          <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
            <span>{item.name} × {item.qty} ({item.size}/{item.color})</span>
            <span>{(item.price * item.qty).toLocaleString('vi-VN')}₫</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: 12, marginTop: 8, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span>Tổng</span>
          <span style={{ color: '#c0392b' }}>{totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
