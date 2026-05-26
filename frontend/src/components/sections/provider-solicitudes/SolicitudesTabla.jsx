// componente para la tabla de solicitudes
import React from 'react';

// Inicio seccion de tabla de nuevas solicitudes
export const SolicitudesTabla = ({
  solicitudes,
  onAceptar,
  onRechazar,
  accionandoId,
}) => (
  <div className="card shadow-sm border-0 p-4">
    <h4 className="fw-bold mb-3 text-success">Pendientes de confirmar</h4>

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
            {solicitudes.map((s) => {
              const enProceso = accionandoId === s.idSolicitud;
              return (
                <tr key={s.idSolicitud}>
                  <td><span className="text-muted fw-mono">#{s.idSolicitud}</span></td>
                  <td className="fw-bold">{s.clienteNombre || '—'}</td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {s.servicioNombre || '—'}
                    </span>
                  </td>
                  <td>{s.fechaPreferida || '—'}</td>
                  <td><span className="badge bg-warning text-dark">{s.estado || 'pendiente'}</span></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-success me-2"
                      onClick={() => onAceptar(s)}
                      disabled={enProceso}
                    >
                      {enProceso ? '...' : 'Aceptar'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onRechazar(s)}
                      disabled={enProceso}
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              );
            })}
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
