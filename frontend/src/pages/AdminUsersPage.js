import React, { useEffect, useState } from 'react';
import { getAllUsers, banUser, unbanUser, resetCancelCount } from '../api/userApi';

const BAN_THRESHOLD = 2; // Bị ban nếu hủy quá 2 lần

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

    const handleBan = async (id, name) => {
        if (!window.confirm(`⛔ Xác nhận cấm vĩnh viễn tài khoản "${name}"?\n\nTài khoản này sẽ không thể đặt hàng nữa.`)) return;
        setActionLoading(id + '-ban');
        try {
            await banUser(id);
            await load();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnban = async (id, name) => {
        if (!window.confirm(`✅ Mở khóa tài khoản "${name}"?\n\nSố lần hủy đơn sẽ được đặt lại về 0.`)) return;
        setActionLoading(id + '-unban');
        try {
            await unbanUser(id);
            await load();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReset = async (id, name) => {
        if (!window.confirm(`🔄 Đặt lại số lần hủy đơn của "${name}" về 0?`)) return;
        setActionLoading(id + '-reset');
        try {
            await resetCancelCount(id);
            await load();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        if (!matchSearch) return false;
        if (filter === 'banned') return u.is_banned === 1 || u.is_banned === true;
        if (filter === 'suspicious') return (u.cancel_count > 0) && !(u.is_banned === 1 || u.is_banned === true);
        return true;
    });

    const totalUsers = users.length;
    const bannedUsers = users.filter((u) => u.is_banned === 1 || u.is_banned === true).length;
    const suspiciousUsers = users.filter((u) => u.cancel_count > 0 && !(u.is_banned === 1 || u.is_banned === true)).length;

    const getRiskLevel = (cancelCount, isBanned) => {
        if (isBanned === 1 || isBanned === true) return { label: '⛔ Đã bị cấm', color: '#fff', bg: '#c0392b', border: '#a93226' };
        if (cancelCount >= BAN_THRESHOLD) return { label: '🔴 Nguy hiểm', color: '#fff', bg: '#e74c3c', border: '#c0392b' };
        if (cancelCount === 1) return { label: '🟡 Cảnh báo', color: '#7d4e00', bg: '#fff3cd', border: '#ffc107' };
        return { label: '🟢 Bình thường', color: '#155724', bg: '#d4edda', border: '#28a745' };
    };

    return (
        <div style={{ padding: '28px 40px', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                    🚫 Quản lý bom hàng
                </h2>
                <p style={{ color: '#666', marginTop: 6, fontSize: 14 }}>
                    Theo dõi và xử lý tài khoản có hành vi hủy đơn hàng bất thường
                </p>
            </div>

            {/* Thống kê tổng quan */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                    { label: 'Tổng người dùng', value: totalUsers, icon: '👥', color: '#3498db', bg: '#ebf5fb' },
                    { label: 'Nghi ngờ bom hàng', value: suspiciousUsers, icon: '⚠️', color: '#e67e22', bg: '#fef9e7' },
                    { label: 'Đã bị cấm', value: bannedUsers, icon: '🚫', color: '#e74c3c', bg: '#fdedec' },
                ].map((stat) => (
                    <div key={stat.label} style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: '20px 24px',
                        border: `1px solid ${stat.bg}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: 12,
                            background: stat.bg, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 24
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cảnh báo chính sách */}
            <div style={{
                background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                border: '1px solid #ffc107',
                borderRadius: 10,
                padding: '14px 20px',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                color: '#7d4e00'
            }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <div>
                    <strong>Chính sách bom hàng:</strong> Tài khoản sẽ tự động bị cấm vĩnh viễn sau khi hủy đơn hàng quá{' '}
                    <strong>{BAN_THRESHOLD} lần</strong>. Admin có thể thủ công ban/mở khóa hoặc reset số lần hủy.
                </div>
            </div>

            {/* Bộ lọc & Tìm kiếm */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', border: '1px solid #eee' }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm theo tên hoặc email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: 220, padding: '8px 14px', borderRadius: 8,
                        border: '1px solid #ddd', fontSize: 13, outline: 'none'
                    }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    {[
                        { key: 'all', label: '📋 Tất cả' },
                        { key: 'suspicious', label: '⚠️ Nghi ngờ' },
                        { key: 'banned', label: '🚫 Bị cấm' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            style={{
                                padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                                border: '1px solid',
                                borderColor: filter === tab.key ? '#3498db' : '#ddd',
                                background: filter === tab.key ? '#ebf5fb' : '#fff',
                                color: filter === tab.key ? '#2980b9' : '#555',
                                fontWeight: filter === tab.key ? 'bold' : 'normal',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button onClick={load} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    border: '1px solid #ddd', background: '#f8f9fa', color: '#555'
                }}>
                    🔄 Làm mới
                </button>
            </div>

            {/* Bảng danh sách */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>⏳ Đang tải...</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#aaa', background: '#fff', borderRadius: 12 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                    <div style={{ fontSize: 16 }}>Không có người dùng nào phù hợp</div>
                </div>
            ) : (
                <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
                                {['ID', 'Tên / Email', 'Vai trò', 'Số lần hủy', 'Trạng thái', 'Ngày tham gia', 'Thao tác'].map((h) => (
                                    <th key={h} style={{
                                        padding: '12px 16px', textAlign: 'left',
                                        color: '#ccc', fontWeight: '600', fontSize: 12, letterSpacing: '0.5px'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, idx) => {
                                const isBanned = u.is_banned === 1 || u.is_banned === true;
                                const risk = getRiskLevel(u.cancel_count, u.is_banned);
                                return (
                                    <tr key={u.id} style={{
                                        borderBottom: '1px solid #f0f0f0',
                                        background: isBanned ? '#fff8f8' : idx % 2 === 0 ? '#fff' : '#fafafa',
                                        transition: 'background 0.15s'
                                    }}>
                                        <td style={{ padding: '12px 16px', color: '#888', fontSize: 12 }}>#{u.id}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ fontWeight: 600, color: isBanned ? '#999' : '#1a1a2e', textDecoration: isBanned ? 'line-through' : 'none' }}>
                                                {u.name}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{u.email}</div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                background: u.role === 'admin' ? '#e8f4fd' : '#f5f5f5',
                                                color: u.role === 'admin' ? '#2980b9' : '#666',
                                                border: `1px solid ${u.role === 'admin' ? '#bee3f8' : '#ddd'}`
                                            }}>
                                                {u.role === 'admin' ? '👑 Admin' : '👤 Khách'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: 8,
                                                    background: u.cancel_count === 0 ? '#d4edda' : u.cancel_count >= BAN_THRESHOLD ? '#fdedec' : '#fff3cd',
                                                    color: u.cancel_count === 0 ? '#155724' : u.cancel_count >= BAN_THRESHOLD ? '#c0392b' : '#7d4e00',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 'bold', fontSize: 16
                                                }}>
                                                    {u.cancel_count}
                                                </div>
                                                <span style={{ fontSize: 12, color: '#888' }}>lần hủy</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                                                color: risk.color, background: risk.bg, border: `1px solid ${risk.border}`
                                            }}>
                                                {risk.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#888', fontSize: 12 }}>
                                            {new Date(u.created_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {u.role !== 'admin' && (
                                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                    {isBanned ? (
                                                        <button
                                                            onClick={() => handleUnban(u.id, u.name)}
                                                            disabled={actionLoading === u.id + '-unban'}
                                                            style={{
                                                                padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                                                                border: '1px solid #27ae60', background: '#d4edda', color: '#155724',
                                                                fontWeight: 'bold', whiteSpace: 'nowrap',
                                                                opacity: actionLoading === u.id + '-unban' ? 0.6 : 1
                                                            }}
                                                        >
                                                            {actionLoading === u.id + '-unban' ? '...' : '✅ Mở khóa'}
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleBan(u.id, u.name)}
                                                                disabled={actionLoading === u.id + '-ban'}
                                                                style={{
                                                                    padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                                                                    border: '1px solid #e74c3c', background: '#fdedec', color: '#c0392b',
                                                                    fontWeight: 'bold', whiteSpace: 'nowrap',
                                                                    opacity: actionLoading === u.id + '-ban' ? 0.6 : 1
                                                                }}
                                                            >
                                                                {actionLoading === u.id + '-ban' ? '...' : '⛔ Cấm vĩnh viễn'}
                                                            </button>
                                                            {u.cancel_count > 0 && (
                                                                <button
                                                                    onClick={() => handleReset(u.id, u.name)}
                                                                    disabled={actionLoading === u.id + '-reset'}
                                                                    style={{
                                                                        padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                                                                        border: '1px solid #f39c12', background: '#fff3cd', color: '#7d4e00',
                                                                        fontWeight: 'bold', whiteSpace: 'nowrap',
                                                                        opacity: actionLoading === u.id + '-reset' ? 0.6 : 1
                                                                    }}
                                                                >
                                                                    {actionLoading === u.id + '-reset' ? '...' : '🔄 Reset'}
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {u.role === 'admin' && (
                                                <span style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic' }}>Không thể xử lý</span>
                                            )}
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
        </div>
    );
}

export default AdminUsersPage;
