import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../api/orderApi';

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getOrderById(id)
      .then(res => setOrder(res.data.order))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Đang tải thông tin thanh toán...</div>;
  if (!order) return <div style={{ padding: 60, textAlign: 'center' }}>Không tìm thấy đơn hàng.</div>;

  const qrUrl = 'https://img.vietqr.io/image/MB-3938373679-print.png';
  const ownerName = 'TRẦN NGỌC TOÀN';

  const handleConfirmPaid = async () => {
    setSubmitting(true);
    try {
      // Cập nhật trạng thái đơn sang 'paid' (Đã thanh toán)
      await updateOrderStatus(order.id, 'paid');
    } catch (err) {
      console.warn('Lỗi cập nhật trạng thái:', err);
    } finally {
      setSubmitting(false);
      navigate(`/order-success/${order.id}`, { replace: true });
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
      <div style={{
        background: '#fff', padding: 36, borderRadius: 16,
        border: '1px solid #e0e0e0', boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 60, height: 60, borderRadius: '50%', background: '#e8f0fe',
          color: '#1565c0', fontSize: 30, marginBottom: 16
        }}>
          🏦
        </div>
        <h2 style={{ fontSize: 24, fontWeight: '800', marginBottom: 8, color: '#1a237e' }}>
          Thanh toán qua mã QR
        </h2>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
          Mã đơn hàng: <strong>#{order.id}</strong> | Vui lòng quét mã QR bên dưới để hoàn tất thanh toán.
        </p>

        {/* QR Code Frame */}
        <div style={{
          background: '#fafafa', padding: 24, borderRadius: 12, border: '2px dashed #1565c0',
          display: 'block', marginBottom: 24, width: 'fit-content', margin: '0 auto 24px'
        }}>
          <img
            src={qrUrl}
            alt="Mã QR Chuyển Khoản TRẦN NGỌC TOÀN"
            style={{
              width: 280, maxWidth: '100%', height: 'auto', borderRadius: 8,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        {/* Payment Account Details */}
        <div style={{
          background: '#f8f9fa', padding: '20px 24px', borderRadius: 10,
          textAlign: 'left', fontSize: 14, lineHeight: 2, marginBottom: 28,
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: 6 }}>
            <span>Chủ tài khoản:</span>
            <strong style={{ color: '#1565c0', fontSize: 15 }}>{ownerName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: 6, paddingTop: 6 }}>
            <span>Ngân hàng:</span>
            <strong>MB Bank (Ngân hàng Quân Đội)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: 6, paddingTop: 6 }}>
            <span>Số tiền thanh toán:</span>
            <strong style={{ color: '#c0392b', fontSize: 18 }}>{Number(order.total_amount).toLocaleString('vi-VN')}₫</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6 }}>
            <span>Nội dung chuyển khoản:</span>
            <strong style={{ color: '#000' }}>FashionHub #{order.id}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button
            onClick={handleConfirmPaid}
            disabled={submitting}
            style={{
              padding: '14px 32px', background: '#27ae60', color: '#fff',
              border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 14,
              cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(39,174,96,0.3)',
              opacity: submitting ? 0.7 : 1
            }}>
            {submitting ? 'Đang xử lý...' : '✓ Tôi đã hoàn tất chuyển khoản'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
