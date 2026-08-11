import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpNav from '../components/layout/HelpNav';

function ShippingPolicyPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Tôi có thể thay đổi địa chỉ giao hàng sau khi đã đặt hàng không?',
      a: 'Quý khách hoàn toàn có thể thay đổi địa chỉ giao hàng miễn là đơn hàng chưa chuyển sang trạng thái "Đang giao hàng" (Shipping). Vui lòng liên hệ ngay Hotline 1900 9999 hoặc gửi yêu cầu qua trang Liên Hệ để nhân viên hỗ trợ cập nhật.'
    },
    {
      q: 'Làm thế nào để tôi tra cứu hành trình đơn hàng?',
      a: 'Sau khi đặt hàng thành công, bạn có thể truy cập mục "Đơn hàng của tôi" trên website FashionHub để theo dõi trạng thái đơn hàng thời gian thực (Đã xác nhận -> Đang giao -> Đã giao).'
    },
    {
      q: 'Nếu khi giao hàng tôi không có mặt tại địa chỉ thì sao?',
      a: 'Nhân viên giao hàng sẽ gọi điện trước khi giao. Nếu bạn bận, shipper sẽ hỗ trợ giao lại tối đa 3 lần miễn phí hoặc hẹn giao lại vào thời gian phù hợp.'
    },
    {
      q: 'Tôi có được kiểm tra hàng trước khi thanh toán (Đồng kiểm) không?',
      a: 'Có! FashionHub hỗ trợ chính sách ĐỒNG KIỂM 100%. Quý khách được phép mở gói hàng kiểm tra đúng mẫu mã, màu sắc, size số và tình trạng nguyên vẹn trước khi thanh toán cho shipper.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: 80 }}>
      <HelpNav
        activeTab="shipping"
        title="Chính Sách Vận Chuyển & Giao Hàng"
        subtitle="Cam kết giao hàng nhanh chóng, minh bạch chi phí vận chuyển theo khoảng cách thực tế và hỗ trợ đồng kiểm 100%."
      />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        
        {/* Banner Ưu Đãi Vận Chuyển Nổi Bật */}
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          border: '1.5px solid #a7f3d0',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)'
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
          }}>🎁</div>
          <div>
            <div style={{
              display: 'inline-block',
              background: '#059669',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 8
            }}>
              Chương Trình Ưu Đãi Đặc Biệt
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#065f46', margin: '0 0 6px 0' }}>
              MIỄN PHÍ VẬN CHUYỂN (0Đ) Cho Đơn Hàng Từ 1.000.000 VNĐ & Trong Phạm Vi 10KM
            </h2>
            <p style={{ fontSize: 14, color: '#047857', margin: 0, lineHeight: 1.6 }}>
              Ưu đãi áp dụng tự động khi đơn hàng thỏa 2 điều kiện: <strong>Tổng giá trị sản phẩm từ 1.000.000 VNĐ trở lên</strong> VÀ <strong>Khoảng cách giao hàng trong bán kính 10 km</strong>. Nếu vượt quá 10 km hoặc đơn dưới 1.000.000 VNĐ, cước phí sẽ được tính 3.000đ/km theo khoảng cách GPS thực tế.
            </p>
          </div>
        </div>

        {/* Khối 1: Quy định tính Phí giao hàng chi tiết */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '36px 36px',
          border: '1px solid #e5e7eb',
          marginBottom: 32,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>📏</span>
            1. Bảng Phí Vận Chuyển Theo Khoảng Cách
          </h2>
          <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, marginBottom: 24 }}>
            Nhằm mang lại chi phí tối ưu và công bằng nhất cho khách hàng, FashionHub tích hợp bản đồ tự động tính khoảng cách từ kho hàng trung tâm (Quận 1, TP. Hồ Chí Minh) đến tận tay quý khách:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
            <div style={{ background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>Khoảng cách ≤ 6 km</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>20.000 VNĐ</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Gói cước cố định nội thành siêu tiết kiệm</div>
            </div>

            <div style={{ background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>Từ km thứ 7 trở đi</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>3.000 VNĐ / km</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Tính trực tiếp tổng số km x 3.000đ/km (Không cộng 20k ban đầu)</div>
            </div>

            <div style={{ background: '#eff6ff', padding: 24, borderRadius: 12, border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: 6 }}>Đơn ≥ 1.000.000đ & ≤ 10km</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#1e40af', marginBottom: 4 }}>MIỄN PHÍ (0Đ)</div>
              <div style={{ fontSize: 13, color: '#2563eb' }}>Tài trợ 100% phí giao hàng nếu thỏa 2 điều kiện</div>
            </div>
          </div>

          <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', padding: '16px 20px', borderRadius: 10, fontSize: 14, color: '#873800' }}>
            💡 <strong>Mẹo tiết kiệm:</strong> Đặt đơn hàng từ <strong>1.000.000 VNĐ</strong> trở lên và có địa chỉ giao hàng trong bán kính <strong>10 km</strong> để nhận ngay ưu đãi <strong>MIỄN PHÍ VẬN CHUYỂN (0Đ)</strong>!
          </div>
        </div>

        {/* Khối 2: Thời gian giao hàng dự kiến */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '36px 36px',
          border: '1px solid #e5e7eb',
          marginBottom: 32,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>⏱️</span>
            2. Thời Gian Giao Hàng Dự Kiến
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏙️</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: '#111827' }}>TP.HCM & Hà Nội</h4>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#2563eb', margin: '0 0 4px 0' }}>1 – 2 Ngày</p>
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Hỗ trợ giao hỏa tốc 2H (Nội thành)</p>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🚚</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: '#111827' }}>Các Tỉnh / Thành Khác</h4>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#2563eb', margin: '0 0 4px 0' }}>2 – 4 Ngày</p>
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Tuyến Trung tâm Tỉnh/Thành phố</p>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏞️</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: '#111827' }}>Huyện, Xã & Vùng Xa</h4>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#2563eb', margin: '0 0 4px 0' }}>4 – 6 Ngày</p>
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Vùng sâu, vùng xa & Hải đảo</p>
            </div>
          </div>
        </div>

        {/* Khối 3: Đối tác vận chuyển uy tín */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '36px 36px',
          border: '1px solid #e5e7eb',
          marginBottom: 32,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>🤝</span>
            3. Đối Tác Vận Chuyển Chiến Lược
          </h2>
          <p style={{ fontSize: 14, color: '#4b5563', marginBottom: 24, lineHeight: 1.6 }}>
            FashionHub tự hào hợp tác với các đơn vị vận chuyển hàng đầu Việt Nam nhằm bảo đảm đơn hàng được bảo quản cẩn thận và chuyển giao tốc độ cao:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { name: 'Giao Hàng Nhanh (GHN)', desc: 'Chuyên tuyến giao nhanh nội thành & các tỉnh' },
              { name: 'Giao Hàng Tiết Kiệm (GHTK)', desc: 'Tối ưu giao nhận hàng tận nơi chu đáo' },
              { name: 'J&T Express', desc: 'Mạng lưới chuyển phát nhanh toàn quốc 24/7' },
              { name: 'Viettel Post', desc: 'Bảo đảm an toàn đến mọi vùng miền hải đảo' },
            ].map((p, i) => (
              <div key={i} style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 12, padding: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Khối 4: Quy trình 4 bước nhận hàng & đồng kiểm */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '36px 36px',
          border: '1px solid #e5e7eb',
          marginBottom: 32,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>📦</span>
            4. Quy Trình Nhận Hàng & Đồng Kiểm 4 Bước
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { step: '01', title: 'Xác Nhận & Đóng Gói', desc: 'Đơn hàng được niêm phong chống nước & dán mã tracking.' },
              { step: '02', title: 'Thông Báo Shipper', desc: 'Nhận cuộc gọi/tin nhắn trước 15-30 phút khi giao hàng.' },
              { step: '03', title: 'Đồng Kiểm Hàng', desc: 'Mở hộp kiểm tra đúng mẫu mã, màu sắc, size trước khi trả tiền.' },
              { step: '04', title: 'Thanh Toán & Ký Nhận', desc: 'Thanh toán COD hoặc hoàn tất nhận hàng và tận hưởng sản phẩm.' }
            ].map((s, i) => (
              <div key={i} style={{ position: 'relative', background: '#f9fafb', padding: 20, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#d1d5db', marginBottom: 8 }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Khối 5: Các câu hỏi thường gặp (FAQ) */}
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
            5. Câu Hỏi Thường Gặp Về Vận Chuyển
          </h2>

          <div style={{ display: 'grid', gap: 12 }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
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
                  <span style={{ fontSize: 18, color: '#6b7280', transition: 'transform 0.2s', transform: openFaq === idx ? 'rotate(180deg)' : 'none' }}>
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

        {/* Footer Support Box */}
        <div style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          color: '#ffffff',
          borderRadius: 16,
          padding: '32px 36px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px 0' }}>Bạn cần tư vấn trực tiếp về vận chuyển?</h3>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 20px 0' }}>Đội ngũ chăm sóc khách hàng FashionHub sẵn sàng hỗ trợ giải đáp mọi thắc mắc 24/7.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href="tel:19009999" style={{ background: '#ffffff', color: '#111827', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
              📞 Hotline: 1900 9999
            </a>
            <Link to="/contact" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
              💬 Gửi Yêu Cầu Hỗ Trợ
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ShippingPolicyPage;
