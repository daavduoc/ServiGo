import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  // Simulación del usuario actual
  const usuario = {
    nombre: 'Nicole Chávez',
    rol: 'Cliente'
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end" style={{ width: '260px', minHeight: '100vh' }}>
      
      {/* Tarjeta de Perfil del Usuario en el Menú */}
      <div className="text-center py-4 mb-3 bg-light rounded-3 shadow-sm border border-success border-opacity-25">
        <div className="fs-1 mb-2">👤</div>
        <h5 className="fw-bold text-dark m-0">{usuario.nombre}</h5>
        
        {/* CAMBIO AQUÍ: Tag 'Cliente' ahora es Verde (bg-success) */}
        <span className="badge bg-success px-3 py-1 rounded-pill mt-2 small tracking-wide">
          {usuario.rol}
        </span>
      </div>

      <hr className="text-muted mb-3" />

      {/* Menú de Navegación Dinámico */}
      <ul className="nav nav-pills flex-column mb-auto gap-2">
        
        <li>
          <NavLink 
            to="/dashboard-cliente" 
            className={({ isActive }) => 
              `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
                // CAMBIO AQUÍ: Pestaña activa ahora es Verde (bg-success)
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
                // CAMBIO AQUÍ: Verde (bg-success)
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
                // CAMBIO AQUÍ: Verde (bg-success)
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
                // CAMBIO AQUÍ: Verde (bg-success)
                isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
              }`
            }
          >
            <span>🔍</span> Explorar Plataforma
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/soporte" 
            className={({ isActive }) => 
              `nav-link text-start py-2.5 px-3 rounded-3 fw-medium d-flex align-items-center gap-3 transition-all ${
                // CAMBIO AQUÍ: Verde (bg-success)
                isActive ? 'bg-success text-white shadow-sm' : 'text-secondary hover-sidebar-green'
              }`
            }
          >
            <span>🛠️</span> Centro de Ayuda y Soporte
          </NavLink>
        </li>

      </ul>

      {/* Estilos CSS rápidos incrustados para el efecto Hover */}
      <style>{`
        /* CAMBIO AQUÍ: Color del hover ahora es un texto verde (#198754, color success de Bootstrap) */
        .hover-sidebar-green:hover {
          background-color: #f0fff4 !important; /* Un fondo verde muy muy claro */
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