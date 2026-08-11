import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder, calculateShippingApi } from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PROVINCES = [
  'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
  'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
  'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
  'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
  'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
  'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
  'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: '',
    phone: '',
    province: 'Hồ Chí Minh',
    addressDetail: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const isInitialFree = totalPrice >= 1000000;
  const [shippingData, setShippingData] = useState({
    lat: 10.7721,
    lng: 106.6983,
    distance_km: 3.5,
    shipping_fee: isInitialFree ? 0 : 20000,
    fee_breakdown: isInitialFree
      ? '🎉 MIỄN PHÍ VẬN CHUYỂN (0đ) - Áp dụng đơn từ 1.000.000 VNĐ trong bán kính 10km!'
      : '20.000 VNĐ (Gói cước cố định dưới 5km)',
    formatted_address: ''
  });
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingNotice, setShippingNotice] = useState('');
  const [shippingError, setShippingError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Tự động định vị và tính phí ship khi người dùng thay đổi địa chỉ
  const handleCalculateShipping = useCallback(async (customAddress) => {
    const targetAddress = customAddress || `${form.addressDetail}, ${form.province}`;
    if (!form.addressDetail.trim() && !customAddress) return;

    setCalculatingShipping(true);
    setShippingNotice('');
    setShippingError('');
    try {
      const res = await calculateShippingApi(targetAddress, totalPrice);
      if (res.data && res.data.success) {
        setShippingData({
          lat: res.data.lat,
          lng: res.data.lng,
          distance_km: res.data.distance_km,
          shipping_fee: res.data.shipping_fee,
          fee_breakdown: res.data.fee_breakdown,
          formatted_address: res.data.formatted_address
        });
        setShippingNotice('📍 Đã xác định tọa độ GPS và tự động tính cước giao hàng!');
      }
    } catch (err) {
      console.error('Lỗi tính phí giao hàng:', err);
      const errMsg = err.response?.data?.details || err.response?.data?.message || 'Không thể định vị địa chỉ này';
      setShippingError(errMsg);
    } finally {
      setCalculatingShipping(false);
    }
  }, [form.addressDetail, form.province, totalPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.addressDetail.trim().length > 3) {
        handleCalculateShipping();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [form.addressDetail, form.province, handleCalculateShipping]);

  if (user && user.role === 'admin') {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 36, background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
        <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#111827' }}>Tài khoản Quản trị viên (Admin)</h3>
        <p style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Tài khoản Admin dành riêng cho nhiệm vụ quản lý đơn hàng & sản phẩm hệ thống. Admin không thực hiện đặt hàng hay đặt giao hàng.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link to="/admin/orders" style={{ padding: '12px 24px', background: '#111827', color: '#34d399', textDecoration: 'none', fontWeight: 'bold', borderRadius: 10, fontSize: 14 }}>
            ➔ Về trang Quản lý Đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const finalTotalAmount = totalPrice + (shippingData?.shipping_fee || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullname || !form.phone || !form.addressDetail || !form.province) {
      return setError('Vui lòng điền đầy đủ thông tin giao hàng');
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      return setError('Số điện thoại phải có 10 số và bắt đầu bằng số 0');
    }

    setLoading(true);
    setError('');

    const fullAddress = `${form.addressDetail}, ${form.province}`;

    try {
      const orderData = {
        fullname: form.fullname,
        phone: form.phone,
        address: fullAddress,
        note: form.note,
        total_amount: finalTotalAmount,
        shipping_fee: shippingData.shipping_fee,
        lat: shippingData.lat,
        lng: shippingData.lng,
        distance_km: shippingData.distance_km,
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
      const orderId = res.data.order_id;
      clearCart();

      if (paymentMethod === 'bank') {
        navigate(`/payment/${orderId}`, { replace: true });
      } else {
        alert('🎉 Đặt hàng thành công! Đơn hàng của bạn đã được xác nhận và đang tiến hành xử lý.');
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Top Banner Step Bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #f0f0f0', padding: '20px 0', marginBottom: 32 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>FASHIONHUB CHECKOUT</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '4px 0 0 0' }}>Xác Nhận & Thanh Toán Đơn Hàng</h1>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, fontWeight: 600 }}>
            <Link to="/cart" style={{ color: '#059669', textDecoration: 'none' }}>🛒 Giỏ hàng</Link>
            <span style={{ color: '#d1d5db' }}>➔</span>
            <span style={{ color: '#111827', fontWeight: 800, background: '#f3f4f6', padding: '6px 14px', borderRadius: 20 }}>2. Nhận hàng & Thanh toán</span>
            <span style={{ color: '#d1d5db' }}>➔</span>
            <span style={{ color: '#9ca3af' }}>3. Hoàn tất</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36, alignItems: 'start' }}>
        
        {/* CỘT TRÁI: FORM NHẬN HÀNG */}
        <form onSubmit={handleSubmit} style={{ background: '#ffffff', padding: 36, borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #111827', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>📍</span> Thông Tin Giao Hàng & Định Vị Tự Động
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Họ và tên người nhận <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Số điện thoại liên hệ <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Ví dụ: 0901234567"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Tỉnh / Thành phố <span style={{ color: '#ef4444' }}>*</span></label>
            <select
              name="province"
              value={form.province}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, outline: 'none', background: '#ffffff', boxSizing: 'border-box' }}
            >
              {PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Địa chỉ chi tiết (Số nhà, tên đường...) <span style={{ color: '#ef4444' }}>*</span></label>
              <button
                type="button"
                onClick={() => handleCalculateShipping()}
                disabled={calculatingShipping}
                style={{
                  background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                  padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', gap: 6
                }}>
                {calculatingShipping ? '⏳ Đang định vị...' : '🌐 Thử định vị ngay'}
              </button>
            </div>
            <input
              name="addressDetail"
              value={form.addressDetail}
              onChange={handleChange}
              placeholder="Ví dụ: 10 Nguyễn Văn Công, Phường 3, Gò Vấp..."
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* KHUNG HIỂN THỊ ĐỊNH VỊ ĐỊA LÝ & CƯỚC VẬN CHUYỂN */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1.5px solid #e2e8f0',
            borderRadius: 14,
            padding: 20,
            marginBottom: 28
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🛰️</span> Định Vị Bản Đồ GPS OpenStreetMap & Cước Phí
              </div>
              {calculatingShipping && <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}>⏳ Đang quét tọa độ...</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>📍 Tọa độ GPS địa lý</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 13, marginTop: 2 }}>
                  Lat: {shippingData.lat} | Lng: {shippingData.lng}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>📏 Khoảng cách từ Kho Shop</div>
                <div style={{ fontWeight: 800, color: '#2563eb', fontSize: 15, marginTop: 2 }}>
                  {shippingData.distance_km} km
                </div>
              </div>
            </div>

            <div style={{
              background: shippingData.shipping_fee === 0 ? '#ecfdf5' : '#ffffff',
              border: shippingData.shipping_fee === 0 ? '1.5px solid #a7f3d0' : '1px solid #e2e8f0',
              padding: '14px 18px',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: shippingData.shipping_fee === 0 ? '#047857' : '#64748b' }}>
                  🚚 Cước phí giao hàng áp dụng:
                </div>
                <div style={{ fontSize: 12, color: shippingData.shipping_fee === 0 ? '#065f46' : '#475569', marginTop: 2, fontWeight: 600 }}>
                  {shippingData.fee_breakdown}
                </div>
              </div>

              {shippingData.shipping_fee === 0 ? (
                <span style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.3px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  <span>🎉</span> MIỄN PHÍ (0đ)
                </span>
              ) : (
                <span style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#dc2626',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  {shippingData.shipping_fee.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>

            {shippingNotice && (
              <div style={{ fontSize: 12, color: '#059669', marginTop: 10, fontWeight: 700 }}>
                {shippingNotice}
              </div>
            )}

            {shippingError && (
              <div style={{ fontSize: 12, color: '#dc2626', marginTop: 10, fontWeight: 700, background: '#fef2f2', padding: '10px 14px', borderRadius: 8, border: '1px solid #fecaca' }}>
                ⚠️ {shippingError}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Ghi chú đơn hàng (không bắt buộc)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="Ghi chú thêm về giờ giao hàng, địa điểm bàn giao..."
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #111827', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>💳</span> Phương Thức Thanh Toán
          </h2>

          <div style={{ display: 'grid', gap: 14, marginBottom: 28 }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 20px',
              borderRadius: 12,
              border: paymentMethod === 'cod' ? '2px solid #111827' : '1px solid #e5e7eb',
              background: paymentMethod === 'cod' ? '#f9fafb' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                style={{ accentColor: '#111827', width: 20, height: 20 }}
              />
              <span style={{ fontSize: 28 }}>💵</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#111827' }}>Thanh toán khi nhận hàng (COD)</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Thanh toán tiền mặt cho shipper sau khi mở hộp đồng kiểm hàng.</div>
              </div>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 20px',
              borderRadius: 12,
              border: paymentMethod === 'bank' ? '2px solid #2563eb' : '1px solid #e5e7eb',
              background: paymentMethod === 'bank' ? '#eff6ff' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
                style={{ accentColor: '#2563eb', width: 20, height: 20 }}
              />
              <span style={{ fontSize: 28 }}>🏦</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: paymentMethod === 'bank' ? '#1d4ed8' : '#111827' }}>
                  Chuyển khoản Ngân hàng (Mã QR VietQR)
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Quét mã QR chuyển khoản tự động MB Bank (Chủ TK: TRẦN NGỌC TOÀN).</div>
              </div>
            </label>
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: 14, marginBottom: 20, fontWeight: 700, background: '#fef2f2', padding: '12px 16px', borderRadius: 10, border: '1px solid #fecaca' }}>⚠️ {error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: '#111827',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 16,
              border: 'none',
              borderRadius: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}>
            {loading ? '⏳ ĐANG XỬ LÝ ĐƠN HÀNG...' : (paymentMethod === 'bank' ? 'TIẾP TỤC CHUYỂN KHOẢN MÃ QR ➔' : 'XÁC NHẬN ĐẶT HÀNG (COD) ➔')}
          </button>
        </form>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG STICKY */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: 28, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'sticky', top: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: '#111827', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🛒 Sản Phẩm Giỏ Hàng</span>
            <span style={{ fontSize: 13, background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 20 }}>{cartItems.length} món</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24, maxHeight: 320, overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item.key} style={{ display: 'flex', gap: 14, fontSize: 13 }}>
                <img src={item.image} alt="" style={{ width: 56, height: 68, objectFit: 'cover', borderRadius: 8, background: '#f3f4f6', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4, lineHeight: 1.4 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Size: {item.size} | Màu: {item.color}</div>
                  <div style={{ fontSize: 13, color: '#4b5563', marginTop: 4, fontWeight: 600 }}>
                    {item.qty} × {Number(item.price).toLocaleString('vi-VN')}₫
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: '#111827', alignSelf: 'center', fontSize: 14 }}>
                  {(item.price * item.qty).toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: '#4b5563' }}>
              <span>Tạm tính tiền hàng:</span>
              <span style={{ fontWeight: 700, color: '#111827' }}>{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#4b5563' }}>
              <span>Phí giao hàng ({shippingData.distance_km} km):</span>
              <span style={{ color: shippingData.shipping_fee === 0 ? '#059669' : '#111827', fontWeight: 800 }}>
                {shippingData.shipping_fee === 0 ? '🎉 MIỄN PHÍ (0đ)' : `+${shippingData.shipping_fee.toLocaleString('vi-VN')}₫`}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 900,
              fontSize: 20,
              marginTop: 16,
              paddingTop: 16,
              borderTop: '2px dashed #e5e7eb',
              color: '#111827'
            }}>
              <span>TỔNG CỘNG:</span>
              <span style={{ color: '#dc2626' }}>{finalTotalAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;
