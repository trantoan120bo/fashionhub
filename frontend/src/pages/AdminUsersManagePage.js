import React, { useEffect, useState, useCallback } from 'react';
import {
    getAllUsers, getUserById, getUserOrders,
    updateUserRole, banUser, unbanUser,
    resetCancelCount, deleteUser
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

    const act = async (fn, msg) => {
        if (!window.confirm(msg)) return;
        setBusy(true);
        try { await fn(); await load(); onRefresh(); }
        catch (e) { alert(e.response?.data?.message || 'Lỗi xử lý'); }
        finally { setBusy(false); }
    };

    const handleRoleChange = async (newRole) => {
        if (!window.confirm(`Đổi vai trò thành "${newRole === 'admin' ? 'Admin' : 'Khách hàng'}"?`)) return;
        setBusy(true);
        try { await updateUserRole(userId, newRole); await load(); onRefresh(); }
        catch (e) { alert(e.response?.data?.message || 'Lỗi xử lý'); }
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
                background: '#fff', borderRadius: 16, width: '100%', maxWidth: 640,
                maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden'
            }}>
                {/* Header modal */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: isBanned ? '#c0392b' : '#3498db',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, color: '#fff', fontWeight: 'bold', flexShrink: 0
                    }}>
                        {loading ? '…' : (data?.user?.name?.[0]?.toUpperCase() || '?')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                    {[['info', '👤 Thông tin'], ['orders', '📦 Đơn hàng']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)} style={{
                            flex: 1, padding: '12px 0', border: 'none', background: 'none',
                            cursor: 'pointer', fontSize: 13, fontWeight: tab === key ? 'bold' : 'normal',
                            color: tab === key ? '#2980b9' : '#888',
                            borderBottom: tab === key ? '2px solid #2980b9' : '2px solid transparent',
                            transition: 'all 0.2s'
                        }}>{label}</button>
                    ))}
                </div>

                {/* Nội dung */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>⏳ Đang tải...</div>
                    ) : tab === 'info' ? (
                        <InfoTab data={data} isBanned={isBanned} onRoleChange={handleRoleChange}
                            onBan={() => act(() => banUser(userId), `⛔ Cấm vĩnh viễn "${data.user.name}"?`)}
                            onUnban={() => act(() => unbanUser(userId), `✅ Mở khóa "${data.user.name}"?`)}
                            onReset={() => act(() => resetCancelCount(userId), `🔄 Đặt lại số lần hủy của "${data.user.name}"?`)}
                            busy={busy} />
                    ) : (
                        <OrdersTab orders={orders} />
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoTab({ data, isBanned, onRoleChange, onBan, onUnban, onReset, busy }) {
    if (!data) return null;
    const { user, stats } = data;
    return (
        <div>
            {/* Trạng thái ban */}
            {isBanned && (
                <div style={{
                    background: '#fdedec', border: '1px solid #e74c3c', borderRadius: 10,
                    padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#c0392b'
                }}>
                    <span style={{ fontSize: 20 }}>🚫</span>
                    <div>
                        <strong>Tài khoản bị khóa vĩnh viễn</strong>
                        <div style={{ fontSize: 12, marginTop: 2 }}>Tài khoản này không thể đăng nhập hoặc đặt hàng</div>
                    </div>
                </div>
            )}

            {/* Thông tin cơ bản */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#888', letterSpacing: '0.5px', marginBottom: 10, textTransform: 'uppercase' }}>
                    Thông tin tài khoản
                </div>
                <div style={{ background: '#f8f9fa', borderRadius: 10, overflow: 'hidden' }}>
                    {[
                        ['ID', `#${user.id}`],
                        ['Họ tên', user.name],
                        ['Email', user.email],
                        ['Ngày tham gia', new Date(user.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })],
                    ].map(([label, value]) => (
                        <div key={label} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '11px 16px', borderBottom: '1px solid #eee'
                        }}>
                            <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
                            <span style={{ fontSize: 13, fontWeight: '500', color: '#1a1a2e' }}>{value}</span>
                        </div>
                    ))}
                    {/* Vai trò - có select */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #eee' }}>
                        <span style={{ fontSize: 13, color: '#666' }}>Vai trò</span>
                        <select
                            value={user.role}
                            disabled={busy}
                            onChange={(e) => onRoleChange(e.target.value)}
                            style={{
                                padding: '4px 10px', borderRadius: 6, fontSize: 12, border: '1px solid #ddd',
                                background: user.role === 'admin' ? '#ebf5fb' : '#f5f5f5',
                                color: user.role === 'admin' ? '#2980b9' : '#555',
                                cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            <option value="customer">👤 Khách hàng</option>
                            <option value="admin">👑 Admin</option>
                        </select>
                    </div>
                    {/* Số lần hủy đơn */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px' }}>
                        <span style={{ fontSize: 13, color: '#666' }}>Số lần hủy đơn</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                                padding: '3px 10px', borderRadius: 20, fontSize: 13, fontWeight: 'bold',
                                background: user.cancel_count === 0 ? '#d4edda' : user.cancel_count >= 2 ? '#fdedec' : '#fff3cd',
                                color: user.cancel_count === 0 ? '#155724' : user.cancel_count >= 2 ? '#c0392b' : '#7d4e00',
                            }}>{user.cancel_count} lần</span>
                            {user.cancel_count > 0 && user.role !== 'admin' && (
                                <button onClick={onReset} disabled={busy} style={{
                                    padding: '3px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                                    border: '1px solid #f39c12', background: '#fff3cd', color: '#7d4e00',
                                    fontWeight: 'bold', opacity: busy ? 0.6 : 1
                                }}>🔄 Reset</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thống kê đơn hàng */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#888', letterSpacing: '0.5px', marginBottom: 10, textTransform: 'uppercase' }}>
                    Thống kê đơn hàng
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {[
                        { label: 'Tổng đơn', value: stats?.total_orders || 0, icon: '📦', color: '#3498db', bg: '#ebf5fb' },
                        { label: 'Đã giao', value: stats?.delivered_orders || 0, icon: '✅', color: '#27ae60', bg: '#eafaf1' },
                        { label: 'Đã hủy', value: stats?.cancelled_orders || 0, icon: '❌', color: '#e74c3c', bg: '#fdedec' },
                        { label: 'Tổng chi tiêu', value: `${Number(stats?.total_spent || 0).toLocaleString('vi-VN')}₫`, icon: '💰', color: '#8e44ad', bg: '#f5eef8' },
                    ].map((s) => (
                        <div key={s.label} style={{
                            background: s.bg, borderRadius: 10, padding: '14px 16px',
                            display: 'flex', alignItems: 'center', gap: 12
                        }}>
                            <span style={{ fontSize: 22 }}>{s.icon}</span>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 'bold', color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hành động */}
            {user.role !== 'admin' && (
                <div>
                    <div style={{ fontSize: 12, fontWeight: 'bold', color: '#888', letterSpacing: '0.5px', marginBottom: 10, textTransform: 'uppercase' }}>
                        Thao tác
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {isBanned ? (
                            <button onClick={onUnban} disabled={busy} style={{
                                flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid #27ae60',
                                background: '#eafaf1', color: '#155724', fontWeight: 'bold', cursor: 'pointer',
                                fontSize: 13, opacity: busy ? 0.6 : 1
                            }}>✅ Mở khóa tài khoản</button>
                        ) : (
                            <button onClick={onBan} disabled={busy} style={{
                                flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid #e74c3c',
                                background: '#fdedec', color: '#c0392b', fontWeight: 'bold', cursor: 'pointer',
                                fontSize: 13, opacity: busy ? 0.6 : 1
                            }}>⛔ Cấm vĩnh viễn</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function OrdersTab({ orders }) {
    if (!orders.length) return (
        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <div>Chưa có đơn hàng nào</div>
        </div>
    );
    return (
        <div>
            {orders.map((o) => (
                <div key={o.id} style={{
                    background: '#f8f9fa', borderRadius: 10, padding: '14px 16px',
                    marginBottom: 10, border: '1px solid #eee'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 14 }}>Đơn #{o.id}</span>
                        <span style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 'bold',
                            color: STATUS_COLOR[o.status] || '#333',
                            background: `${STATUS_COLOR[o.status]}18` || '#f5f5f5',
                            border: `1px solid ${STATUS_COLOR[o.status]}44` || '#ddd'
                        }}>{STATUS_MAP[o.status] || o.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#888' }}>
                            {new Date(o.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        <span style={{ fontWeight: 'bold', color: '#e74c3c', fontSize: 14 }}>
                            {Number(o.total_amount).toLocaleString('vi-VN')}₫
                        </span>
                    </div>
                    {o.status === 'cancelled' && o.cancel_reason && (
                        <div style={{ marginTop: 6, fontSize: 12, color: '#c0392b', background: '#fdedec', padding: '4px 10px', borderRadius: 6 }}>
                            Lý do hủy: {o.cancel_reason}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─────── Trang chính ─────── */
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
        if (!window.confirm(`🗑️ Xóa vĩnh viễn tài khoản "${name}"?\n\nHành động này không thể hoàn tác!`)) return;
        setDeleting(id);
        try {
            await deleteUser(id);
            showToast(`✅ Đã xóa tài khoản "${name}"`);
            await load();
        } catch (e) {
            alert(e.response?.data?.message || 'Lỗi xóa user');
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
    const bannedCount = users.filter((u) => u.is_banned === 1 || u.is_banned === true).length;

    return (
        <div style={{ padding: '28px 40px', minHeight: '100vh', background: '#f8f9fa' }}>

            {/* Toast thông báo */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 20, right: 20, background: '#2ecc71', color: '#fff',
                    padding: '12px 20px', borderRadius: 10, fontWeight: 'bold', fontSize: 14,
                    boxShadow: '0 4px 16px rgba(46,204,113,0.4)', zIndex: 2000,
                    animation: 'fadeIn 0.2s ease'
                }}>{toast}</div>
            )}

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                    👥 Quản lý người dùng
                </h2>
                <p style={{ color: '#666', marginTop: 6, fontSize: 14 }}>
                    Xem, chỉnh sửa vai trò và quản lý tất cả tài khoản người dùng
                </p>
            </div>

            {/* Thống kê */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                    { label: 'Tổng người dùng', value: users.length, icon: '👥', color: '#3498db', bg: '#ebf5fb' },
                    { label: 'Khách hàng', value: totalCustomers, icon: '🛍️', color: '#27ae60', bg: '#eafaf1' },
                    { label: 'Quản trị viên', value: totalAdmins, icon: '👑', color: '#8e44ad', bg: '#f5eef8' },
                    { label: 'Bị khóa', value: bannedCount, icon: '🚫', color: '#e74c3c', bg: '#fdedec' },
                ].map((s) => (
                    <div key={s.label} style={{
                        background: '#fff', borderRadius: 12, padding: '18px 20px',
                        border: `1px solid ${s.bg}`, display: 'flex', alignItems: 'center', gap: 14,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 10, background: s.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                        }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thanh công cụ */}
            <div style={{
                background: '#fff', borderRadius: 12, padding: '14px 18px',
                marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center',
                flexWrap: 'wrap', border: '1px solid #eee'
            }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm theo tên, email hoặc ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 8,
                        border: '1px solid #ddd', fontSize: 13, outline: 'none'
                    }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    {[
                        { key: 'all', label: '📋 Tất cả' },
                        { key: 'customer', label: '🛍️ Khách hàng' },
                        { key: 'admin', label: '👑 Admin' },
                    ].map((f) => (
                        <button key={f.key} onClick={() => setRoleFilter(f.key)} style={{
                            padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                            border: '1px solid',
                            borderColor: roleFilter === f.key ? '#3498db' : '#ddd',
                            background: roleFilter === f.key ? '#ebf5fb' : '#fff',
                            color: roleFilter === f.key ? '#2980b9' : '#666',
                            fontWeight: roleFilter === f.key ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}>{f.label}</button>
                    ))}
                </div>
                <button onClick={load} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                    border: '1px solid #ddd', background: '#f8f9fa', color: '#555'
                }}>🔄 Làm mới</button>
            </div>

            {/* Bảng */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>⏳ Đang tải...</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#aaa', background: '#fff', borderRadius: 12 }}>
                    <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
                    <div>Không tìm thấy người dùng nào</div>
                </div>
            ) : (
                <div style={{
                    background: '#fff', borderRadius: 12, overflow: 'hidden',
                    border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
                                {['', 'Người dùng', 'Vai trò', 'Đơn hủy', 'Trạng thái', 'Tham gia', 'Thao tác'].map((h) => (
                                    <th key={h} style={{
                                        padding: '12px 14px', textAlign: 'left',
                                        color: '#bbb', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, idx) => {
                                const isBanned = u.is_banned === 1 || u.is_banned === true;
                                return (
                                    <tr key={u.id} style={{
                                        borderBottom: '1px solid #f0f0f0',
                                        background: isBanned ? '#fff8f8' : idx % 2 === 0 ? '#fff' : '#fafcff',
                                        transition: 'background 0.15s'
                                    }}>
                                        {/* Avatar */}
                                        <td style={{ padding: '12px 14px', width: 44 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                                background: isBanned ? '#e74c3c' : u.role === 'admin' ? '#8e44ad' : '#3498db',
                                                color: '#fff', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontWeight: 'bold', fontSize: 15
                                            }}>
                                                {u.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                        </td>

                                        {/* Tên / Email */}
                                        <td style={{ padding: '12px 14px' }}>
                                            <div style={{
                                                fontWeight: 600, color: isBanned ? '#aaa' : '#1a1a2e',
                                                textDecoration: isBanned ? 'line-through' : 'none', fontSize: 13
                                            }}>{u.name}</div>
                                            <div style={{ fontSize: 12, color: '#999', marginTop: 1 }}>{u.email}</div>
                                        </td>

                                        {/* Vai trò */}
                                        <td style={{ padding: '12px 14px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                background: u.role === 'admin' ? '#f5eef8' : '#eafaf1',
                                                color: u.role === 'admin' ? '#8e44ad' : '#27ae60',
                                                border: `1px solid ${u.role === 'admin' ? '#d2b4de' : '#a9dfbf'}`
                                            }}>
                                                {u.role === 'admin' ? '👑 Admin' : '🛍️ Khách hàng'}
                                            </span>
                                        </td>

                                        {/* Đơn hủy */}
                                        <td style={{ padding: '12px 14px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                background: u.cancel_count === 0 ? '#f5f5f5' : u.cancel_count >= 2 ? '#fdedec' : '#fff3cd',
                                                color: u.cancel_count === 0 ? '#aaa' : u.cancel_count >= 2 ? '#c0392b' : '#7d4e00',
                                            }}>
                                                {u.cancel_count === 0 ? '—' : `${u.cancel_count} lần`}
                                            </span>
                                        </td>

                                        {/* Trạng thái */}
                                        <td style={{ padding: '12px 14px' }}>
                                            {isBanned ? (
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                    background: '#fdedec', color: '#c0392b', border: '1px solid #e74c3c'
                                                }}>🚫 Bị khóa</span>
                                            ) : (
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                    background: '#eafaf1', color: '#27ae60', border: '1px solid #27ae60'
                                                }}>✅ Hoạt động</span>
                                            )}
                                        </td>

                                        {/* Ngày tham gia */}
                                        <td style={{ padding: '12px 14px', color: '#888', fontSize: 12 }}>
                                            {new Date(u.created_at).toLocaleDateString('vi-VN')}
                                        </td>

                                        {/* Thao tác */}
                                        <td style={{ padding: '12px 14px' }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button
                                                    onClick={() => setSelectedId(u.id)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                                                        border: '1px solid #3498db', background: '#ebf5fb', color: '#2980b9',
                                                        fontWeight: 'bold'
                                                    }}
                                                >👁️ Chi tiết</button>
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(u.id, u.name)}
                                                        disabled={deleting === u.id}
                                                        style={{
                                                            padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                                                            border: '1px solid #e74c3c', background: '#fdedec', color: '#c0392b',
                                                            fontWeight: 'bold', opacity: deleting === u.id ? 0.6 : 1
                                                        }}
                                                    >{deleting === u.id ? '...' : '🗑️'}</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div style={{ padding: '10px 16px', borderTop: '1px solid #eee', fontSize: 12, color: '#888', background: '#fafafa' }}>
                        Hiển thị {filtered.length} / {users.length} người dùng
                    </div>
                </div>
            )}

            {/* Modal chi tiết */}
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
