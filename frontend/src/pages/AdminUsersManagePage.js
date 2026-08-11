import React, { useEffect, useState, useCallback } from 'react';
import {
    getAllUsers, getUserById, getUserOrders,
    updateUserRole, banUser, unbanUser, deleteUser
} from '../api/userApi';

const STATUS_MAP = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
const STATUS_COLOR = { pending: '#e67e22', confirmed: '#2980b9', shipping: '#8e44ad', delivered: '#27ae60', cancelled: '#c0392b' };

/* ─────── Modal chi tiết người dùng ─────── */
function UserDetailModal({ userId, onClose, onRefresh }) {
    const [data, setData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState('info'); // 'info' | 'orders'
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [uRes, oRes] = await Promise.all([getUserById(userId), getUserOrders(userId)]);
            setData(uRes.data);
            setOrders(oRes.data.orders || []);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    }, [userId]);

    useEffect(() => { load(); }, [load]);

    const handleRoleChange = async (newRole) => {
        if (!window.confirm(`Đổi vai trò người dùng thành "${newRole === 'admin' ? 'Admin' : 'Khách hàng'}"?`)) return;
        setBusy(true);
        try { await updateUserRole(userId, newRole); await load(); onRefresh(); }
        catch (e) { alert(e.response?.data?.message || 'Lỗi xử lý'); }
        finally { setBusy(false); }
    };

    const handleBanAction = async (action) => {
        const confirmMsg = action === 'ban' ? `⛔ Cấm vĩnh viễn tài khoản "${data?.user?.name}"?` : `✅ Mở khóa tài khoản "${data?.user?.name}"?`;
        if (!window.confirm(confirmMsg)) return;
        setBusy(true);
        try {
            if (action === 'ban') await banUser(userId);
            else await unbanUser(userId);
            await load();
            onRefresh();
        } catch (e) { alert(e.response?.data?.message || 'Lỗi xử lý'); }
        finally { setBusy(false); }
    };

    const isBanned = data?.user?.is_banned === 1 || data?.user?.is_banned === true;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20, backdropFilter: 'blur(3px)'
        }} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div style={{
                background: '#fff', borderRadius: 16, width: '100%', maxWidth: 650,
                maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden'
            }}>
                {/* Header modal */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16
                }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: isBanned ? '#c0392b' : '#3498db',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, color: '#fff', fontWeight: 'bold', flexShrink: 0
                    }}>
                        {loading ? '…' : (data?.user?.name?.[0]?.toUpperCase() || '?')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {loading ? 'Đang tải...' : data?.user?.name}
                        </div>
                        <div style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>
                            {!loading && data?.user?.email}
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                        width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>×</button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #eee', background: '#fafafa' }}>
                    {[['info', '👤 Thông tin đăng ký'], ['orders', '📦 Lịch sử đơn hàng']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)} style={{
                            flex: 1, padding: '14px 0', border: 'none', background: 'none',
                            cursor: 'pointer', fontSize: 13, fontWeight: tab === key ? 'bold' : 'normal',
                            color: tab === key ? '#2980b9' : '#666',
                            borderBottom: tab === key ? '3px solid #2980b9' : '3px solid transparent',
                            transition: 'all 0.2s'
                        }}>{label}</button>
                    ))}
                </div>

                {/* Nội dung */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>⏳ Đang tải thông tin chi tiết...</div>
                    ) : tab === 'info' ? (
                        <div>
                            {isBanned && (
                                <div style={{
                                    background: '#fdedec', border: '1px solid #e74c3c', borderRadius: 10,
                                    padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#c0392b'
                                }}>
                                    <span style={{ fontSize: 20 }}>🚫</span>
                                    <div>
                                        <strong>Tài khoản bị cấm vĩnh viễn</strong>
                                        <div style={{ fontSize: 12, marginTop: 2 }}>Tài khoản này đang trong danh sách bị cấm</div>
                                    </div>
                                </div>
                            )}

                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#888', letterSpacing: '0.5px', marginBottom: 12, textTransform: 'uppercase' }}>
                                    📋 Thông tin hồ sơ đăng ký
                                </div>
                                <div style={{ background: '#f8f9fa', borderRadius: 10, border: '1px solid #e9ecef', overflow: 'hidden' }}>
                                    {[
                                        ['Mã định danh (ID)', `#${data?.user?.id}`],
                                        ['Họ và tên', data?.user?.name],
                                        ['Địa chỉ Email', data?.user?.email],
                                        ['Ngày đăng ký tham gia', new Date(data?.user?.created_at).toLocaleString('vi-VN')],
                                    ].map(([label, value]) => (
                                        <div key={label} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px 18px', borderBottom: '1px solid #eee'
                                        }}>
                                            <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
                                            <span style={{ fontSize: 13, fontWeight: '600', color: '#1a1a2e' }}>{value}</span>
                                        </div>
                                    ))}

                                    {/* Vai trò */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #eee' }}>
                                        <span style={{ fontSize: 13, color: '#666' }}>Vai trò hệ thống</span>
                                        <select
                                            value={data?.user?.role}
                                            disabled={busy}
                                            onChange={(e) => handleRoleChange(e.target.value)}
                                            style={{
                                                padding: '6px 12px', borderRadius: 6, fontSize: 12, border: '1px solid #ddd',
                                                background: data?.user?.role === 'admin' ? '#ebf5fb' : '#fff',
                                                color: data?.user?.role === 'admin' ? '#2980b9' : '#333',
                                                cursor: 'pointer', fontWeight: 'bold'
                                            }}>
                                            <option value="customer">👤 Khách hàng</option>
                                            <option value="admin">👑 Admin Quản trị</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Thống kê mua hàng */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#888', letterSpacing: '0.5px', marginBottom: 12, textTransform: 'uppercase' }}>
                                    🛒 Tổng quan lịch sử đặt hàng
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                                    {[
                                        { label: 'Tổng số đơn hàng', value: data?.stats?.total_orders || 0, icon: '📦', color: '#3498db', bg: '#ebf5fb' },
                                        { label: 'Đã giao thành công', value: data?.stats?.delivered_orders || 0, icon: '✅', color: '#27ae60', bg: '#eafaf1' },
                                        { label: 'Đơn bị hủy', value: data?.stats?.cancelled_orders || 0, icon: '❌', color: '#e74c3c', bg: '#fdedec' },
                                        { label: 'Tổng số tiền đã mua', value: `${Number(data?.stats?.total_spent || 0).toLocaleString('vi-VN')}₫`, icon: '💰', color: '#8e44ad', bg: '#f5eef8' },
                                    ].map((s) => (
                                        <div key={s.label} style={{
                                            background: s.bg, borderRadius: 10, padding: '14px 16px',
                                            display: 'flex', alignItems: 'center', gap: 12
                                        }}>
                                            <span style={{ fontSize: 24 }}>{s.icon}</span>
                                            <div>
                                                <div style={{ fontSize: 16, fontWeight: 'bold', color: s.color }}>{s.value}</div>
                                                <div style={{ fontSize: 12, color: '#666', marginTop: 1 }}>{s.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Thao tác ban/unban */}
                            {data?.user?.role !== 'admin' && (
                                <div style={{ borderTop: '1px solid #eee', paddingTop: 16, display: 'flex', gap: 12 }}>
                                    {isBanned ? (
                                        <button onClick={() => handleBanAction('unban')} disabled={busy} style={{
                                            flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #27ae60',
                                            background: '#27ae60', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: 13
                                        }}>✅ Mở khóa tài khoản</button>
                                    ) : (
                                        <button onClick={() => handleBanAction('ban')} disabled={busy} style={{
                                            flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #c0392b',
                                            background: '#c0392b', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: 13
                                        }}>⛔ Cấm vĩnh viễn tài khoản</button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {!orders.length ? (
                                <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
                                    <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                                    <div>Người dùng chưa có đơn hàng nào.</div>
                                </div>
                            ) : (
                                orders.map((o) => (
                                    <div key={o.id} style={{
                                        background: '#f8f9fa', borderRadius: 10, padding: '14px 18px',
                                        marginBottom: 12, border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 14 }}>Mã đơn #{o.id}</span>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 'bold',
                                                color: STATUS_COLOR[o.status] || '#333',
                                                background: '#fff', border: `1px solid ${STATUS_COLOR[o.status] || '#ccc'}`
                                            }}>{STATUS_MAP[o.status] || o.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 12, color: '#888' }}>
                                                {new Date(o.created_at).toLocaleString('vi-VN')}
                                            </span>
                                            <span style={{ fontWeight: 'bold', color: '#c0392b', fontSize: 14 }}>
                                                {Number(o.total_amount).toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─────── Trang quản lý người dùng chính ─────── */
function AdminUsersManagePage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'customer' | 'admin'
    const [selectedId, setSelectedId] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [toast, setToast] = useState('');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const load = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data.users || []);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`🗑️ Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${name}" (#${id})?\n\nTất cả dữ liệu tài khoản sẽ bị xóa hoàn toàn.`)) return;
        setDeleting(id);
        try {
            await deleteUser(id);
            showToast(`✅ Đã xóa tài khoản "${name}" thành công`);
            await load();
        } catch (e) {
            alert(e.response?.data?.message || 'Có lỗi xảy ra khi xóa tài khoản');
        } finally {
            setDeleting(null);
        }
    };

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            String(u.id).includes(search);
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const totalCustomers = users.filter((u) => u.role === 'customer').length;
    const totalAdmins = users.filter((u) => u.role === 'admin').length;

    return (
        <div style={{ padding: '30px 40px', minHeight: '100vh', background: '#f8f9fa', maxWidth: 1400, margin: '0 auto' }}>
            {toast && (
                <div style={{
                    position: 'fixed', top: 20, right: 20, background: '#27ae60', color: '#fff',
                    padding: '14px 24px', borderRadius: 8, fontWeight: 'bold', fontSize: 14,
                    boxShadow: '0 4px 20px rgba(39,174,96,0.35)', zIndex: 2000
                }}>{toast}</div>
            )}

            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: '800', color: '#1a1a2e', margin: 0 }}>
                    👥 Quản lý tất cả người dùng
                </h2>
                <p style={{ color: '#666', marginTop: 6, fontSize: 14 }}>
                    Xem chi tiết hồ sơ người dùng đăng ký, phân quyền vai trò và xóa tài khoản
                </p>
            </div>

            {/* Thống kê top */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Tổng số người dùng', value: users.length, icon: '👥', color: '#3498db', bg: '#ebf5fb' },
                    { label: 'Khách hàng đăng ký', value: totalCustomers, icon: '🛍️', color: '#27ae60', bg: '#eafaf1' },
                    { label: 'Quản trị viên (Admin)', value: totalAdmins, icon: '👑', color: '#8e44ad', bg: '#f5eef8' },
                ].map((s) => (
                    <div key={s.label} style={{
                        background: '#fff', borderRadius: 12, padding: '20px 24px',
                        border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 10, background: s.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                        }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 26, fontWeight: '800', color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thanh tìm kiếm & lọc */}
            <div style={{
                background: '#fff', borderRadius: 12, padding: '16px 20px',
                marginBottom: 20, display: 'flex', gap: 14, alignItems: 'center',
                flexWrap: 'wrap', border: '1px solid #eee'
            }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm theo tên, email hoặc ID người dùng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: 260, padding: '10px 16px', borderRadius: 8,
                        border: '1px solid #ccc', fontSize: 14, outline: 'none'
                    }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    {[
                        { key: 'all', label: '📋 Tất cả' },
                        { key: 'customer', label: '🛍️ Khách hàng' },
                        { key: 'admin', label: '👑 Admin' },
                    ].map((f) => (
                        <button key={f.key} onClick={() => setRoleFilter(f.key)} style={{
                            padding: '8px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                            border: '1px solid',
                            borderColor: roleFilter === f.key ? '#000' : '#ddd',
                            background: roleFilter === f.key ? '#000' : '#fff',
                            color: roleFilter === f.key ? '#fff' : '#333',
                            fontWeight: roleFilter === f.key ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}>{f.label}</button>
                    ))}
                </div>
                <button onClick={load} style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    border: '1px solid #ccc', background: '#f8f9fa', color: '#333', fontWeight: 600
                }}>🔄 Làm mới</button>
            </div>

            {/* Bảng danh sách người dùng (ĐÃ BỎ CỘT TRẠNG THÁI THEO YÊU CẦU ÁNH 3) */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>⏳ Đang tải danh sách người dùng...</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#aaa', background: '#fff', borderRadius: 12 }}>
                    <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
                    <div>Không tìm thấy người dùng phù hợp</div>
                </div>
            ) : (
                <div style={{
                    background: '#fff', borderRadius: 12, overflow: 'hidden',
                    border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                                {['ID', 'Tên / Email', 'Vai trò', 'Ngày tham gia', 'Thao tác'].map((h) => (
                                    <th key={h} style={{
                                        padding: '14px 18px', textAlign: 'left',
                                        color: '#495057', fontWeight: 700, fontSize: 13
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => {
                                return (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                                        <td style={{ padding: '14px 18px', fontWeight: 'bold', color: '#555' }}>#{u.id}</td>

                                        {/* Tên / Email */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>{u.name}</div>
                                            <div style={{ fontSize: 12, color: '#777', marginTop: 2 }}>{u.email}</div>
                                        </td>

                                        {/* Vai trò */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                background: u.role === 'admin' ? '#f5eef8' : '#eafaf1',
                                                color: u.role === 'admin' ? '#8e44ad' : '#27ae60',
                                                border: `1px solid ${u.role === 'admin' ? '#d2b4de' : '#a9dfbf'}`
                                            }}>
                                                {u.role === 'admin' ? '👑 Admin' : '🛍️ Khách hàng'}
                                            </span>
                                        </td>

                                        {/* Ngày tham gia */}
                                        <td style={{ padding: '14px 18px', color: '#666', fontSize: 13 }}>
                                            {new Date(u.created_at).toLocaleDateString('vi-VN')}
                                        </td>

                                        {/* Thao tác: Chi tiết & Thùng rác (Xóa) */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <button
                                                    onClick={() => setSelectedId(u.id)}
                                                    style={{
                                                        padding: '7px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                                                        border: '1px solid #3498db', background: '#ebf5fb', color: '#2980b9',
                                                        fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6
                                                    }}>
                                                    👁️ Chi tiết
                                                </button>
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(u.id, u.name)}
                                                        disabled={deleting === u.id}
                                                        title="Xóa vĩnh viễn tài khoản người dùng"
                                                        style={{
                                                            padding: '7px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
                                                            border: '1px solid #e74c3c', background: '#fdedec', color: '#c0392b',
                                                            fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            opacity: deleting === u.id ? 0.5 : 1
                                                        }}>
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div style={{ padding: '12px 18px', borderTop: '1px solid #eee', fontSize: 13, color: '#777', background: '#fafafa' }}>
                        Hiển thị {filtered.length} / {users.length} người dùng
                    </div>
                </div>
            )}

            {/* Modal Chi tiết */}
            {selectedId && (
                <UserDetailModal
                    userId={selectedId}
                    onClose={() => setSelectedId(null)}
                    onRefresh={load}
                />
            )}
        </div>
    );
}

export default AdminUsersManagePage;
