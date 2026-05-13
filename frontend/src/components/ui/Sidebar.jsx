import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ usuario }) => {
  const { logout } = useAuth();
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light border-end" style={{ width: '280px', minHeight: '100vh' }}>
      
      {/* Zona del Perfil del Cliente */}
      <div className="text-center mb-3 mt-2">
        <h5 className="fw-bold">{usuario ? usuario.nombre : "Cargando perfil..."}</h5>
        <span className="badge bg-primary">Cliente</span>
      </div>
      
      <hr />
      
      {/* Menú de Navegación */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          {/* Usamos nav-link active para que se vea seleccionado */}
          <Link to="/dashboard-cliente" className="nav-link active">
            📊 Mi Resumen
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/perfil" className="nav-link link-dark">
            ✏️ Actualizar mis Datos
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/mis-reservas" className="nav-link link-dark">
            🕒 Mis Horas y Reservas
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/buscar" className="nav-link link-dark">
            🔍 Explorar Plataforma
          </Link>
        </li>
      </ul>
      
      <hr />
      
      {/* Botón de salida */}
      <div>
        <button 
          className="btn btn-outline-danger w-100"
          onClick={logout}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};