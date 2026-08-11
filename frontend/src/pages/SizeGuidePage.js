import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpNav from '../components/layout/HelpNav';

function SizeGuidePage() {
  const [activeTabGender, setActiveTabGender] = useState('men');
  const [calcGender, setCalcGender] = useState('men');
  const [calcHeight, setCalcHeight] = useState('');
  const [calcWeight, setCalcWeight] = useState('');
  const [recommendedSize, setRecommendedSize] = useState(null);

  const calculateSize = (e) => {
    e.preventDefault();
    const h = parseFloat(calcHeight);
    const w = parseFloat(calcWeight);

    if (!h || !w || h <= 0 || w <= 0) {
      alert('Vui lòng nhập chiều cao và cân nặng hợp lệ!');
      return;
    }

    let size = 'M';
    let note = 'Form vừa vặn thoải mái (Regular Fit)';

    if (calcGender === 'men') {
      if (w < 55 && h < 165) { size = 'S'; note = 'Phù hợp người có thể trạng nhỏ, thon gọn.'; }
      else if (w <= 65 && h <= 170) { size = 'M'; note = 'Size phổ biến nhất, vừa vặn người Việt.'; }
      else if (w <= 73 && h <= 176) { size = 'L'; note = 'Dành cho chiều cao chuẩn, hơi đô con.'; }
      else if (w <= 82 && h <= 182) { size = 'XL'; note = 'Form rộng rãi thoải mái.'; }
      else { size = 'XXL'; note = 'Dành cho người có thể trạng lớn hoặc thích mặc Oversize rộng.'; }
    } else {
      if (w < 48 && h < 158) { size = 'S'; note = 'Tôn dáng thon gọn, thanh thoát.'; }
      else if (w <= 55 && h <= 163) { size = 'M'; note = 'Dáng người vừa vặn chuẩn phom Nữ.'; }
      else if (w <= 62 && h <= 168) { size = 'L'; note = 'Vừa vặn thoải mái không bó sát.'; }
      else if (w <= 70 && h <= 173) { size = 'XL'; note = 'Che khuyết điểm cơ thể rất tốt.'; }
      else { size = 'XXL'; note = 'Dáng Oversize cá tính hoặc mặc thoải mái.'; }
    }

    setRecommendedSize({ size, note });
  };

  const menSizes = [
    { size: 'S', weight: '50 – 58 kg', height: '160 – 165 cm', chest: '86 – 90', waist: '70 – 74', shoulder: '42' },
    { size: 'M', weight: '58 – 65 kg', height: '165 – 170 cm', chest: '90 – 94', waist: '74 – 78', shoulder: '44' },
    { size: 'L', weight: '65 – 72 kg', height: '170 – 175 cm', chest: '94 – 98', waist: '78 – 82', shoulder: '46' },
    { size: 'XL', weight: '72 – 80 kg', height: '175 – 180 cm', chest: '98 – 102', waist: '82 – 86', shoulder: '48' },
    { size: 'XXL', weight: '80 – 92 kg', height: '180 – 188 cm', chest: '102 – 108', waist: '86 – 94', shoulder: '50' },
  ];

  const womenSizes = [
    { size: 'S', weight: '42 – 48 kg', height: '150 – 158 cm', chest: '78 – 82', waist: '60 – 64', hips: '84 – 88' },
    { size: 'M', weight: '48 – 55 kg', height: '158 – 163 cm', chest: '82 – 86', waist: '64 – 68', hips: '88 – 92' },
    { size: 'L', weight: '55 – 62 kg', height: '163 – 168 cm', chest: '86 – 90', waist: '68 – 72', hips: '92 – 96' },
    { size: 'XL', weight: '62 – 70 kg', height: '168 – 173 cm', chest: '90 – 96', waist: '72 – 78', hips: '96 – 102' },
    { size: 'XXL', weight: '70 – 78 kg', height: '173 – 178 cm', chest: '96 – 102', waist: '78 – 84', hips: '102 – 108' },
  ];

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: 80 }}>
      <HelpNav
        activeTab="size"
        title="Hướng Dẫn Chọn Size Quần Áo Chuẩn Xác"
        subtitle="Tra cứu bảng thông số kích thước cơ thể chuẩn Việt Nam và ứng dụng gợi ý size tự động độc quyền."
      />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>

        {/* Khối CÔNG CỤ TÍNH SIZE TỰ ĐỘNG */}
        <div style={{
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          color: '#ffffff',
          borderRadius: 20,
          padding: '36px 36px',
          marginBottom: 40,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', right: '-40px', bottom: '-40px', fontSize: 180, opacity: 0.04, pointerEvents: 'none'
          }}>📐</div>

          <div style={{ display: 'inline-block', background: '#3b82f6', color: '#ffffff', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
            CÔNG CỤ THÔNG MINH FASHIONHUB
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px 0' }}>Gợi Ý Size Tự Động Theo Chiều Cao & Cân Nặng</h2>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 28px 0', maxWidth: 650 }}>
            Nhập số đo cá nhân của bạn để hệ thống phân tích và đề xuất kích cỡ quần áo chuẩn xác nhất cho thể trạng của bạn.
          </p>

          <form onSubmit={calculateSize} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#d1d5db', marginBottom: 8 }}>
                Giới Tính
              </label>
              <select
                value={calcGender}
                onChange={e => setCalcGender(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #374151', background: '#1f2937', color: '#ffffff', fontSize: 14, fontWeight: 600, outline: 'none' }}
              >
                <option value="men">Nam Giới 👔</option>
                <option value="women">Nữ Giới 👗</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#d1d5db', marginBottom: 8 }}>
                Chiều Cao (cm)
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 172"
                value={calcHeight}
                onChange={e => setCalcHeight(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #374151', background: '#1f2937', color: '#ffffff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#d1d5db', marginBottom: 8 }}>
                Cân Nặng (kg)
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 65"
                value={calcWeight}
                onChange={e => setCalcWeight(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #374151', background: '#1f2937', color: '#ffffff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                GỢI Ý SIZE NGAY ✨
              </button>
            </div>
          </form>

          {/* Kết quả tính toán */}
          {recommendedSize && (
            <div style={{
              marginTop: 28,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 14,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              animation: 'fadeIn 0.3s ease-in-out'
            }}>
              <div style={{ background: '#2563eb', color: '#ffffff', width: 64, height: 64, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, flexShrink: 0 }}>
                {recommendedSize.size}
              </div>
              <div>
                <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px', color: '#93c5fd', fontWeight: 700 }}>
                  Kích cỡ đề xuất cho bạn: SIZE {recommendedSize.size}
                </div>
                <div style={{ fontSize: 14, color: '#e0e7ff', marginTop: 4 }}>
                  💡 {recommendedSize.note}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Khối BẢNG SIZE CHI TIẾT CHUẨN NỮ & NAM */}
        <div style={{ background: '#ffffff', borderRadius: 16, padding: '36px 36px', border: '1px solid #e5e7eb', marginBottom: 32, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>📊</span>
              Bảng Thông Số Kích Thước Chi Tiết
            </h2>

            {/* Toggle Giới Tính */}
            <div style={{ display: 'flex', background: '#f3f4f6', padding: 4, borderRadius: 10, gap: 4 }}>
              <button
                onClick={() => setActiveTabGender('men')}
                style={{
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTabGender === 'men' ? '#ffffff' : 'transparent',
                  color: activeTabGender === 'men' ? '#111827' : '#6b7280',
                  boxShadow: activeTabGender === 'men' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                👔 Thời Trang NAM
              </button>
              <button
                onClick={() => setActiveTabGender('women')}
                style={{
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTabGender === 'women' ? '#ffffff' : 'transparent',
                  color: activeTabGender === 'women' ? '#111827' : '#6b7280',
                  boxShadow: activeTabGender === 'women' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                👗 Thời Trang NỮ
              </button>
            </div>
          </div>

          {/* Bảng Nam */}
          {activeTabGender === 'men' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#111827', color: '#ffffff' }}>
                    <th style={{ padding: '14px 18px', textAlign: 'center', borderRadius: '8px 0 0 0', fontWeight: 700 }}>SIZE</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700 }}>CÂN NẶNG</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700 }}>CHIỀU CAO</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700 }}>VÒNG NGỰC (cm)</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700 }}>VÒNG EO (cm)</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', borderRadius: '0 8px 0 0', fontWeight: 700 }}>RỘNG VAI (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {menSizes.map((row, idx) => (
                    <tr key={row.size} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, color: '#2563eb', fontSize: 15 }}>{row.size}</td>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: '#111827' }}>{row.weight}</td>
                      <td style={{ padding: '14px 18px', color: '#4b5563' }}>{row.height}</td>
                      <td style={{ padding: '14px 18px', color: '#4b5563' }}>{row.chest}</td>
                      <td style={{ padding: '14px 18px', color: '#4b5563' }}>{row.waist}</td>
                      <td style={{ padding: '14px 18px', color: '#4b5563' }}>{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bảng Nữ */}
          {activeTabGender === 'women' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#111827', color: '#ffffff' }}>
                    <th style={{ padding: '14px 18px', textAlign: 'center', borderRadius: '8px 0 0 0', fontWeight: 700 }}>SIZE</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700 }}>CÂN NẶNG</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700 }}>CHIỀU CAO</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700 }}>VÒNG NGỰC (cm)</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700 }}>VÒNG EO (cm)</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', borderRadius: '0 8px 0 0', fontWeight: 700 }}>VÒNG MÔNG (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {womenSizes.map((row, idx) => (
                    <tr key={row.size} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, color: '#ec4899', fontSize: 15 }}>{row.size}</td>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: '#111827' }}>{row.weight}</td>
                      <td style={{ padding: '14px 18px', color: '#4b5563' }}>{row.height}</td>
                      <td style={{ padding: '14px 18px', color: '#4b5563' }}>{row.chest}</td>
                      <td style={{ padding: '14px 18px', color: '#4b5563' }}>{row.waist}</td>
                      <td style={{ padding: '14px 18px', color: '#4b5563' }}>{row.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Khối HƯỚNG DẪN ĐO CƠ THỂ */}
        <div style={{ background: '#ffffff', borderRadius: 16, padding: '36px 36px', border: '1px solid #e5e7eb', marginBottom: 32, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>📏</span>
            Mẹo Đo Số Đo Cơ Thể Chuẩn Nhất Tại Nhà
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <div style={{ background: '#f9fafb', padding: 20, borderRadius: 12, border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>📍 Vòng Ngực</div>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Dùng thước dây quấn quanh phần nở nhất của khuôn ngực, giữ thước dây phẳng ngang lưng.
              </p>
            </div>

            <div style={{ background: '#f9fafb', padding: 20, borderRadius: 12, border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>📍 Vòng Eo</div>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Đo quanh vị trí hẹp nhất của thắt lưng (thường cách rốn khoảng 2 – 3 cm về phía trên).
              </p>
            </div>

            <div style={{ background: '#f9fafb', padding: 20, borderRadius: 12, border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>📍 Vòng Mông</div>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Đứng khép 2 chân, quấn thước dây quanh phần đặn nhất của vòng 3.
              </p>
            </div>
          </div>
        </div>

        {/* Khối PHÂN BIỆT FORM DÁNG */}
        <div style={{ background: '#ffffff', borderRadius: 16, padding: '36px 36px', border: '1px solid #e5e7eb', marginBottom: 40, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: 10, fontSize: 18 }}>👕</span>
            Lựa Chọn Phù Hợp Theo Form Áo (Fit Type)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 4 }}>Slim Fit (Ôm Sát)</div>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Thiết kế ôm nhẹ đường nét cơ thể. Thích hợp cho người có thể trạng cân đối. Nếu thích mặc thoải mái, bạn nên nhích 1 size.
              </p>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 4 }}>Regular Fit (Vừa Vặn)</div>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Form áo tiêu chuẩn quốc tế, phù hợp với hầu hết vóc dáng người Việt. Chọn đúng theo bảng size chuẩn bên trên.
              </p>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 4 }}>Oversized / Loose Fit (Rộng Rãi)</div>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Form áo rộng thoải mái, phong cách streetwear hiện đại. Nếu không muốn quá rộng, bạn có thể lùi 1 size.
              </p>
            </div>
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
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px 0' }}>Vẫn chưa chắc chắn về Size của mình?</h3>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 20px 0' }}>Gửi chiều cao, cân nặng của bạn cho chúng tôi để nhân viên Stylist tư vấn cá nhân hóa ngay lập tức.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ background: '#ffffff', color: '#111827', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
              💬 Chat Với Tư Vấn Viên Chọn Size
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SizeGuidePage;
