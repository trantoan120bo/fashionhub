import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
export default AdminRoute;
