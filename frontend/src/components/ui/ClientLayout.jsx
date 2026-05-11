import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const ClientLayout = () => {
  // Simulamos que el usuario está logueado en toda la plataforma
  const [usuario] = useState({
    nombre: "Nicole Chávez",
    correo: "nicole.chavez@ejemplo.cl",
    comuna: "Puente Alto"
  });

  return (
    <div className="container-fluid p-0 d-flex">
      {/* El Sidebar queda fijo a la izquierda para siempre */}
      <Sidebar usuario={usuario} />

      {/* El contenido de la derecha cambiará según donde navegue el cliente */}
      <div className="w-100 bg-light" style={{ minHeight: '100vh' }}>
        <Outlet /> 
      </div>
    </div>
  );
};