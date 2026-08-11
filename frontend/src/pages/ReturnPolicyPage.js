import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpNav from '../components/layout/HelpNav';

function ReturnPolicyPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Tôi đổi trả sản phẩm thì mất bao lâu mới nhận được hàng mới?',
      a: 'Sau khi shop nhận được gói hàng gửi về và kiểm tra trong 24h, sản phẩm mới sẽ được gửi đi ngay theo đường giao hàng nhanh (khoảng 1 - 3 ngày làm việc).'
    },
    {
      q: 'Trường hợp nào tôi được hoàn lại 100% tiền mua hàng?',
      a: 'Nếu sản phẩm bị lỗi từ nhà sản xuất mà shop hết size/hết hàng thay thế, hoặc giao sai quá 2 lần, FashionHub sẽ thực hiện HOÀN TIỀN 100% về tài khoản ngân hàng của bạn trong vòng 3 - 5 ngày làm việc.'
    },
    {
      q: 'Nếu tôi muốn đổi sang một sản phẩm khác có giá trị cao hơn thì sao?',
      a: 'Quý khách hoàn toàn có thể đổi sang sản phẩm mẫu khác. Bạn chỉ cần bù thêm phần chênh lệch giá trị sản phẩm mới. Nếu sản phẩm mới giá thấp hơn, shop sẽ hoàn bù khoản dư vào tài khoản.'
    },
    {
      q: 'Tôi gửi hàng trả lại qua đường bưu điện hay shipper đến lấy?',
      a: 'FashionHub hỗ trợ dịch vụ Shipper đến tận nhà lấy hàng đổi trả đối với các quận nội thành TP.HCM & Hà Nội. Ở các tỉnh khác, quý khách vui lòng gửi qua bưu cục GHTK/GHN gần nhất theo hướng dẫn của shop.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: 80 }}>
      <HelpNav
        activeTab="return"
        title="Chính Sách Đổi Trả & Hoàn Tiền"
        subtitle="Đổi trả linh hoạt trong vòng 7 ngày, quy trình thẩm định nhanh chóng và hỗ trợ tối đa quyền lợi khách hàng."
      />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        
        {/* Banner Cam kết Đổi trả 7 Ngày */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1.5px solid #bfdbfe',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.08)'
        }}>
          <div style={{
            fontSize: 42,
            background: '#ffffff',
            width: 76,
            height: 76,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            flexShrink: 0
          }}>🛡️</div>
          <div>
            <div style={{
              display: 'inline-block',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 8
            }}>
              CAM KẾT BẢO VỆ KHÁCH HÀNG 100%
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e40af', margin: '0 0 6px 0' }}>
              Đổi Trả & Đổi Size Dễ Dàng Trong 7 Ngày
            </h2>
            <p style={{ fontSize: 14, color: '#1d4ed8', margin: 0, lineHeight: 1.6 }}>
              FashionHub hỗ trợ khách hàng đổi trả hoặc đổi size trong vòng <strong>7 ngày kể từ ngày nhận hàng</strong>. Đổi mới ngay lập tức nếu có lỗi từ phía sản xuất hoặc vận chuyển.
            </p>
          </div>
        </div>

        {/* Khối 1: Trường hợp được Đổi Trả */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '36px 36px',
          border: '1px solid #e5e7eb',
          marginBottom: 32,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>✅</span>
            1. Các Trường Hợp Được Chấp Nhận Đổi Trả
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>🏷️</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Lỗi Do Nhà Sản Xuất</h4>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Sản phẩm bị rách chỉ, bung nút, ố màu, hỏng khóa kéo hoặc thiếu chi tiết ngay khi mở hộp. <strong>FashionHub chịu 100% phí ship 2 chiều.</strong>
              </p>
            </div>

            <div style={{ background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>📦</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Giao Sai Mẫu / Sai Size</h4>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Sản phẩm thực tế không đúng với màu sắc, kích cỡ hoặc tên mẫu mã quý khách đã đặt trên hệ thống. <strong>Đổi miễn phí 100%.</strong>
              </p>
            </div>

            <div style={{ background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>📐</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Đổi Size Theo Yêu Cầu</h4>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Khách thử không vừa size hoặc muốn đổi sang màu khác. Hỗ trợ đổi size linh hoạt trong 7 ngày (Khách hỗ trợ thanh toán phí vận chuyển 2 chiều).
              </p>
            </div>
          </div>
        </div>

        {/* Khối 2: Điều kiện & Sản phẩm không áp dụng */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, padding: '32px 32px', border: '1px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>📋</span> Điều Kiện Bắt Buộc
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14, color: '#4b5563', lineHeight: 1.8 }}>
              <li>Sản phẩm còn nguyên <strong>tem, mác, thẻ bài</strong> đính kèm ban đầu.</li>
              <li>Chưa qua sử dụng, chưa giặt ủi và không có mùi lạ (nước hoa, bột giặt).</li>
              <li>Có thông tin mã đơn hàng hoặc hóa đơn điện tử mua hàng trên website.</li>
              <li>Thời gian gửi yêu cầu trong vòng <strong>7 ngày</strong> tính từ lúc shipper báo giao thành công.</li>
            </ul>
          </div>

          <div style={{ background: '#fff5f5', borderRadius: 16, padding: '32px 32px', border: '1px solid #fed7d7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#c53030', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>❌</span> Không Áp Dụng Đổi Trả
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14, color: '#9b2c2c', lineHeight: 1.8 }}>
              <li>Sản phẩm đã bị dơ bẩn, cố tình làm hư hỏng hoặc rách do va quệt.</li>
              <li>Các mặt hàng đồ lót, tất (vớ), nón mũ vì lý do vệ sinh cá nhân.</li>
              <li>Sản phẩm mua trong các sự kiện Sale Xả Kho / Clearance quá 50%.</li>
              <li>Yêu cầu phát sinh sau quá 7 ngày kể từ ngày nhận hàng.</li>
            </ul>
          </div>
        </div>

        {/* Khối 3: Quy trình 4 bước gửi trả đổi hàng */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '36px 36px',
          border: '1px solid #e5e7eb',
          marginBottom: 32,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>🔄</span>
            3. Quy Trình Đổi Trả 4 Bước Đơn Giản
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { step: 'Bước 1', title: 'Liên Hệ Đăng Ký', desc: 'Gọi Hotline 1900 9999 hoặc nhắn tin qua trang Liên Hệ kèm Mã đơn hàng & Video/Hình ảnh lỗi sản phẩm.' },
              { step: 'Bước 2', title: 'Xác Nhận Hướng Dẫn', desc: 'CSKH tiếp nhận thông tin trong 2 tiếng và cung cấp mã gửi hàng hoặc tạo đơn shipper lấy tận nơi.' },
              { step: 'Bước 3', title: 'Thẩm Định Sản Phẩm', desc: 'Kho hàng tiếp nhận kiện hàng trả về và tiến hành kiểm tra tình trạng nguyên vẹn trong 24 giờ.' },
              { step: 'Bước 4', title: 'Gửi Hàng Mới / Hoàn Tiền', desc: 'Shop phát hàng mới lập tức hoặc chuyển khoản hoàn tiền vào tài khoản ngân hàng của bạn trong 3-5 ngày.' }
            ].map((s, i) => (
              <div key={i} style={{ background: '#f9fafb', padding: 22, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: 6 }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Khối 4: Quy định An toàn đơn hàng & Chống bom hàng */}
        <div style={{
          background: '#fffbe6',
          border: '1px solid #ffe58f',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 32
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#873800', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>⚠️</span> Chính Sách Bảo Vệ Đơn Hàng & Chống Bom Hàng
          </h3>
          <p style={{ fontSize: 14, color: '#592900', lineHeight: 1.7, margin: 0 }}>
            Để đảm bảo công bằng cho cộng đồng người mua hàng chân chính, FashionHub áp dụng <strong>Hệ Thống Kiểm Soát Hủy Đơn Tự Động</strong>:<br />
            - Nếu hủy đơn quá <strong>1 - 2 lần</strong>, hệ thống sẽ gửi cảnh báo nhắc nhở.<br />
            - Nếu quý khách hủy/bùng đơn hàng <strong>quá 2 lần mà không có lý do chính đáng</strong>, tài khoản sẽ tự động bị <strong>KHÓA VĨNH VIỄN</strong> để phòng tránh gian lận.
          </p>
        </div>

        {/* Khối 5: FAQ câu hỏi thường gặp */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '36px 36px',
          border: '1px solid #e5e7eb',
          marginBottom: 40,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>❓</span>
            4. Câu Hỏi Thường Gặp Về Đổi Trả
          </h2>

          <div style={{ display: 'grid', gap: 12 }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: openFaq === idx ? '#f9fafb' : '#ffffff',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#111827',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: 18, color: '#6b7280', transform: openFaq === idx ? 'rotate(180deg)' : 'none' }}>
                    ▼
                  </span>
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 24px 20px 24px', fontSize: 14, color: '#4b5563', lineHeight: 1.7, background: '#f9fafb' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Box */}
        <div style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          color: '#ffffff',
          borderRadius: 16,
          padding: '32px 36px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px 0' }}>Cần hỗ trợ đổi trả / đổi size gấp?</h3>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 20px 0' }}>Nhân viên CSKH của chúng tôi sẵn sàng giải quyết yêu cầu của bạn chỉ trong vài phút.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href="tel:19009999" style={{ background: '#ffffff', color: '#111827', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
              📞 Gọi CSKH: 1900 9999
            </a>
            <Link to="/contact" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
              💬 Gửi Yêu Cầu Đổi Trả
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReturnPolicyPage;
