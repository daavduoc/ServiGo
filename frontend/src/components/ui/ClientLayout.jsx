import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { isAdminUser, isPrestadorUser } from '../../utils/userDisplay';
import '../../assets/css/client-panel.css';

export const ClientLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (isAdminUser(user)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isPrestadorUser(user)) {
    return <Navigate to="/dashboard-prestador" replace />;
  }

  return (
    <div className="container-fluid p-0 d-flex">
      <Sidebar usuario={user} />

      <div className="w-100 bg-light client-panel-main client-panel-content">
        <Outlet />
      </div>
    </div>
  );
};