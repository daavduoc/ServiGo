// seccion de  la tabla de trabajos aceptados por el prestador de servicio
import React from 'react';

// Inicio seccion de tabla de trabajos aceptados
export const TrabajosTabla = ({ loading, backendOffline, trabajos }) => {

  // Inicio seccion de estado de carga
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando trabajos...</span>
        </div>
      </div>
    );
  }
  // Fin seccion de estado de carga

  // manejo de errores si el backend no responde
  if (backendOffline) {
    return (
      <div className="alert alert-warning border-0 shadow-sm">
        <i className="bi bi-exclamation-triangle me-2" aria-hidden="true" />
        El backend no está disponible. Inicia Spring Boot en el puerto 8080 y recarga la página.
      </div>
    );
  }
  // Fin de manejo de errores si el backend no responde

  // Inicio seccion de contenido de la tabla
  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="fw-bold mb-3 text-success">Agenda de Clientes</h4>

      {trabajos.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Dirección</th>
                <th>Fecha preferida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {trabajos.map((t) => (
                <tr key={t.idSolicitud}>
                  <td><span className="text-muted">#{t.idSolicitud}</span></td>
                  <td className="fw-bold">{t.clienteNombre || '—'}</td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {t.servicioNombre || '—'}
                    </span>
                  </td>
                  <td>{t.direccionAtencion || '—'}</td>
                  <td>{t.fechaPreferida || '—'}</td>
                  <td><span className="badge bg-success">{t.estado || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info border-0 shadow-sm mb-0">
          Aún no tienes trabajos confirmados. Cuando un cliente solicite uno de tus servicios,
          aparecerá aquí :D.
        </div>
      )}
    </div>
  );
  // Fin seccion de contenido de la tabla
};
// Fin seccion de tabla de trabajos aceptados
