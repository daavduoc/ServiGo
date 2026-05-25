import React, { useEffect, useState } from 'react';
import { useAuth }         from '../../../context/AuthContext';
import { ProviderNavTabs } from '../../ui/ProviderNavTabs';

// Inicio seccion de importaciones de secciones
import { TrabajosTabla } from '../../../components/sections/provider-trabajos/TrabajosTabla';
// Fin seccion de importaciones de secciones

// conexión con el backend para obtener los trabajos del prestador autenticado
import { getMisTrabajosPrestador } from '../../../serviceFront/solicitudService';
//  fin de conexión con el backend para obtener los trabajos del prestador autenticado

import '../../../assets/css/provider-views.css';

export const ProviderTrabajosPage = () => {
  const { user } = useAuth();

  // Inicio seccion de estado de trabajos
  const [trabajos,       setTrabajos]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  // Fin seccion de estado de trabajos

  // inicio conexión con el backend para obtener los trabajos del prestador autenticado
  // cambia de estado cada vez que cambia el idUsuario del usuario autenticado (ejemplo: al iniciar sesión o cerrar sesión)
  useEffect(() => {
    const cargarTrabajos = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user?.idUsuario) { setLoading(false); return; }

      try {
        setLoading(true);
        setBackendOffline(false);
        const data = await getMisTrabajosPrestador();
        setTrabajos(Array.isArray(data) ? data : []);
      } catch (err) {
        const offline =
          (err instanceof TypeError && err.message === 'Failed to fetch') ||
          err.message?.includes('conectar con el servidor');
        setBackendOffline(offline);
        setTrabajos([]);
        if (!offline) console.warn('Trabajos del prestador no cargados:', err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarTrabajos();
  }, [user?.idUsuario]);
  // fin conexión con el backend para obtener los trabajos del prestador autenticado

  return (
    <div className="container mt-4 mb-5 client-panel-content provider-view">

      {/* Inicio seccion del encavezado de la página */}
      <div className="pv-page-header">
        <div>
          <h2 className="pv-page-header__title">Mis Trabajos</h2>
          <p className="pv-page-header__sub">Solicitudes de clientes asignadas a tu perfil</p>
        </div>
        <ProviderNavTabs active="servicios" />
      </div>
      {/* Fin seccion de encavezado de página */}

      {/* Inicio seccion de tabla de trabajos */}
      <TrabajosTabla
        loading={loading}
        backendOffline={backendOffline}
        trabajos={trabajos}
      />
      {/* Fin seccion de tabla de trabajos */}

    </div>
  );
};
