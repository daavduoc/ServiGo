import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Consumimos tu contexto real para saber qué prestador está mirando la pantalla
import { useAuth } from '../../context/AuthContext';

export const ProviderServicesView = () => {
  // 1. Estados reales de la API
  const [trabajosAceptados, setTrabajosAceptados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Extraemos el usuario y el token JWT guardados al hacer login exitoso
    const { user, token } = useAuth(); 

  // 3. Efecto para llamar al Backend al cargar la pantalla
  useEffect(() => {
    const obtenerServiciosBackend = async () => {
      try {
        setLoading(true);
        
        // Ajusta esta URL al endpoint exacto de tu controlador de Spring Boot
        // Ejemplo: /api/servicios/prestador/{id} o /api/prestador/mis-trabajos
        const response = await fetch(`http://localhost:8080/api/servicios/prestador/${user?.id || user?.idUsuario}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Enviamos el Token JWT en las cabeceras para saltar la seguridad de Spring Security
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          throw new Error(`Error en la petición: Status ${response.status}`);
        }

        // Datos mapeados directamente desde tu DTO de Java
        const data = await response.json();
        setTrabajosAceptados(data);
      } catch (err) {
        console.error("Error en ProviderServicesView al traer datos del Backend:", err);
        setError("No se pudieron cargar tus servicios agendados. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecuta la petición si el usuario está correctamente logueado en el contexto
    if (user) {
      obtenerServiciosBackend();
    }
  }, [user, token]);

  return (
    <div className="container mt-5">
      {/* Menú de Navegación superior */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-0">Mis Trabajos Cronológicos</h2>
          <p className="text-muted mb-0">Gestión de servicios en tiempo real desde el servidor</p>
        </div>
        <div className="btn-group">
          <Link to="/dashboard-prestador" className="btn btn-outline-primary">Nuevas Solicitudes</Link>
          <Link to="/prestador/mis-servicios" className="btn btn-primary active">Mis Trabajos Aceptados</Link>
          <Link to="/prestador/perfil" className="btn btn-outline-primary">Mi Perfil Profesional</Link>
        </div>
      </div>

      {/* --- PANTALLAS DE CONTROL DE FLUJO API --- */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando servicios...</span>
          </div>
          <p className="text-muted mt-2">Consultando agenda en el servidor de Spring Boot...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </div>
      )}

      {/* --- TABLA PRINCIPAL CON CONEXIÓN REAL --- */}
      {!loading && !error && (
        <div className="card shadow-sm border-0 p-4">
          <h4 className="fw-bold mb-3 text-success">Agenda de Clientes</h4>
          {trabajosAceptados.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID Trabajo</th>
                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Ubicación / Comuna</th>
                    <th>Fecha & Hora</th>
                    <th>Contacto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {trabajosAceptados.map((trabajo) => (
                    <tr key={trabajo.id || trabajo.idServicio}>
                      <td><span className="text-muted fw-mono">#00{trabajo.id || trabajo.idServicio}</span></td>
                      {/* Adaptación estricta a los campos comunes de tus DTOs de Java */}
                      <td className="fw-bold">{trabajo.clienteNombre || trabajo.nombreCliente}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {trabajo.servicioNombre || trabajo.nombreServicio}
                        </span>
                      </td>
                      <td>{trabajo.comuna || trabajo.direccion}</td>
                      <td>{trabajo.fecha} a las {trabajo.hora || trabajo.horario}</td>
                      <td>{trabajo.clienteTelefono || trabajo.telefono || 'Sin teléfono'}</td>
                      <td>
                        <span className={`badge ${
                          trabajo.estado === 'En Camino' || trabajo.estado === 'IN_PROGRESS' 
                            ? 'bg-warning text-dark' 
                            : 'bg-success'
                        }`}>
                          {trabajo.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info border-0 shadow-sm mb-0">
              No registras servicios aceptados o confirmados en tu cuenta actualmente.
            </div>
          )}
        </div>
      )}
    </div>
  );
};