import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, refundOrder } from '../api/orderApi';

const STATUS_MAP = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
const STATUS_COLOR = { pending: '#e67e22', confirmed: '#2980b9', shipping: '#8e44ad', delivered: '#27ae60', cancelled: '#c0392b' };
const STATUSES = Object.keys(STATUS_MAP);

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandId, setExpandId] = useState(null);

  const load = () => getAllOrders().then((r) => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Xác nhận đã chuyển khoản hoàn tiền cho khách hàng?')) return;
    try {
      await refundOrder(id);
      load();
    } catch (err) {
      alert('Có lỗi xảy ra khi xác nhận hoàn tiền');
    }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '28px 40px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Quản lý đơn hàng</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {['ID', 'Khách hàng', 'SĐT', 'Tổng tiền', 'Trạng thái', 'Ngày đặt', ''].map((h) => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <React.Fragment key={o.id}>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 12px' }}>#{o.id}</td>
                <td style={{ padding: '10px 12px' }}>{o.fullname}</td>
                <td style={{ padding: '10px 12px' }}>{o.phone}</td>
                <td style={{ padding: '10px 12px' }}>{Number(o.total_amount).toLocaleString('vi-VN')}₫</td>
                <td style={{ padding: '10px 12px' }}>
                  <select value={o.status} onChange={(e) => handleStatus(o.id, e.target.value)}
                    style={{ padding: '4px 8px', fontSize: 12, color: STATUS_COLOR[o.status] || '#333', border: '1px solid #ddd' }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_MAP[s]}</option>)}
                  </select>
                </td>
                <td style={{ padding: '10px 12px' }}>{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                <td style={{ padding: '10px 12px' }}>
                  <button onClick={() => setExpandId(expandId === o.id ? null : o.id)}
                    style={{ padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
                    {expandId === o.id ? 'Ẩn' : 'Chi tiết'}
                  </button>
                </td>
              </tr>
              {expandId === o.id && (
                <tr><td colSpan={7} style={{ padding: '10px 24px 16px', background: '#fafafa', fontSize: 12, color: '#555' }}>
                  <strong>Địa chỉ:</strong> {o.address}<br />
                  {o.note && <><strong>Ghi chú:</strong> {o.note}<br /></>}
                  {o.status === 'cancelled' && (
                    <div style={{ marginTop: 8, padding: 8, background: '#fee', border: '1px solid #fcc', borderRadius: 4 }}>
                      <strong style={{ color: '#c0392b' }}>Lý do hủy:</strong> {o.cancel_reason || 'Không có lý do'}<br />
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <strong>Hoàn tiền:</strong>
                        {o.refund_status === 'refunded' ? (
                          <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Đã hoàn tiền</span>
                        ) : o.refund_status === 'pending_refund' ? (
                          <button onClick={() => handleRefund(o.id)} style={{ padding: '4px 12px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                            Xác nhận hoàn tiền
                          </button>
                        ) : (
                          <span>Không yêu cầu</span>
                        )}
                      </div>
                    </div>
                  )}
                  {o.items?.map((item, i) => (
                    <div key={i} style={{ marginTop: 6 }}>• {item.product_name} × {item.quantity} — Size {item.size} / {item.color} — {Number(item.price).toLocaleString('vi-VN')}₫</div>
                  ))}
                </td></tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersPage;
