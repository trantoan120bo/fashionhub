import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../api/productApi';

const INIT = { name: '', category_id: '', price: '', original_price: '', description: '', stock: '', image_url: '' };

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(INIT);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => getProducts({ limit: 50 }).then((r) => setProducts(r.data.products || []));

  useEffect(() => {
    load();
    getCategories().then((r) => setCategories(r.data.categories || []));
  }, []);

  const openCreate = () => { setForm(INIT); setEditId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, category_id: p.category_id, price: p.price, original_price: p.original_price || '', description: p.description || '', stock: p.stock, image_url: p.images?.[0]?.image_url || '' });
    setEditId(p.id); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editId) await updateProduct(editId, form);
      else await createProduct(form);
      setMsg('Lưu thành công'); setShowModal(false); load();
    } catch { setMsg('Lưu thất bại'); }
    finally { setLoading(false); setTimeout(() => setMsg(''), 2000); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    await deleteProduct(id); load();
  };

  return (
    <div style={{ padding: '28px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold' }}>Quản lý sản phẩm</h2>
        <button onClick={openCreate}
          style={{ padding: '8px 20px', background: '#000', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 13 }}>
          + Thêm sản phẩm
        </button>
      </div>
      {msg && <p style={{ color: '#27ae60', marginBottom: 12, fontSize: 13 }}>{msg}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {['ID', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', ''].map((h) => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 12px' }}>{p.id}</td>
              <td style={{ padding: '10px 12px' }}>{p.name}</td>
              <td style={{ padding: '10px 12px' }}>{p.category_name}</td>
              <td style={{ padding: '10px 12px' }}>{Number(p.price).toLocaleString('vi-VN')}₫</td>
              <td style={{ padding: '10px 12px' }}>{p.stock}</td>
              <td style={{ padding: '10px 12px' }}>
                <button onClick={() => openEdit(p)} style={{ marginRight: 8, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>Sửa</button>
                <button onClick={() => handleDelete(p.id)} style={{ padding: '4px 12px', fontSize: 12, cursor: 'pointer', background: '#c0392b', color: '#fff', border: 'none' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', padding: 32, width: 480, maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: 20 }}>{editId ? 'Chỉnh sửa' : 'Thêm'} sản phẩm</h3>
            <form onSubmit={handleSave}>
              {[['name', 'Tên sản phẩm'], ['price', 'Giá'], ['original_price', 'Giá gốc (tuỳ chọn)'], ['stock', 'Tồn kho'], ['image_url', 'URL ảnh chính']].map(([key, label]) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>{label}</label>
                  <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Danh mục</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', fontSize: 13 }}>
                    <option value="">-- Chọn danh mục --</option>
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
                  }} style={{ padding: '0 12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Xem trước ảnh</label>
                <div style={{ width: 100, height: 120, border: '1px solid #eee', background: '#f9f9f9' }}>
                  {form.image_url && <img src={form.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={loading}
                  style={{ flex: 1, padding: '12px', background: '#27ae60', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                  {loading ? 'Đang xử lý...' : 'XÁC NHẬN LƯU'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', background: '#eee', color: '#333', border: 'none', cursor: 'pointer' }}>BỎ QUA</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
