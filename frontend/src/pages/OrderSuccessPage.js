import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../api/orderApi';

function OrderSuccessPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [warningMsg, setWarningMsg] = useState('');
    const [bannedMsg, setBannedMsg] = useState('');

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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>;
    if (!order) return <div style={{ padding: '40px', textAlign: 'center' }}>Không tìm thấy đơn hàng.</div>;

    const createdDate = new Date(order.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdDate) / (1000 * 60 * 60);
    const canCancel = (order.status === 'pending' || order.status === 'confirmed') && diffHours <= 48;

    const handleCancel = async () => {
        const reason = window.prompt('Vui lòng nhập lý do hủy đơn hàng của bạn:');
        if (reason === null) return;
        if (reason.trim() === '') {
            alert('Bạn phải nhập lý do hủy đơn hàng.');
            return;
        }
        try {
            const res = await cancelOrder(order.id, reason);
            const { cancel_count, banned, warning } = res.data;
            setOrder({ ...order, status: 'cancelled', cancel_reason: reason });

            if (banned) {
                setBannedMsg('⛔ Tài khoản của bạn đã bị khóa vĩnh viễn do hủy đơn hàng quá 2 lần. Vui lòng liên hệ shop để được hỗ trợ.');
                setWarningMsg('');
            } else if (warning) {
                setWarningMsg(warning);
                setBannedMsg('');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
        }
    };


    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#4CAF50',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: '#fff',
                    fontSize: '40px'
                }}>
                    ✓
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {order.status === 'cancelled' ? 'Đơn hàng đã hủy' : 'Đặt hàng thành công!'}
                </h1>
                <p style={{ color: '#666' }}>Cảm ơn bạn đã mua sắm tại FashionHub. Mã đơn hàng của bạn là <strong>#{order.id}</strong></p>
                <div style={{ marginTop: '10px' }}>
                    <strong>Trạng thái: </strong>
                    <span style={{
                        padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold',
                        background: order.status === 'cancelled' ? '#fdecea' : '#e8f5e9',
                        color: order.status === 'cancelled' ? '#c0392b' : '#2e7d32'
                    }}>
                        {order.status === 'pending' && 'Chờ xác nhận'}
                        {order.status === 'confirmed' && 'Đã xác nhận'}
                        {order.status === 'shipping' && 'Đang giao hàng'}
                        {order.status === 'delivered' && 'Đã giao hàng'}
                        {order.status === 'cancelled' && 'Đã hủy'}
                    </span>
                </div>
                {order.status === 'cancelled' && order.cancel_reason && (
                    <div style={{ marginTop: '10px' }}>
                        <strong>Lý do hủy: </strong>
                        <span style={{ fontSize: '14px', color: '#666' }}>{order.cancel_reason}</span>
                    </div>
                )}

                {/* Banner bị cấm vĩnh viễn */}
                {bannedMsg && (
                    <div style={{
                        marginTop: 20,
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
                        borderRadius: 10,
                        color: '#fff',
                        textAlign: 'left',
                        boxShadow: '0 4px 12px rgba(192,57,43,0.35)'
                    }}>
                        <div style={{ fontSize: 20, marginBottom: 6 }}>🚫 Tài khoản bị khóa vĩnh viễn</div>
                        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{bannedMsg}</div>
                        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
                            📞 Liên hệ hỗ trợ: <strong>support@fashionhub.vn</strong> hoặc hotline <strong>1900 xxxx</strong>
                        </div>
                    </div>
                )}

                {/* Banner cảnh báo */}
                {warningMsg && !bannedMsg && (
                    <div style={{
                        marginTop: 20,
                        padding: '14px 18px',
                        background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                        border: '1px solid #ffc107',
                        borderRadius: 10,
                        color: '#7d4e00',
                        textAlign: 'left',
                        boxShadow: '0 2px 8px rgba(255,193,7,0.3)'
                    }}>
                        <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 4 }}>⚠️ Cảnh báo bom hàng</div>
                        <div style={{ fontSize: 13, lineHeight: 1.6 }}>{warningMsg}</div>
                    </div>
                )}
            </div>

            <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #eee' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Chi tiết đơn hàng</h2>

                {order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ width: '70px', height: '90px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', border: '1px solid #eee' }}>
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '10px', color: '#999' }}>No Image</div>
                                )}
                            </div>
                            <div>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>{item.product_name}</p>
                                <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0' }}>Phân loại: {item.size} / {item.color} | Số lượng: {item.quantity}</p>
                            </div>
                        </div>
                        <p style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                    </div>
                ))}

                <div style={{ borderTop: '1px solid #ddd', marginTop: '20px', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Tạm tính</span>
                        <span>{Number(order.total_amount).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Phí vận chuyển</span>
                        <span>Miễn phí</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}>
                        <span>Tổng cộng</span>
                        <span style={{ color: '#c0392b' }}>{Number(order.total_amount).toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Thông tin giao hàng</h2>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Người nhận:</strong> {order.fullname}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Số điện thoại:</strong> {order.phone}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Địa chỉ:</strong> {order.address}</p>
                {order.note && <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Ghi chú:</strong> {order.note}</p>}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to="/" style={{
                    display: 'inline-block',
                    padding: '12px 30px',
                    background: '#000',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    marginRight: '15px'
                }}>
                    Tiếp tục mua sắm
                </Link>
                {canCancel && (
                    <button onClick={handleCancel} style={{
                        display: 'inline-block',
                        padding: '12px 30px',
                        background: '#fff',
                        color: '#c0392b',
                        border: '1px solid #c0392b',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Hủy đơn hàng
                    </button>
                )}
            </div>
        </div>
    );
}

export default OrderSuccessPage;
