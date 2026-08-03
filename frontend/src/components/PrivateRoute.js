import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
export default PrivateRoute;
