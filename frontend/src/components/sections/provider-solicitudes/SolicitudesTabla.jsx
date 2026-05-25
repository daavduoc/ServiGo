// componente para la tabla de solicitudes
import React from 'react';

// Inicio seccion de tabla de nuevas solicitudes
export const SolicitudesTabla = ({ solicitudes }) => (
  <div className="card shadow-sm border-0 p-4">
    <h4 className="fw-bold mb-3 text-success">Nuevas Solicitudes de Trabajo</h4>

    {solicitudes.length > 0 ? (
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
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td><span className="text-muted fw-mono">#{s.id}</span></td>
                <td className="fw-bold">{s.cliente}</td>
                <td><span className="badge bg-light text-dark border">{s.servicio}</span></td>
                <td>{s.fecha}</td>
                <td><span className="badge bg-warning text-dark">{s.estado}</span></td>
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
);
// Fin seccion de tabla de nuevas solicitudes