import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, refundOrder, getOrderStats } from '../api/orderApi';

const STATUS_MAP = {
  pending: 'Chờ xác nhận',
  paid: 'Đã thanh toán',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
};

const STATUS_COLOR = {
  pending: '#e67e22',
  paid: '#27ae60',
  confirmed: '#2980b9',
  shipping: '#8e44ad',
  delivered: '#27ae60',
  cancelled: '#c0392b'
};

const REJECT_REASONS = [
  'Hết size',
  'Hết hàng',
  'Sản phẩm bị lỗi',
  'Địa chỉ giao hàng không hợp lệ',
  'Lý do khác'
];

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandId, setExpandId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  // Modal từ chối đơn hàng
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [selectedReason, setSelectedReason] = useState('Hết size');
  const [customReason, setCustomReason] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  const loadData = async () => {
    try {
      const [resOrders, resStats] = await Promise.all([
        getAllOrders(),
        getOrderStats()
      ]);
      const newOrders = resOrders.data.orders || [];

      // Kiểm tra có đơn hàng mới không (so sánh số lượng)
      setOrders(prev => {
        if (prev.length > 0 && newOrders.length > prev.length) {
          setNewOrderAlert(true);
          // Tự động ẩn thông báo sau 5 giây
          setTimeout(() => setNewOrderAlert(false), 5000);
        }
        return newOrders;
      });

      setStats(resStats.data || null);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh mỗi 15 giây để đồng bộ đơn hàng mới từ user
    const interval = setInterval(() => {
      loadData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === 'cancelled') {
      const order = orders.find(o => o.id === orderId);
      setRejectingOrder(order);
      setSelectedReason('Hết size');
      setCustomReason('');
      return;
    }

    try {
      await updateOrderStatus(orderId, newStatus);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const confirmRejectOrder = async () => {
    if (!rejectingOrder) return;
    const finalReason = selectedReason === 'Lý do khác'
      ? (customReason.trim() || 'Lý do khác')
      : selectedReason;

    setSubmittingReject(true);
    try {
      await updateOrderStatus(rejectingOrder.id, 'cancelled', finalReason);
      setRejectingOrder(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi khi từ chối đơn hàng');
    } finally {
      setSubmittingReject(false);
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Xác nhận đã hoàn tiền cho khách hàng?')) return;
    try {
      await refundOrder(id);
      loadData();
    } catch (err) {
      alert('Có lỗi xảy ra khi xác nhận hoàn tiền');
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', fontSize: 16 }}>Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div style={{ padding: '30px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: '800', marginBottom: 24 }}>Quản lý đơn hàng & Doanh thu</h2>

      {/* Thông báo đơn hàng mới */}
      {newOrderAlert && (
        <div style={{
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #11998e, #38ef7d)',
          color: '#fff',
          borderRadius: 8,
          marginBottom: 20,
          fontWeight: 'bold',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'fadeIn 0.3s ease-in',
          boxShadow: '0 4px 15px rgba(56,239,125,0.3)'
        }}>
          🔔 Có đơn hàng mới! Dữ liệu đã được cập nhật.
          <button
            onClick={() => setNewOrderAlert(false)}
            style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none',
              color: '#fff', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold'
            }}
          >✕</button>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 32
        }}>
          <div style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: '#fff', padding: '20px 24px', borderRadius: 12, boxShadow: '0 4px 15px rgba(56,239,125,0.25)' }}>
            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>Tổng doanh thu (Đã giao)</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{Number(stats.revenue || 0).toLocaleString('vi-VN')}₫</div>
          </div>

          <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 12, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>Tổng số đơn hàng</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#333', marginTop: 8 }}>{stats.totalOrders || 0}</div>
          </div>

          <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 12, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, color: '#e67e22', textTransform: 'uppercase', letterSpacing: 1 }}>Đơn chờ xác nhận</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#e67e22', marginTop: 8 }}>{stats.statusCounts?.pending || 0}</div>
          </div>

          <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 12, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, color: '#c0392b', textTransform: 'uppercase', letterSpacing: 1 }}>Đơn đã hủy</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#c0392b', marginTop: 8 }}>{stats.statusCounts?.cancelled || 0}</div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 10 }}>Lọc theo trạng thái:</span>
        <button
          onClick={() => setFilterStatus('all')}
          style={{
            padding: '8px 16px', borderRadius: 20, border: '1px solid #ddd',
            background: filterStatus === 'all' ? '#000' : '#fff',
            color: filterStatus === 'all' ? '#fff' : '#333',
            cursor: 'pointer', fontSize: 13, fontWeight: 600
          }}>
          Tất cả ({orders.length})
        </button>
        {Object.keys(STATUS_MAP).map(st => {
          const count = orders.filter(o => o.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: '1px solid #ddd',
                background: filterStatus === st ? STATUS_COLOR[st] : '#fff',
                color: filterStatus === st ? '#fff' : '#333',
                cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}>
              {STATUS_MAP[st]} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
              {['Mã đơn', 'Khách hàng', 'Số điện thoại', 'Tổng tiền', 'Trạng thái', 'Ngày đặt', 'Hành động'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                  Không có đơn hàng nào trong mục này.
                </td>
              </tr>
            ) : (
              filteredOrders.map(o => (
                <React.Fragment key={o.id}>
                  <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>#{o.id}</td>
                    <td style={{ padding: '14px 16px' }}>{o.fullname}</td>
                    <td style={{ padding: '14px 16px' }}>{o.phone}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#c0392b' }}>
                      {Number(o.total_amount).toLocaleString('vi-VN')}₫
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{
                          padding: '6px 12px', fontSize: 12, fontWeight: 'bold',
                          color: STATUS_COLOR[o.status] || '#333',
                          border: `1.5px solid ${STATUS_COLOR[o.status] || '#ddd'}`,
                          borderRadius: 6, background: '#fff', cursor: 'pointer'
                        }}>
                        {Object.keys(STATUS_MAP).map(s => (
                          <option key={s} value={s}>{STATUS_MAP[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#666' }}>
                      {new Date(o.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '14px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        onClick={() => setExpandId(expandId === o.id ? null : o.id)}
                        style={{
                          padding: '6px 14px', fontSize: 12, cursor: 'pointer',
                          background: expandId === o.id ? '#000' : '#f8f9fa',
                          color: expandId === o.id ? '#fff' : '#333',
                          border: '1px solid #ccc', borderRadius: 4, fontWeight: 600
                        }}>
                        {expandId === o.id ? '▲ Ẩn' : '▼ Chi tiết'}
                      </button>

                      {o.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(o.id, 'cancelled')}
                          style={{
                            padding: '6px 12px', fontSize: 12, cursor: 'pointer',
                            background: '#fff3f2', color: '#c0392b',
                            border: '1px solid #f5c6cb', borderRadius: 4, fontWeight: 600
                          }}>
                          ✖ Từ chối
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {expandId === o.id && (
                    <tr>
                      <td colSpan={7} style={{ padding: '20px 24px', background: '#fafbfc', borderBottom: '2px solid #e9ecef' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                          <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e9ecef' }}>
                            <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>📍 Thông tin giao hàng & Định vị</h4>
                            <p style={{ margin: '4px 0', fontSize: 13 }}><strong>Người nhận:</strong> {o.fullname}</p>
                            <p style={{ margin: '4px 0', fontSize: 13 }}><strong>Số điện thoại:</strong> {o.phone}</p>
                            <p style={{ margin: '4px 0', fontSize: 13 }}><strong>Địa chỉ:</strong> {o.address}</p>
                            {o.note && <p style={{ margin: '4px 0', fontSize: 13, color: '#666' }}><strong>Ghi chú khách:</strong> {o.note}</p>}

                            {/* Khung Định vị Địa Lý & Thanh Công Cụ Admin */}
                            <div style={{
                              marginTop: 12, padding: 12, background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0fa 100%)',
                              border: '1px solid #b3d4fc', borderRadius: 8
                            }}>
                              <div style={{ fontWeight: 'bold', fontSize: 13, color: '#0d47a1', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                🌐 Định vị OpenStreetMap Geocoding:
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 8 }}>
                                <div><strong>Tọa độ:</strong> {o.lat ? `${o.lat}, ${o.lng}` : '10.7721, 106.6983'}</div>
                                <div><strong>Khoảng cách:</strong> <span style={{ color: '#27ae60', fontWeight: 'bold' }}>{o.distance_km || 3.5} km</span></div>
                                <div><strong>Phí giao hàng:</strong> <span style={{ color: '#c0392b', fontWeight: 'bold' }}>{Number(o.shipping_fee || 20000).toLocaleString('vi-VN')}₫</span></div>
                              </div>

                              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <a
                                  href={`https://www.google.com/maps?q=${o.lat || 10.7721},${o.lng || 106.6983}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: '6px 12px', background: '#1a73e8', color: '#fff', textDecoration: 'none',
                                    borderRadius: 4, fontSize: 12, fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: 4
                                  }}>
                                  🗺️ Mở Bản Đồ Google Maps ➔
                                </a>

                                <button
                                  type="button"
                                  onClick={() => alert(`📍 THÔNG TIN ĐỊNH VỊ ĐƠN HÀNG #${o.id}\n-----------------------------------\n- Khách hàng: ${o.fullname}\n- Địa chỉ: ${o.address}\n- Vĩ độ (Latitude): ${o.lat || 10.7721}\n- Kinh độ (Longitude): ${o.lng || 106.6983}\n- Khoảng cách từ shop: ${o.distance_km || 3.5} km\n- Phí vận chuyển: ${Number(o.shipping_fee || 20000).toLocaleString('vi-VN')} VNĐ`)}
                                  style={{
                                    padding: '6px 12px', background: '#fff', color: '#0d47a1', border: '1px solid #1565c0',
                                    borderRadius: 4, fontSize: 12, fontWeight: 'bold', cursor: 'pointer'
                                  }}>
                                  ℹ️ Chi tiết tọa độ
                                </button>
                              </div>
                            </div>
                          </div>

                          <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e9ecef' }}>
                            <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>ℹ️ Trạng thái & Ghi chú xử lý</h4>
                            <p style={{ margin: '4px 0', fontSize: 13 }}>
                              <strong>Trạng thái:</strong>{' '}
                              <span style={{ color: STATUS_COLOR[o.status], fontWeight: 'bold' }}>{STATUS_MAP[o.status]}</span>
                            </p>
                            {o.status === 'cancelled' && (
                              <div style={{ marginTop: 8, padding: 10, background: '#fff0f0', border: '1px solid #ffcdd2', borderRadius: 6 }}>
                                <strong style={{ color: '#c0392b' }}>Lý do từ chối / hủy:</strong> {o.cancel_reason || 'Chưa ghi rõ'}<br />
                                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <strong>Hoàn tiền:</strong>
                                  {o.refund_status === 'refunded' ? (
                                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Đã hoàn tiền</span>
                                  ) : o.refund_status === 'pending_refund' ? (
                                    <button onClick={() => handleRefund(o.id)} style={{ padding: '4px 12px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>
                                      Xác nhận đã hoàn tiền
                                    </button>
                                  ) : (
                                    <span style={{ color: '#777' }}>Không yêu cầu</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Items list */}
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: '#333' }}>🛍️ Danh sách sản phẩm ({o.items?.length || 0})</h4>
                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e9ecef', overflow: 'hidden' }}>
                          {o.items?.map((item, idx) => (
                            <div key={idx} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 16px', borderBottom: idx < o.items.length - 1 ? '1px solid #f1f3f5' : 'none'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                {item.image_url && (
                                  <img src={item.image_url} alt="" style={{ width: 48, height: 56, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                                )}
                                <div>
                                  <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.product_name}</div>
                                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                                    Size: <strong>{item.size || 'Mặc định'}</strong> | Màu: <strong>{item.color || 'Mặc định'}</strong>
                                  </div>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 13, color: '#555' }}>
                                  {Number(item.price).toLocaleString('vi-VN')}₫ × {item.quantity}
                                </div>
                                <div style={{ fontWeight: 'bold', color: '#000', fontSize: 14 }}>
                                  {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}₫
                                </div>
                              </div>
                            </div>
                          ))}
                          <div style={{ background: '#f8f9fa', padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', fontSize: 15, borderTop: '1px solid #e9ecef' }}>
                            Tổng tiền đơn hàng: <span style={{ color: '#c0392b' }}>{Number(o.total_amount).toLocaleString('vi-VN')}₫</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal từ chối nhận đơn */}
      {rejectingOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff', width: 450, padding: 28, borderRadius: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#c0392b' }}>
              🚫 Từ chối đơn hàng #{rejectingOrder.id}
            </h3>
            <p style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
              Vui lòng chọn hoặc nhập lý do từ chối đơn hàng của khách hàng <strong>{rejectingOrder.fullname}</strong>:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {REJECT_REASONS.map(reason => (
                <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    style={{ accentColor: '#c0392b' }}
                  />
                  {reason}
                </label>
              ))}
            </div>

            {selectedReason === 'Lý do khác' && (
              <div style={{ marginBottom: 20 }}>
                <textarea
                  placeholder="Nhập lý do từ chối cụ thể..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '10px', fontSize: 13, border: '1px solid #ccc',
                    borderRadius: 6, boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => setRejectingOrder(null)}
                style={{
                  padding: '10px 20px', background: '#f1f3f5', border: '1px solid #ccc',
                  borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13
                }}>
                Hủy bỏ
              </button>
              <button
                onClick={confirmRejectOrder}
                disabled={submittingReject}
                style={{
                  padding: '10px 20px', background: '#c0392b', color: '#fff', border: 'none',
                  borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  opacity: submittingReject ? 0.7 : 1
                }}>
                {submittingReject ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
