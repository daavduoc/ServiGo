import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDisplayName, getRolLabel } from '../../utils/userDisplay';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
  { to: '/admin/usuarios', icon: 'bi-people', label: 'Usuarios' },
  { to: '/admin/prestadores', icon: 'bi-person-badge', label: 'Prestadores' },
  { to: '/admin/servicios', icon: 'bi-gear', label: 'Servicios' },
  { to: '/admin/solicitudes', icon: 'bi-clipboard-check', label: 'Solicitudes' },
  { to: '/admin/reportes', icon: 'bi-bar-chart-line', label: 'Reportes' },
  { to: '/admin/auditoria', icon: 'bi-journal-text', label: 'Auditoría' },
];

const navLinkClass = ({ isActive }) =>
  `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
    isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
  }`;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const nombreVisible = getDisplayName(user);
  const rolVisible = getRolLabel(user?.rol);
  const fotoUrl = user?.urlFotoCloud;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className="client-sidebar d-flex flex-column flex-shrink-0 p-3 bg-white border-end"
      style={{ width: '260px', minHeight: '100vh' }}
    >
      <div className="text-center py-4 mb-3 bg-light rounded-3 shadow-sm border border-success border-opacity-25">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt=""
            className="rounded-circle mb-2 object-fit-cover"
            style={{ width: 64, height: 64 }}
          />
        ) : (
          <i
            className="bi bi-shield-lock fs-1 text-secondary mb-2 d-block"
            aria-hidden="true"
          />
        )}
        <h5 className="fw-bold text-dark m-0">{nombreVisible}</h5>
        <span className="badge bg-success px-3 py-1 rounded-pill mt-2 small tracking-wide">
          {rolVisible}
        </span>
      </div>

      <hr className="text-muted mb-3" />

      <ul className="nav nav-pills flex-column mb-auto gap-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={navLinkClass}>
              <i className={`bi ${item.icon} client-sidebar-nav__icon`} aria-hidden="true" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-outline-danger btn-sm fw-bold w-100 mt-3"
        onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />
        Cerrar sesión
      </button>
    </div>
  );
};

export default AdminSidebar;
