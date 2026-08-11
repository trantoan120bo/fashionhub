import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpNav from '../components/layout/HelpNav';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'order', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên, Email và Nội dung cần hỗ trợ.');
      return;
    }
    const randomTicket = 'FH-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomTicket);
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: 80 }}>
      <HelpNav
        activeTab="contact"
        title="Liên Hệ Hỗ Trợ Khách Hàng 24/7"
        subtitle="Chúng tôi luôn lắng nghe và sẵn sàng giải đáp mọi thắc mắc của bạn qua Hotline, Email hoặc Cổng tiếp nhận yêu cầu."
      />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>

        {submitted ? (
          /* Màn hình gửi thành công */
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: '60px 40px',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            maxWidth: 650,
            margin: '0 auto'
          }}>
            <div style={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#ffffff',
              fontSize: 36,
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
              Gửi Yêu Cầu Thành Công!
            </h2>
            <p style={{ color: '#4b5563', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              Cảm ơn <strong>{form.name}</strong>! Yêu cầu của bạn đã được tiếp nhận vào hệ thống CSKH FashionHub với mã Ticket:
            </p>
            <div style={{
              display: 'inline-block',
              background: '#f3f4f6',
              padding: '12px 28px',
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 900,
              color: '#2563eb',
              letterSpacing: '2px',
              border: '1px dashed #bfdbfe',
              marginBottom: 28
            }}>
              {ticketId}
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 32px 0' }}>
              Đội ngũ phản hồi sẽ gửi email chi tiết cho bạn tại <strong>{form.email}</strong> trong vòng tối đa 2 giờ làm việc.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: 'order', message: '' }); }}
                style={{
                  padding: '12px 24px',
                  borderRadius: 10,
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  color: '#374151',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Gửi thêm yêu cầu
              </button>
              <Link
                to="/"
                style={{
                  padding: '12px 28px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#111827',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                Về Trang Chủ
              </Link>
            </div>
          </div>
        ) : (
          /* Form và Khối Thông tin liên hệ */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
            
            {/* Cột trái: Form nhập yêu cầu */}
            <div style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: '36px 36px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>
                ✉️ Gửi Yêu Cầu Hỗ Trợ Trực Tuyến
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px 0' }}>
                Vui lòng điền thông tin bên dưới, chuyên viên CSKH sẽ hỗ trợ bạn sớm nhất.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Họ và tên người gửi <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                      Địa chỉ Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="ten@email.com"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #d1d5db',
                        fontSize: 14,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="0901234567"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #d1d5db',
                        fontSize: 14,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Chủ đề cần hỗ trợ
                  </label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                      outline: 'none',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="order">📦 Vấn đề đơn hàng & Tra cứu vận chuyển</option>
                    <option value="return">🔄 Đổi trả hàng / Hoàn tiền</option>
                    <option value="size">📐 Tư vấn chọn size số chuẩn</option>
                    <option value="complaint">⚠️ Khiếu nại chất lượng sản phẩm & dịch vụ</option>
                    <option value="other">💬 Thắc mắc khác</option>
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Nội dung chi tiết lời nhắn <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Mô tả cụ thể thắc mắc hoặc vấn đề bạn gặp phải (Kèm mã đơn hàng nếu có)..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#111827',
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s'
                  }}
                >
                  GỬI YÊU CẦU HỖ TRỢ 🚀
                </button>
              </form>
            </div>

            {/* Cột phải: Kênh liên hệ trực tiếp */}
            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  fontSize: 28,
                  background: '#eff6ff',
                  color: '#2563eb',
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>📞</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Tổng Đài Hotline 24/7</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', margin: '2px 0' }}>1900 9999</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Phím 1: Đơn hàng | Phím 2: Đổi trả</div>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  fontSize: 28,
                  background: '#ecfdf5',
                  color: '#059669',
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>✉️</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Hòm Thư Điện Tử</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '2px 0' }}>support@fashionhub.vn</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Tiếp nhận & xử lý trong 2 giờ</div>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  fontSize: 28,
                  background: '#fef3c7',
                  color: '#d97706',
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>📍</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Cửa Hàng Flagship Store</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '2px 0' }}>Chợ Bến Thành, Quận 1</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>TP. Hồ Chí Minh, Việt Nam</div>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  fontSize: 28,
                  background: '#f3e8ff',
                  color: '#9333ea',
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>⏰</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Thời Gian Làm Việc</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '2px 0' }}>08:00 – 21:00 Hàng Ngày</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Phục vụ cả Thứ 7, Chủ Nhật & Ngày Lễ</div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ContactPage;
