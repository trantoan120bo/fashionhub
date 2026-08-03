import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/productApi';

const INIT = { name: '', description: '' };

function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(INIT);
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const load = () => getCategories().then((r) => setCategories(r.data.categories || []));

    useEffect(() => { load(); }, []);

    const openCreate = () => { setForm(INIT); setEditId(null); setShowModal(true); };
    const openEdit = (c) => {
        setForm({ name: c.name, description: c.description || '' });
        setEditId(c.id); setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            if (editId) await updateCategory(editId, form);
            else await createCategory(form);
            setMsg('Lưu danh mục thành công'); setShowModal(false); load();
        } catch { setMsg('Lưu danh mục thất bại'); }
        finally { setLoading(false); setTimeout(() => setMsg(''), 2000); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa danh mục này? (Lưu ý: Các sản phẩm thuộc danh mục này sẽ bị để trống danh mục)')) return;
        try {
            await deleteCategory(id); load();
        } catch { alert('Không thể xóa danh mục này'); }
    };

    return (
        <div style={{ padding: '28px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 'bold' }}>Quản lý danh mục</h2>
                <button onClick={openCreate}
                    style={{ padding: '8px 20px', background: '#000', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                    + Thêm danh mục
                </button>
            </div>

            {msg && <p style={{ color: '#27ae60', marginBottom: 12, fontSize: 13 }}>{msg}</p>}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>ID</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Tên danh mục</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Mô tả</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 12px' }}>{c.id}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>{c.name}</td>
                            <td style={{ padding: '10px 12px' }}>{c.description}</td>
                            <td style={{ padding: '10px 12px' }}>
                                <button onClick={() => openEdit(c)} style={{ marginRight: 8, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>Sửa</button>
                                <button onClick={() => handleDelete(c.id)} style={{ padding: '4px 12px', fontSize: 12, cursor: 'pointer', background: '#c0392b', color: '#fff', border: 'none' }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                    <div style={{ background: '#fff', padding: 32, width: 400 }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: 20 }}>{editId ? 'Sửa' : 'Thêm'} danh mục</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Tên danh mục</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', fontSize: 13, boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Mô tả</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', fontSize: 13, boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button type="submit" disabled={loading}
                                    style={{ flex: 1, padding: '12px', background: '#27ae60', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                    {loading ? 'Đang lưu...' : 'LƯU'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    style={{ flex: 1, padding: '12px', background: '#eee', border: 'none', cursor: 'pointer' }}>HỦY</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategoriesPage;
