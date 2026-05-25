import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProviderNavTabs } from '../ui/ProviderNavTabs';
import { getMisTrabajosPrestador } from '../../serviceFront/solicitudService';

export const ProviderServicesView = () => {
  const { user } = useAuth();
  const [trabajosAceptados, setTrabajosAceptados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);

  useEffect(() => {
    const cargarTrabajos = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user?.idUsuario) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setBackendOffline(false);
        const data = await getMisTrabajosPrestador();
        setTrabajosAceptados(Array.isArray(data) ? data : []);
      } catch (err) {
        const offline =
          (err instanceof TypeError && err.message === 'Failed to fetch') ||
          err.message?.includes('conectar con el servidor');
        setBackendOffline(offline);
        setTrabajosAceptados([]);
        if (!offline) {
          console.warn('Trabajos del prestador no cargados:', err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    cargarTrabajos();
  }, [user?.idUsuario]);

  return (
    <div className="container mt-4 mb-5 client-panel-content">
      <div className="d-flex justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">Mis Trabajos</h2>
          <p className="text-muted mb-0">Solicitudes de clientes asignadas a tu perfil</p>
        </div>
        <ProviderNavTabs active="servicios" />
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando trabajos...</span>
          </div>
        </div>
      )}

      {!loading && backendOffline && (
        <div className="alert alert-warning border-0 shadow-sm">
          <i className="bi bi-exclamation-triangle me-2" aria-hidden="true" />
          El backend no está disponible. Inicia Spring Boot en el puerto 8080 y recarga la página.
        </div>
      )}

      {!loading && !backendOffline && (
        <div className="card shadow-sm border-0 p-4">
          <h4 className="fw-bold mb-3 text-success">Agenda de Clientes</h4>
          {trabajosAceptados.length > 0 ? (
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
                  {trabajosAceptados.map((trabajo) => (
                    <tr key={trabajo.idSolicitud}>
                      <td><span className="text-muted">#{trabajo.idSolicitud}</span></td>
                      <td className="fw-bold">{trabajo.clienteNombre || '—'}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {trabajo.servicioNombre || '—'}
                        </span>
                      </td>
                      <td>{trabajo.direccionAtencion || '—'}</td>
                      <td>{trabajo.fechaPreferida || '—'}</td>
                      <td>
                        <span className="badge bg-success">{trabajo.estado || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info border-0 shadow-sm mb-0">
              Aún no tienes trabajos confirmados. Cuando un cliente solicite uno de tus servicios, aparecerá aquí.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
