import React from 'react';
import { useAuth }        from '../../../context/AuthContext';
import { getDisplayName } from '../../../utils/userDisplay';
import { ProviderNavTabs } from '../../ui/ProviderNavTabs';

// Inicio seccion de importaciones de secciones
import { MetricasPanel }    from '../../../components/sections/provider-solicitudes/MetricasPanel';
import { SolicitudesTabla } from '../../../components/sections/provider-solicitudes/SolicitudesTabla';
// Fin seccion de importaciones de secciones

import '../../../assets/css/provider-views.css';

export const ProviderSolicitudesPage = () => {
  const { user } = useAuth();

  // Conexion con el backend para obtener las solicitudes nuevas del prestador autenticado
  const dashboardData = {
    ganancias:         0,
    trabajosPendientes: 0,
    solicitudesNuevas: [],
  };
  // fin de conexion con el backend para obtener las solicitudes nuevas del prestador autenticado

  const nombreVisible = getDisplayName(user);
  const profesion     = user?.especialidad || user?.categoriaPrestador || 'Especialista ServiGo';

  return (
    <div className="container mt-4 mb-5 client-panel-content provider-view">

      {/* Inicio seccion del encavezado de la página */}
      <div className="pv-page-header">
        <div>
          <h2 className="pv-page-header__title">Panel de Control: {nombreVisible}</h2>
          <p className="pv-page-header__sub">{profesion}</p>
        </div>
        <ProviderNavTabs active="solicitudes" />
      </div>
      {/* Fin seccion de encavezado de página */}

      {/* Inicio seccion de métricas */}
      <MetricasPanel
        ganancias={dashboardData.ganancias}
        trabajosPendientes={dashboardData.trabajosPendientes}
      />
      {/* Fin seccion de métricas */}

      {/* Inicio seccion de tabla de solicitudes */}
      <SolicitudesTabla solicitudes={dashboardData.solicitudesNuevas} />
      {/* Fin seccion de tabla de solicitudes */}

    </div>
  );
};
