import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { label: 'Usuarios', icon: '👥', path: '/admin/usuarios' },
    { label: 'Prestadores', icon: '🔧', path: '/admin/prestadores' },
    { label: 'Servicios', icon: '⚙️', path: '/admin/servicios' },
    { label: 'Solicitudes', icon: '📋', path: '/admin/solicitudes' },
    { label: 'Reportes', icon: '📈', path: '/admin/reportes' },
    { label: 'Auditoría', icon: '📜', path: '/admin/auditoria' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className={isCollapsed ? 'hidden' : ''}>ServiGo Admin</h2>
        <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className={`menu-label ${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className={`user-info ${isCollapsed ? 'hidden' : ''}`}>
          <p className="user-name">Admin</p>
          <p className="user-role">Administrator</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          {isCollapsed ? '🚪' : 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;