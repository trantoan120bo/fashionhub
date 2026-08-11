import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      alert('Vui lòng nhập đúng định dạng email.');
      return;
    }
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const linkStyle = {
    color: '#888', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer'
  };

  return (
    <footer style={{
      background: '#000',
      color: '#fff',
      padding: '80px 10%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px'
    }}>
      <div>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>FASHIONHUB</h3>
        <p style={{ color: '#888', fontSize: 13, lineHeight: '2' }}>
          Tự hào là đơn vị tiên phong trong lĩnh vực thời trang bền vững tại Việt Nam.
          FashionHub luôn mang đến những giá trị thực chất nhất cho khách hàng.
        </p>
      </div>

      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#fff' }}>HỖ TRỢ KHÁCH HÀNG</h4>
        <ul style={{ listStyle: 'none', fontSize: 13, color: '#888', display: 'grid', gap: 12 }}>
          <li><Link to="/shipping-policy" style={linkStyle}>Chính sách vận chuyển</Link></li>
          <li><Link to="/return-policy" style={linkStyle}>Chính sách đổi trả</Link></li>
          <li><Link to="/size-guide" style={linkStyle}>Hướng dẫn chọn size</Link></li>
          <li><Link to="/contact" style={linkStyle}>Liên hệ hỗ trợ</Link></li>
        </ul>
      </div>

      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#fff' }}>SOCIAL</h4>
        <ul style={{ listStyle: 'none', fontSize: 13, color: '#888', display: 'grid', gap: 12 }}>
          <li>
            <a href="https://www.facebook.com/tran.toan.564825" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Facebook
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/labo823/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Instagram
            </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/@trasuakemplan" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              TikTok
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#fff' }}>NEWSLETTER</h4>
        <p style={{ color: '#888', fontSize: 12, marginBottom: 15 }}>Đăng ký để nhận thông báo về bst mới nhất.</p>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            placeholder="Email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNewsletter()}
            style={{ background: '#222', border: 'none', padding: '10px 15px', color: '#fff', width: '100%' }}
          />
          <button
            onClick={handleNewsletter}
            style={{ background: '#fff', color: '#000', padding: '0 20px', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}
          >GO</button>
        </div>
        {subscribed && (
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            background: 'rgba(39,174,96,0.15)',
            border: '1px solid rgba(39,174,96,0.3)',
            borderRadius: 6,
            color: '#27ae60',
            fontSize: 12,
            lineHeight: 1.5
          }}>
            ✓ Cảm ơn bạn đã quan tâm! Chúng tôi sẽ phản hồi tới bạn nhanh chóng.
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
