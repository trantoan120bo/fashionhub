import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, createCategory } from '../api/productApi';

const INIT = {
  name: '',
  category_id: '',
  price: '',
  original_price: '',
  discount_percent: '',
  description: '',
  stock: '',
  image_url: ''
};

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(INIT);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => getProducts({ limit: 100 }).then((r) => setProducts(r.data.products || []));

  useEffect(() => {
    load();
    getCategories().then((r) => setCategories(r.data.categories || []));
  }, []);

  const openCreate = () => {
    setForm(INIT);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    const orig = p.original_price ? Number(p.original_price) : Number(p.price);
    const prc = Number(p.price);
    const disc = (orig > prc) ? Math.round((1 - prc / orig) * 100) : 0;

    setForm({
      name: p.name,
      category_id: p.category_id || '',
      price: p.price,
      original_price: p.original_price || '',
      discount_percent: disc > 0 ? disc : '',
      description: p.description || '',
      stock: p.stock,
      image_url: p.images?.[0]?.image_url || ''
    });
    setEditId(p.id);
    setShowModal(true);
  };

  const handlePriceChange = (val) => {
    const prc = Number(val);
    const orig = Number(form.original_price);
    let disc = form.discount_percent;
    if (orig && orig > prc) {
      disc = Math.round((1 - prc / orig) * 100);
    }
    setForm(f => ({ ...f, price: val, discount_percent: disc }));
  };

  const handleOriginalPriceChange = (val) => {
    const orig = Number(val);
    const disc = Number(form.discount_percent);
    let prc = form.price;

    if (orig && disc > 0) {
      prc = Math.round(orig * (1 - disc / 100));
    } else if (orig && prc && orig > Number(prc)) {
      // Keep current price, calculate discount
    }
    setForm(f => ({ ...f, original_price: val, price: prc }));
  };

  const handleDiscountChange = (val) => {
    const disc = Number(val);
    const orig = Number(form.original_price) || Number(form.price);
    let prc = form.price;

    if (orig && disc >= 0 && disc <= 100) {
      prc = Math.round(orig * (1 - disc / 100));
    }
    setForm(f => ({
      ...f,
      discount_percent: val,
      original_price: orig || f.original_price,
      price: prc
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert('Vui lòng nhập tên sản phẩm và giá');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        category_id: form.category_id,
        price: form.price,
        original_price: form.original_price || null,
        description: form.description,
        stock: form.stock || 0,
        image_url: form.image_url
      };

      if (editId) await updateProduct(editId, payload);
      else await createProduct(payload);
      setMsg('Lưu sản phẩm và phần trăm giảm giá thành công! Trang người dùng đã được cập nhật.');
      setShowModal(false);
      load();
    } catch {
      setMsg('Lưu thất bại');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div style={{ padding: '28px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 'bold' }}>Quản lý sản phẩm & Giảm giá</h2>
          <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Thay đổi giá bán hoặc phần trăm (%) giảm giá sẽ được đồng bộ ngay lên trang khách hàng.</p>
        </div>
        <button onClick={openCreate}
          style={{ padding: '10px 24px', background: '#000', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 13, borderRadius: 6 }}>
          + Thêm sản phẩm
        </button>
      </div>

      {msg && <div style={{ padding: '12px 16px', background: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold', marginBottom: 16, borderRadius: 6, border: '1px solid #c8e6c9' }}>{msg}</div>}

      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
              {['ID', 'Ảnh', 'Tên sản phẩm', 'Danh mục', 'Giá bán thực tế', 'Giá gốc', '% Giảm giá', 'Tồn kho', 'Hành động'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const orig = p.original_price ? Number(p.original_price) : Number(p.price);
              const prc = Number(p.price);
              const discPercent = (orig > prc) ? Math.round((1 - prc / orig) * 100) : 0;
              const imgUrl = p.images?.[0]?.image_url;

              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>#{p.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt="" style={{ width: 40, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                    ) : (
                      <div style={{ width: 40, height: 48, background: '#eee', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#999' }}>No img</div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{p.category_name || 'Khác'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#c0392b' }}>
                    {prc.toLocaleString('vi-VN')}₫
                  </td>
                  <td style={{ padding: '12px 16px', color: '#888' }}>
                    {p.original_price ? `${Number(p.original_price).toLocaleString('vi-VN')}₫` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {discPercent > 0 ? (
                      <span style={{ background: '#c0392b', color: '#fff', fontSize: 11, fontWeight: 'bold', padding: '3px 8px', borderRadius: 4 }}>
                        -{discPercent}%
                      </span>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: 12 }}>Không giảm</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.stock}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => openEdit(p)} style={{ marginRight: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', background: '#000', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}>Sửa / Giảm giá</button>
                    <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', fontSize: 12, cursor: 'pointer', background: '#fff', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 4, fontWeight: 600 }}>Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Chỉnh sửa / Thêm sản phẩm & Giảm giá */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', padding: 32, width: 500, borderRadius: 12, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #000' }}>
              {editId ? '🏷️ Chỉnh sửa sản phẩm & Giảm giá' : '➕ Thêm sản phẩm mới'}
            </h3>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>Tên sản phẩm *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nhập tên sản phẩm"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
              </div>

              {/* Phần thiết lập Giảm giá & Giá bán */}
              <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #e9ecef', marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 'bold', color: '#1565c0', marginBottom: 12 }}>🏷️ Cấu hình Giá & Phần trăm (%) Giảm giá</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Giá gốc (chưa giảm)</label>
                    <input type="number" value={form.original_price}
                      onChange={(e) => handleOriginalPriceChange(e.target.value)}
                      placeholder="Ví dụ: 500000"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4, color: '#c0392b' }}>% Giảm giá</label>
                    <input type="number" min="0" max="99" value={form.discount_percent}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      placeholder="Ví dụ: 20 (%)"
                      style={{ width: '100%', padding: '8px 10px', border: '2px solid #c0392b', borderRadius: 4, fontSize: 13, fontWeight: 'bold', color: '#c0392b', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Giá bán thực tế (đã giảm)</label>
                  <input type="number" value={form.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="Ví dụ: 400000"
                    style={{ width: '100%', padding: '10px', border: '1px solid #000', borderRadius: 4, fontSize: 14, fontWeight: 'bold', color: '#2e7d32', boxSizing: 'border-box', background: '#fff' }} />
                  {form.original_price && form.price && (
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      Khách hàng tiết kiệm: <strong>{(Number(form.original_price) - Number(form.price)).toLocaleString('vi-VN')}₫</strong> ({form.discount_percent}% giảm giá)
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>Số lượng tồn kho</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>Danh mục</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 13, background: '#fff' }}>
                      <option value="">-- Chọn --</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="button" onClick={async () => {
                      const name = prompt('Nhập tên danh mục mới:');
                      if (name) {
                        try {
                          await createCategory({ name });
                          const catRes = await getCategories();
                          const newCats = catRes.data.categories;
                          setCategories(newCats);
                          const newCat = newCats.find(c => c.name === name);
                          if (newCat) setForm({ ...form, category_id: newCat.id });
                          alert('Đã thêm danh mục mới');
                        } catch { alert('Lỗi khi thêm danh mục'); }
                      }
                    }} style={{ padding: '0 12px', background: '#000', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>+</button>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>URL ảnh chính sản phẩm</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
              </div>

              {form.image_url && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Xem trước ảnh</label>
                  <div style={{ width: 80, height: 96, border: '1px solid #eee', borderRadius: 4, overflow: 'hidden' }}>
                    <img src={form.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>Mô tả sản phẩm</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  placeholder="Mô tả chi tiết..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={loading}
                  style={{ flex: 1, padding: '14px', background: '#27ae60', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
                  {loading ? 'Đang xử lý...' : 'XÁC NHẬN LƯU & CẬP NHẬT'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '14px 20px', background: '#f1f3f5', color: '#333', border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>BỎ QUA</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
