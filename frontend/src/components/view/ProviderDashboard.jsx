import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProviderDashboardView = () => {
  const { user } = useAuth();
  
  // Dejamos las ganancias en 0 y las solicitudes vacías para que no muestre datos falsos
  const [dashboardData] = useState({
    ganancias: 0,
    trabajosPendientes: 0,
    solicitudesNuevas: [] // Al estar vacío, mostrará el mensaje de "No tienes nuevas solicitudes"
  });

  return (
    <div className="container mt-5" style={{ marginBottom: '50px' }}>
      
      {/* Menú de Navegación superior */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-0">Panel de Control: {user?.nombre} {user?.apellido}</h2>
          <p className="text-muted mb-0">Revisa tus ganancias y nuevas solicitudes de clientes</p>
        </div>
        <div className="btn-group">
          <Link to="/dashboard-prestador" className="btn btn-primary active">Nuevas Solicitudes</Link>
          <Link to="/prestador/mis-servicios" className="btn btn-outline-primary">Mis Trabajos Aceptados</Link>
          <Link to="/prestador/perfil" className="btn btn-outline-primary">Mi Perfil Profesional</Link>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 bg-primary text-white p-3">
            <h5 className="card-title"><i className="bi bi-wallet2 me-2"></i>Ganancias del Mes</h5>
            <h2 className="fw-bold">${dashboardData.ganancias.toLocaleString('es-CL')}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 bg-success text-white p-3">
            <h5 className="card-title"><i className="bi bi-tools me-2"></i>Trabajos Pendientes</h5>
            <h2 className="fw-bold">{dashboardData.trabajosPendientes}</h2>
          </div>
        </div>
      </div>

      {/* Tabla de Solicitudes Nuevas */}
      <div className="card shadow-sm border-0 p-4">
        <h4 className="fw-bold mb-3 text-primary">Nuevas Solicitudes de Trabajo</h4>
        
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
                      <button className="btn btn-sm btn-success me-2">Aceptar</button>
                      <button className="btn btn-sm btn-outline-danger">Rechazar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Este es el mensaje real que aparecerá ahora */
          <div className="alert alert-info border-0 shadow-sm mb-0">
            No tienes nuevas solicitudes de trabajo pendientes de aprobación en este momento.
          </div>
        )}
      </div>

    </div>
  );
};