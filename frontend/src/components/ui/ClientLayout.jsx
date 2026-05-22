import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { isAdminUser } from '../../utils/userDisplay';

// RUTAS CORREGIDAS SEGÚN TU ÁRBOL DE CARPETAS REAL
import Navbar from '../layout/Navbar'; 
import Footer from '../layout/Footer'; 

import '../../assets/css/client-panel.css';

export const ClientLayout = () => {
  const { isAuthenticated, user } = useAuth();

  // --- CONTROL DE ACCESO ---
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (isAdminUser(user)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // MODIFICACIÓN: Se remueve la redirección imperativa del prestador para que
  // pueda renderizar este layout con su Header, Sidebar y Footer al ir a su perfil.

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* NAVBAR SUPERIOR GLOBAL */}
      <Navbar />

      {/* CUERPO CENTRAL (SIDEBAR + CONTENIDO DINÁMICO) */}
      <div className="d-flex flex-grow-1" style={{ paddingTop: '75px' }}>
        {/* Barra lateral fija a la izquierda (una sola vez) */}
        <Sidebar usuario={user} />

        {/* El contenido de la vista (Dashboard sin duplicados) se inyecta aquí */}
        <main className="flex-grow-1 bg-light client-panel-main client-panel-content p-4">
          <Outlet />
        </main>
      </div>

      {/* FOOTER INFERIOR GLOBAL */}
      <Footer />
    </div>
  );
};