import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDisplayName } from '../../utils/userDisplay';
import { ProviderNavTabs } from '../ui/ProviderNavTabs';

export const ProviderDashboardView = () => {
  const { user } = useAuth();

  const dashboardData = {
    ganancias: 0,
    trabajosPendientes: 0,
    solicitudesNuevas: [],
  };

  const nombreVisible = getDisplayName(user);
  const profesion = user?.especialidad || user?.categoriaPrestador || 'Especialista ServiGo';

  return (
    <div className="container mt-4 mb-5 client-panel-content">
      <div className="d-flex justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">Panel de Control: {nombreVisible}</h2>
          <p className="text-muted mb-0">{profesion}</p>
        </div>
        <ProviderNavTabs active="solicitudes" />
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 bg-success text-white p-3">
            <h5 className="card-title">
              <i className="bi bi-wallet2 me-2" aria-hidden="true" />
              Ganancias del Mes
            </h5>
            <h2 className="fw-bold">${dashboardData.ganancias.toLocaleString('es-CL')}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 bg-success text-white p-3">
            <h5 className="card-title">
              <i className="bi bi-tools me-2" aria-hidden="true" />
              Trabajos Pendientes
            </h5>
            <h2 className="fw-bold">{dashboardData.trabajosPendientes}</h2>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4">
        <h4 className="fw-bold mb-3 text-success">Nuevas Solicitudes de Trabajo</h4>

        {dashboardData.solicitudesNuevas.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Servicio Solicitado</th>
                  <th>Fecha Deseada</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.solicitudesNuevas.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td><span className="text-muted fw-mono">#{solicitud.id}</span></td>
                    <td className="fw-bold">{solicitud.cliente}</td>
                    <td><span className="badge bg-light text-dark border">{solicitud.servicio}</span></td>
                    <td>{solicitud.fecha}</td>
                    <td><span className="badge bg-warning text-dark">{solicitud.estado}</span></td>
                    <td>
                      <button type="button" className="btn btn-sm btn-success me-2">Aceptar</button>
                      <button type="button" className="btn btn-sm btn-outline-danger">Rechazar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info border-0 shadow-sm mb-0">
            No tienes nuevas solicitudes de trabajo pendientes de aprobación en este momento.
          </div>
        )}
      </div>
    </div>
  );
};

export const ProviderDashboard = ProviderDashboardView;
