import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const ClientLayout = () => {
  const { isAuthenticated, user } = useAuth();

  // 1. Revisamos si está nuestra sesión de mentira activada desde el Navbar
  const sesionSimulada = localStorage.getItem('sesion_activa') === 'si';

  // 2. Si NO hay sesión real Y TAMPOCO hay sesión simulada, entonces sí lo echamos
  if (!isAuthenticated && !sesionSimulada) {
    return <Navigate to="/" replace />;
  }

  // 3. Como la sesión simulada no tiene un 'user' real de la base de datos, 
  // le creamos uno de prueba para que el Sidebar no se rompa al buscar el nombre.
  const usuarioActivo = user || {
    nombre: 'Nicole',
    apellido: 'Chávez',
    rol: 'CLIENTE',
    iniciales: 'NC'
  };

  return (
    <div className="container-fluid p-0 d-flex">
      {/* Le pasamos el usuario (real o simulado) al Sidebar */}
      <Sidebar usuario={usuarioActivo} />

      <div className="w-100 bg-light" style={{ minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};