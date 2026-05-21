import React from 'react';
import { NavLink } from 'react-router-dom';
import { getDisplayName, getRolLabel } from '../../utils/userDisplay';

export const Sidebar = ({ usuario }) => {
  const nombreVisible = getDisplayName(usuario);
  const rolVisible = getRolLabel(usuario?.rol);
  const fotoUrl = usuario?.urlFotoCloud;

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end" style={{ width: '260px', minHeight: '100vh' }}>

      <div className="text-center py-4 mb-3 bg-light rounded-3 shadow-sm border border-success border-opacity-25">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt=""
            className="rounded-circle mb-2 object-fit-cover"
            style={{ width: 64, height: 64 }}
          />
        ) : (
          <div className="fs-1 mb-2" aria-hidden="true">👤</div>
        )}
        <h5 className="fw-bold text-dark m-0">{nombreVisible}</h5>
        <span className="badge bg-success px-3 py-1 rounded-pill mt-2 small tracking-wide">
          {rolVisible}
        </span>
      </div>

      <hr className="text-muted mb-3" />

      <ul className="nav nav-pills flex-column mb-auto gap-2">

        <li>
          <NavLink
            to="/dashboard-cliente"
            className={({ isActive }) =>
              `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
                isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
              }`
            }
          >
            <span>📊</span> Mi Resumen
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
                isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
              }`
            }
          >
            <span>✏️</span> Actualizar mis Datos
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/mis-reservas"
            className={({ isActive }) =>
              `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
                isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
              }`
            }
          >
            <span>📅</span> Mis Horas y Reservas
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/buscar"
            className={({ isActive }) =>
              `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
                isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
              }`
            }
          >
            <span>🔍</span> Buscar Especialistas
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/soporte"
            className={({ isActive }) =>
              `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
                isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
              }`
            }
          >
            <span>🛠️</span> Centro de Ayuda y Soporte
          </NavLink>
        </li>

      </ul>

      <style>{`
        .hover-sidebar-green:hover {
          background-color: #f0fff4 !important;
          color: #198754 !important;
          transform: translateX(4px);
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};
