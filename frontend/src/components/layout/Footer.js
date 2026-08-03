import React from 'react';

function Footer() {
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
          <li>Chính sách vận chuyển</li>
          <li>Chính sách đổi trả</li>
          <li>Hướng dẫn chọn size</li>
          <li>Liên hệ hỗ trợ</li>
        </ul>
      </div>

      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#fff' }}>SOCIAL</h4>
        <ul style={{ listStyle: 'none', fontSize: 13, color: '#888', display: 'grid', gap: 12 }}>
          <li>Facebook</li>
          <li>Instagram</li>
          <li>TikTok</li>
          <li>Pinterest</li>
        </ul>
      </div>

      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: '#fff' }}>NEWSLETTER</h4>
        <p style={{ color: '#888', fontSize: 12, marginBottom: 15 }}>Đăng ký để nhận thông báo về bst mới nhất.</p>
        <div style={{ display: 'flex' }}>
          <input type="text" placeholder="Email của bạn" style={{ background: '#222', border: 'none', padding: '10px 15px', color: '#fff', width: '100%' }} />
          <button style={{ background: '#fff', color: '#000', padding: '0 20px', fontWeight: 700, fontSize: 12 }}>GO</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
