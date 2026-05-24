import React from 'react';
import { NavLink } from 'react-router-dom';
import { getDisplayName, getRolLabel } from '../../utils/userDisplay';

const NAV_ITEMS = [
  { to: '/dashboard-prestador', icon: 'bi-grid-1x2', label: 'Mi Resumen' },
  { to: '/prestador/solicitudes', icon: 'bi-inbox', label: 'Nuevas Solicitudes' },
  // generar servicio
  { to: '/prestador/ingresar-servicio', icon: 'bi-plus-circle', label: 'Ingrese su servicio' },
  { to: '/prestador/mis-servicios', icon: 'bi-calendar-check', label: 'Mis Trabajos' },
  { to: '/prestador/perfil', icon: 'bi-person-vcard', label: 'Mi Perfil Profesional' },
  { to: '/prestador/soporte', icon: 'bi-headset', label: 'Centro de Ayuda' },

];

const navLinkClass = ({ isActive }) =>
  `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
    isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
  }`;

export const ProviderSidebar = ({ usuario }) => {
  const nombreVisible = getDisplayName(usuario);
  const rolVisible = getRolLabel(usuario?.rol);
  const fotoUrl = usuario?.urlFotoCloud;

  return (
    <div
      className="client-sidebar d-flex flex-column flex-shrink-0 p-3 bg-white border-end"
      style={{ width: '260px', minHeight: '100%' }}
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
          <i className="bi bi-person-circle fs-1 text-secondary mb-2 d-block" aria-hidden="true" />
        )}
        <h5 className="fw-semibold m-0">{nombreVisible}</h5>
        <span className="badge bg-success text-white px-3 py-1 rounded-pill mt-2 small tracking-wide">
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
    </div>
  );
};
