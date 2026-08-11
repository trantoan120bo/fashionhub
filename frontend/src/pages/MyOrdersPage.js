import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận (COD)', color: '#e67e22', bg: '#fff3e0' },
  paid: { label: 'Đã thanh toán (Mã QR)', color: '#27ae60', bg: '#e8f5e9' },
  confirmed: { label: 'Đã xác nhận', color: '#1565c0', bg: '#e3f2fd' },
  shipping: { label: 'Đang giao hàng', color: '#7b1fa2', bg: '#f3e5f5' },
  delivered: { label: 'Đã giao hàng', color: '#27ae60', bg: '#e8f5e9' },
  cancelled: { label: 'Đã hủy', color: '#c0392b', bg: '#fdecea' }
};

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data.orders || []))
      .catch(err => console.error('Lỗi khi lấy danh sách đơn hàng:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', fontSize: 16 }}>Đang tải danh sách đơn hàng của bạn...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 16, borderBottom: '2px solid #000' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>📦 Đơn hàng của tôi</h1>
          <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Xem lại toàn bộ lịch sử đơn hàng, trạng thái xử lý và thông tin sản phẩm.</p>
        </div>
        <Link to="/products" style={{ padding: '8px 18px', background: '#000', color: '#fff', textDecoration: 'none', fontWeight: 'bold', borderRadius: 6, fontSize: 13 }}>
          + Mua thêm sản phẩm
        </Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ background: '#fff', padding: 60, borderRadius: 12, border: '1px solid #eee', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
          <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Bạn chưa có đơn hàng nào</h3>
          <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>Hãy chọn những sản phẩm thời trang yêu thích và trải nghiệm mua sắm ngay nhé!</p>
          <Link to="/products" style={{ display: 'inline-block', padding: '12px 24px', background: '#000', color: '#fff', textDecoration: 'none', fontWeight: 'bold', borderRadius: 6, fontSize: 14 }}>
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map((o) => {
            const st = STATUS_MAP[o.status] || { label: o.status, color: '#333', bg: '#f5f5f5' };
            return (
              <div key={o.id} style={{
                background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0',
                padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                {/* Header đơn hàng */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f1f3f5' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: 15 }}>Đơn hàng #{o.id}</span>
                    <span style={{ fontSize: 12, color: '#888', marginLeft: 12 }}>
                      {new Date(o.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                    color: st.color, background: st.bg, border: `1px solid ${st.color}`
                  }}>
                    {st.label}
                  </span>
                </div>

                {/* Lý do hủy nếu bị Admin / User hủy */}
                {o.status === 'cancelled' && (
                  <div style={{ background: '#fff0f0', border: '1px solid #ffcdd2', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                    <strong style={{ color: '#c0392b' }}>🚫 Lý do hủy:</strong> {o.cancel_reason || 'Chưa ghi rõ'}<br />
                    <span style={{ color: '#27ae60', fontWeight: 'bold', marginTop: 4, display: 'inline-block' }}>
                      💸 Sự kiện hoàn tiền: Phí kiện hàng / Số tiền sẽ được hoàn trả từ 3-5 ngày làm việc.
                    </span>
                  </div>
                )}

                {/* Danh sách sản phẩm trong đơn */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  {o.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {item.image_url ? (
                          <img src={item.image_url} alt="" style={{ width: 48, height: 56, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                        ) : (
                          <div style={{ width: 48, height: 56, background: '#eee', borderRadius: 4 }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.product_name}</div>
                          <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                            Size: <strong>{item.size || 'Mặc định'}</strong> | Màu: <strong>{item.color || 'Mặc định'}</strong> | Số lượng: <strong>{item.quantity}</strong>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                        {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer đơn hàng */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #f1f3f5' }}>
                  <div style={{ fontSize: 13, color: '#666' }}>
                    Người nhận: <strong>{o.fullname}</strong> ({o.phone})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 'bold' }}>
                      Tổng tiền: <span style={{ color: '#c0392b' }}>{Number(o.total_amount).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <Link to={`/order-success/${o.id}`} style={{
                      padding: '8px 16px', background: '#000', color: '#fff',
                      textDecoration: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 12
                    }}>
                      Xem chi tiết ➔
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
