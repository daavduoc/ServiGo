import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdminUser } from '../../utils/userDisplay';
import AdminSidebar from './AdminSidebar';
import '../../assets/css/client-panel.css';
import '../../assets/css/admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user || !isAdminUser(user)) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading || !isAuthenticated || !user || !isAdminUser(user)) {
    return null;
  }

  return (
    <div className="container-fluid p-0 d-flex admin-panel-wrap">
      <AdminSidebar />
      <div className="w-100 bg-light client-panel-main admin-panel-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;