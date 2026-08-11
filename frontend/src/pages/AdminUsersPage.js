import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserStatus } from '../api/userApi';

const STATUS_OPTIONS = [
    { value: 'normal', label: '🟢 Bình thường', color: '#155724', bg: '#d4edda', border: '#28a745' },
    { value: 'suspicious', label: '🟡 Nghi ngờ bom hàng', color: '#7d4e00', bg: '#fff3cd', border: '#ffc107' },
    { value: 'banned', label: '🔴 Bị cấm vĩnh viễn', color: '#fff', bg: '#c0392b', border: '#a93226' },
];

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' | 'suspicious' | 'banned'
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data.users || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleStatusChange = async (userId, userName, newStatus) => {
        const statusLabel = STATUS_OPTIONS.find(s => s.value === newStatus)?.label || newStatus;
        if (!window.confirm(`Xác nhận chuyển trạng thái tài khoản "${userName}" thành [${statusLabel}]?`)) return;

        setActionLoading(userId);
        try {
            await updateUserStatus(userId, newStatus);
            await load();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
            setActionLoading(null);
        }
    };

    const getUserStatus = (u) => {
        if (u.is_banned === 1 || u.is_banned === true) return 'banned';
        if (u.cancel_count > 0) return 'suspicious';
        return 'normal';
    };

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        if (!matchSearch) return false;

        const st = getUserStatus(u);
        if (filter === 'banned') return st === 'banned';
        if (filter === 'suspicious') return st === 'suspicious';
        return true;
    });

    const totalUsers = users.length;
    const bannedUsers = users.filter((u) => u.is_banned === 1 || u.is_banned === true).length;
    const suspiciousUsers = users.filter((u) => u.cancel_count > 0 && !(u.is_banned === 1 || u.is_banned === true)).length;

    return (
        <div style={{ padding: '30px 40px', minHeight: '100vh', background: '#f8f9fa', maxWidth: 1400, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: '800', color: '#1a1a2e', margin: 0 }}>
                    🚫 Quản lý bom hàng & Không nhận hàng
                </h2>
                <p style={{ color: '#666', marginTop: 6, fontSize: 14 }}>
                    Theo dõi và điều chỉnh trạng thái tài khoản có hành vi không nhận hàng hoặc không thanh toán
                </p>
            </div>

            {/* Thống kê tổng quan */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Tổng số người dùng', value: totalUsers, icon: '👥', color: '#3498db', bg: '#ebf5fb' },
                    { label: 'Nghi ngờ bom / Không nhận', value: suspiciousUsers, icon: '⚠️', color: '#e67e22', bg: '#fef9e7' },
                    { label: 'Bị cấm vĩnh viễn', value: bannedUsers, icon: '🚫', color: '#c0392b', bg: '#fdedec' },
                ].map((stat) => (
                    <div key={stat.label} style={{
                        background: '#fff', borderRadius: 12, padding: '20px 24px',
                        border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{
                            width: 50, height: 50, borderRadius: 12,
                            background: stat.bg, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 24
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: '800', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cảnh báo chính sách mới */}
            <div style={{
                background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                border: '1px solid #ffc107', borderRadius: 10, padding: '16px 20px',
                marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
                fontSize: 14, color: '#7d4e00', boxShadow: '0 2px 8px rgba(255,193,7,0.2)'
            }}>
                <span style={{ fontSize: 24 }}>📋</span>
                <div style={{ lineHeight: 1.6 }}>
                    <strong>Chính sách bom hàng:</strong> Tài khoản có hành vi <strong>không nhận hàng</strong> hoặc <strong>không thanh toán</strong> khi giao hàng sẽ được chuyển trạng thái sang <strong>Nghi ngờ bom hàng</strong> hoặc <strong>Bị cấm vĩnh viễn</strong>. Admin có thể thay đổi trạng thái trực tiếp bằng bảng điều khiển bên dưới.
                </div>
            </div>

            {/* Bộ lọc & Tìm kiếm */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', border: '1px solid #eee' }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm theo tên hoặc email người dùng..."
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
                        { key: 'suspicious', label: '⚠️ Nghi ngờ bom hàng' },
                        { key: 'banned', label: '🚫 Bị cấm vĩnh viễn' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            style={{
                                padding: '8px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                                border: '1px solid',
                                borderColor: filter === tab.key ? '#000' : '#ddd',
                                background: filter === tab.key ? '#000' : '#fff',
                                color: filter === tab.key ? '#fff' : '#333',
                                fontWeight: filter === tab.key ? 'bold' : 'normal',
                                transition: 'all 0.2s'
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button onClick={load} style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    border: '1px solid #ccc', background: '#f8f9fa', color: '#333', fontWeight: 600
                }}>
                    🔄 Làm mới
                </button>
            </div>

            {/* Bảng danh sách xử lý bom hàng */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>⏳ Đang tải...</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#aaa', background: '#fff', borderRadius: 12 }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                    <div style={{ fontSize: 15 }}>Không có tài khoản nào phù hợp</div>
                </div>
            ) : (
                <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                                {['ID', 'Tên / Email', 'Vai trò', 'Trạng thái bom hàng', 'Ngày tham gia', 'Thay đổi trạng thái'].map((h) => (
                                    <th key={h} style={{
                                        padding: '14px 18px', textAlign: 'left',
                                        color: '#495057', fontWeight: 700, fontSize: 13
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => {
                                const currentStatus = getUserStatus(u);
                                const statusObj = STATUS_OPTIONS.find(s => s.value === currentStatus) || STATUS_OPTIONS[0];

                                return (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                                        <td style={{ padding: '14px 18px', color: '#555', fontWeight: 'bold' }}>#{u.id}</td>

                                        <td style={{ padding: '14px 18px' }}>
                                            <div style={{ fontWeight: 700, color: currentStatus === 'banned' ? '#c0392b' : '#1a1a2e', textDecoration: currentStatus === 'banned' ? 'line-through' : 'none' }}>
                                                {u.name}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#777', marginTop: 2 }}>{u.email}</div>
                                        </td>

                                        <td style={{ padding: '14px 18px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                background: u.role === 'admin' ? '#f5eef8' : '#f5f5f5',
                                                color: u.role === 'admin' ? '#8e44ad' : '#666',
                                                border: `1px solid ${u.role === 'admin' ? '#d2b4de' : '#ddd'}`
                                            }}>
                                                {u.role === 'admin' ? '👑 Admin' : '👤 Khách'}
                                            </span>
                                        </td>

                                        {/* Cột trạng thái */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <span style={{
                                                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                color: statusObj.color, background: statusObj.bg, border: `1.5px solid ${statusObj.border}`
                                            }}>
                                                {statusObj.label}
                                            </span>
                                        </td>

                                        <td style={{ padding: '14px 18px', color: '#666', fontSize: 13 }}>
                                            {new Date(u.created_at).toLocaleDateString('vi-VN')}
                                        </td>

                                        {/* Điều chỉnh trạng thái bom hàng */}
                                        <td style={{ padding: '14px 18px' }}>
                                            {u.role !== 'admin' ? (
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    <select
                                                        value={currentStatus}
                                                        disabled={actionLoading === u.id}
                                                        onChange={(e) => handleStatusChange(u.id, u.name, e.target.value)}
                                                        style={{
                                                            padding: '8px 12px', borderRadius: 6, fontSize: 12, fontWeight: 'bold',
                                                            border: '1.5px solid #ccc', background: '#fff', cursor: 'pointer',
                                                            color: '#000'
                                                        }}>
                                                        {STATUS_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {currentStatus !== 'banned' ? (
                                                        <button
                                                            onClick={() => handleStatusChange(u.id, u.name, 'banned')}
                                                            disabled={actionLoading === u.id}
                                                            style={{
                                                                padding: '7px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                                                                background: '#c0392b', color: '#fff', border: 'none',
                                                                fontWeight: 'bold', opacity: actionLoading === u.id ? 0.6 : 1
                                                            }}>
                                                            ⛔ Cấm vĩnh viễn
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleStatusChange(u.id, u.name, 'normal')}
                                                            disabled={actionLoading === u.id}
                                                            style={{
                                                                padding: '7px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                                                                background: '#27ae60', color: '#fff', border: 'none',
                                                                fontWeight: 'bold', opacity: actionLoading === u.id ? 0.6 : 1
                                                            }}>
                                                            ✅ Mở khóa
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic' }}>Tài khoản Admin</span>
                                            )}
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
        </div>
    );
}

export default AdminUsersPage;
