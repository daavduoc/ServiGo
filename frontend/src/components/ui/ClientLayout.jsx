import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const ClientLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container-fluid p-0 d-flex">
      <Sidebar usuario={user} />

      <div className="w-100 bg-light" style={{ minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};