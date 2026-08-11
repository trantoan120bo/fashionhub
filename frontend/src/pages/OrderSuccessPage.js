import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../api/orderApi';

const CANCEL_REASONS = [
    'Thay đổi địa chỉ giao hàng',
    'Không còn nhu cầu mua nữa',
    'Mã giảm giá chưa đủ / Quên áp mã',
    'Lý do khác'
];

function OrderSuccessPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [warningMsg, setWarningMsg] = useState('');
    const [bannedMsg, setBannedMsg] = useState('');
    const [refundMsg, setRefundMsg] = useState('');

    // Modal hủy đơn hàng
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
    const [customReason, setCustomReason] = useState('');
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getOrderById(id);
                setOrder(res.data.order);
            } catch (err) {
                console.error('Lỗi khi lấy thông tin đơn hàng:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontSize: 16 }}>Đang tải thông tin đơn hàng...</div>;
    if (!order) return <div style={{ padding: '60px', textAlign: 'center', fontSize: 16 }}>Không tìm thấy đơn hàng.</div>;

    const createdDate = new Date(order.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdDate) / (1000 * 60 * 60);
    const canCancel = (order.status === 'pending' || order.status === 'paid' || order.status === 'confirmed') && diffHours <= 48;

    const handleConfirmCancel = async () => {
        const finalReason = selectedReason === 'Lý do khác'
            ? (customReason.trim() || 'Lý do khác')
            : selectedReason;

        setCanceling(true);
        try {
            const res = await cancelOrder(order.id, finalReason);
            const { cancel_count, banned, warning, refund_note } = res.data;

            setOrder({ ...order, status: 'cancelled', cancel_reason: finalReason });
            setShowCancelModal(false);
            setRefundMsg(refund_note || 'Phí kiện hàng / Số tiền sẽ được hoàn trả từ 3-5 ngày làm việc.');

            if (banned) {
                setBannedMsg('⛔ Tài khoản của bạn đã bị khóa vĩnh viễn do hủy đơn hàng quá 2 lần. Vui lòng liên hệ shop để được hỗ trợ.');
                setWarningMsg('');
            } else if (warning) {
                setWarningMsg(warning);
                setBannedMsg('');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
        } finally {
            setCanceling(false);
        }
    };

    return (
        <div style={{ maxWidth: '820px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    width: '72px',
                    height: '72px',
                    background: order.status === 'cancelled' ? '#c0392b' : '#27ae60',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: '#fff',
                    fontSize: '36px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                    {order.status === 'cancelled' ? '✖' : '✓'}
                </div>

                <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {order.status === 'cancelled' ? 'Đơn hàng đã bị hủy' : 'Đặt hàng thành công!'}
                </h1>
                <p style={{ color: '#666', fontSize: 14 }}>
                    Cảm ơn bạn đã mua sắm tại FashionHub. Mã đơn hàng của bạn là <strong>#{order.id}</strong>
                </p>

                {/* Ghi chú thời gian xác nhận */}
                {order.status !== 'cancelled' && (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 20,
                        padding: '6px 18px', marginTop: 12, fontSize: 13, color: '#856404', fontWeight: 'bold'
                    }}>
                        ⏱️ Vui lòng đợi 5-10p để xác nhận đơn hàng bạn nhé!
                    </div>
                )}

                {/* Trạng thái đơn hàng */}
                <div style={{ marginTop: '16px' }}>
                    <strong>Trạng thái: </strong>
                    <span style={{
                        padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
                        background: order.status === 'cancelled' ? '#fdecea' :
                                    order.status === 'paid' ? '#e8f5e9' :
                                    order.status === 'confirmed' ? '#e3f2fd' :
                                    order.status === 'shipping' ? '#f3e5f5' :
                                    order.status === 'delivered' ? '#e8f5e9' : '#fff3e0',
                        color: order.status === 'cancelled' ? '#c0392b' :
                               order.status === 'paid' ? '#2e7d32' :
                               order.status === 'confirmed' ? '#1565c0' :
                               order.status === 'shipping' ? '#7b1fa2' :
                               order.status === 'delivered' ? '#2e7d32' : '#e67e22',
                        border: '1px solid currentColor'
                    }}>
                        {order.status === 'pending' && 'Chờ xác nhận (COD)'}
                        {order.status === 'paid' && 'Đã thanh toán (Mã QR)'}
                        {order.status === 'confirmed' && 'Đã xác nhận'}
                        {order.status === 'shipping' && 'Đang giao hàng'}
                        {order.status === 'delivered' && 'Đã giao hàng'}
                        {order.status === 'cancelled' && 'Đã hủy'}
                    </span>
                </div>

                {/* Lý do hủy & Thông báo hoàn tiền 3-5 ngày */}
                {order.status === 'cancelled' && (
                    <div style={{ marginTop: 20, background: '#fff3f2', border: '1px solid #f5c6cb', padding: '16px 20px', borderRadius: 10, textAlign: 'left' }}>
                        <div style={{ color: '#c0392b', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>
                            🚫 Lý do hủy: {order.cancel_reason || 'Không ghi rõ'}
                        </div>
                        <div style={{ color: '#27ae60', fontWeight: 'bold', fontSize: 14, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                            💸 Sự kiện hoàn tiền: {refundMsg || 'Phí kiện hàng / Số tiền sẽ được hoàn trả từ 3-5 ngày làm việc.'}
                        </div>
                    </div>
                )}

                {/* Banner bị cấm vĩnh viễn */}
                {bannedMsg && (
                    <div style={{
                        marginTop: 20, padding: '16px 20px',
                        background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
                        borderRadius: 10, color: '#fff', textAlign: 'left',
                        boxShadow: '0 4px 12px rgba(192,57,43,0.35)'
                    }}>
                        <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>🚫 Tài khoản bị khóa vĩnh viễn</div>
                        <div style={{ fontSize: 13, lineHeight: 1.6 }}>{bannedMsg}</div>
                        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>
                            📞 Hotline hỗ trợ: <strong>1900 9999</strong> | Email: <strong>support@fashionhub.vn</strong>
                        </div>
                    </div>
                )}

                {/* Banner cảnh báo */}
                {warningMsg && !bannedMsg && (
                    <div style={{
                        marginTop: 20, padding: '14px 18px',
                        background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                        border: '1px solid #ffc107', borderRadius: 10,
                        color: '#7d4e00', textAlign: 'left',
                        boxShadow: '0 2px 8px rgba(255,193,7,0.3)'
                    }}>
                        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>⚠️ Cảnh báo bom hàng</div>
                        <div style={{ fontSize: 13, lineHeight: 1.6 }}>{warningMsg}</div>
                    </div>
                )}
            </div>

            {/* Chi tiết sản phẩm trong đơn */}
            <div style={{ background: '#fff', padding: '24px 28px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    🛍️ Danh sách sản phẩm
                </h2>

                {order.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #f9f9f9' }}>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                            <div style={{ width: '60px', height: '72px', background: '#f5f5f5', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee', flexShrink: 0 }}>
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '10px', color: '#999' }}>No Image</div>
                                )}
                            </div>
                            <div>
                                <p style={{ fontWeight: 'bold', margin: 0, fontSize: 14 }}>{item.product_name}</p>
                                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
                                    Size: <strong>{item.size || 'Mặc định'}</strong> | Màu: <strong>{item.color || 'Mặc định'}</strong> | SL: <strong>{item.quantity}</strong>
                                </p>
                            </div>
                        </div>
                        <p style={{ fontWeight: 'bold', fontSize: 14 }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                    </div>
                ))}

                <div style={{ borderTop: '1px solid #eee', marginTop: '16px', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 13 }}>
                        <span>Tạm tính</span>
                        <span>{Number(order.total_amount).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 13 }}>
                        <span>Phí vận chuyển</span>
                        <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Miễn phí</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
                        <span>Tổng tiền thanh toán</span>
                        <span style={{ color: '#c0392b' }}>{Number(order.total_amount).toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>
            </div>

            {/* Thông tin giao hàng & Phương thức thanh toán */}
            <div style={{ background: '#fff', padding: '24px 28px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '14px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    📍 Thông tin nhận hàng & Thanh toán
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Người nhận:</strong> {order.fullname}</p>
                        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Số điện thoại:</strong> {order.phone}</p>
                        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Địa chỉ:</strong> {order.address}</p>
                        {order.note && <p style={{ margin: '6px 0', fontSize: '13px', color: '#666' }}><strong>Ghi chú:</strong> {order.note}</p>}
                    </div>

                    <div>
                        <p style={{ margin: '6px 0', fontSize: '13px' }}>
                            <strong>Phương thức thanh toán:</strong>{' '}
                            {order.payment_method === 'bank' || order.status === 'paid' ? (
                                <span style={{ color: '#1565c0', fontWeight: 'bold' }}>🏦 Chuyển khoản Ngân hàng (Mã QR VietQR)</span>
                            ) : (
                                <span style={{ color: '#e67e22', fontWeight: 'bold' }}>💵 Thanh toán khi nhận hàng (COD)</span>
                            )}
                        </p>
                        <p style={{ margin: '6px 0', fontSize: '13px' }}>
                            <strong>Trạng thái thanh toán:</strong>{' '}
                            {order.status === 'paid' ? (
                                <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Đã thanh toán</span>
                            ) : order.status === 'cancelled' ? (
                                <span style={{ color: '#c0392b', fontWeight: 'bold' }}>Đã hủy</span>
                            ) : (
                                <span style={{ color: '#e67e22', fontWeight: 'bold' }}>Chưa thanh toán (Chờ xác nhận)</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Nút hành động */}
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
                <Link to="/" style={{
                    display: 'inline-block',
                    padding: '14px 32px',
                    background: '#000',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    marginRight: '14px',
                    fontSize: 14
                }}>
                    ← Tiếp tục mua sắm
                </Link>

                {canCancel && (
                    <button
                        onClick={() => setShowCancelModal(true)}
                        style={{
                            display: 'inline-block',
                            padding: '14px 28px',
                            background: '#fff',
                            color: '#c0392b',
                            border: '1.5px solid #c0392b',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: 14
                        }}>
                        ✖ Hủy đơn hàng
                    </button>
                )}
            </div>

            {/* Modal Hủy Đơn Hàng với Sự kiện Lý do & Hoàn tiền */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff', width: 460, padding: 30, borderRadius: 12,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 14, color: '#c0392b' }}>
                            🚫 Hủy đơn hàng #{order.id}
                        </h3>
                        <p style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
                            Vui lòng chọn lý do hủy đơn hàng của bạn:
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                            {CANCEL_REASONS.map(reason => (
                                <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="userCancelReason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={() => setSelectedReason(reason)}
                                        style={{ accentColor: '#c0392b', width: 16, height: 16 }}
                                    />
                                    {reason}
                                </label>
                            ))}
                        </div>

                        {selectedReason === 'Lý do khác' && (
                            <div style={{ marginBottom: 20 }}>
                                <textarea
                                    placeholder="Nhập chi tiết lý do hủy..."
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

                        <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 6, fontSize: 12, color: '#666', marginBottom: 20 }}>
                            💡 <strong>Lưu ý:</strong> Phí kiện hàng / Số tiền sẽ được hoàn trả từ 3-5 ngày làm việc sau khi xác nhận hủy đơn.
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                style={{
                                    padding: '10px 20px', background: '#f1f3f5', border: '1px solid #ccc',
                                    borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13
                                }}>
                                Quay lại
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={canceling}
                                style={{
                                    padding: '10px 20px', background: '#c0392b', color: '#fff', border: 'none',
                                    borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                                    opacity: canceling ? 0.7 : 1
                                }}>
                                {canceling ? 'Đang xử lý...' : 'Xác nhận hủy đơn'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderSuccessPage;
