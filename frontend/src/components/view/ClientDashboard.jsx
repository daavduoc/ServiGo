import React, { useState } from 'react';

export const ClientDashboard = () => {
  // Datos de prueba del cliente (Mock Data)
  const [usuario, setUsuario] = useState({
    nombre: "Nicole Chávez",
    correo: "nicole.chavez@ejemplo.cl",
    comuna: "Puente Alto",
    telefono: "+56 9 1234 5678",
    miembroDesde: "Enero 2024"
  });

  // Historial de servicios pedidos
  const [historial] = useState([
    { id: 101, servicio: "Gasfitería", especialista: "Juan Pérez", fecha: "15/05/2024", estado: "Completado" },
    { id: 102, servicio: "Kinesiología", especialista: "Dra. María González", fecha: "20/05/2024", estado: "Pendiente" },
  ]);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Columna Izquierda: Información del Perfil */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body text-center">
              <div className="mb-3">
                <span className="fs-1">👤</span>
              </div>
              <h4 className="fw-bold">{usuario.nombre}</h4>
              <p className="text-muted">{usuario.comuna}, Chile</p>
              <button className="btn btn-outline-success btn-sm w-100">Editar Perfil</button>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Correo:</strong>
                <span className="text-muted small">{usuario.correo}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Teléfono:</strong>
                <span className="text-muted small">{usuario.telefono}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Miembro desde:</strong>
                <span className="text-muted small">{usuario.miembroDesde}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Columna Derecha: Gestión de Servicios */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4">
            <h3 className="fw-bold mb-4">Mis Solicitudes de Servicio</h3>
            
            {historial.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Servicio</th>
                      <th>Especialista</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-bold">{item.servicio}</td>
                        <td>{item.especialista}</td>
                        <td>{item.fecha}</td>
                        <td>
                          <span className={`badge ${item.estado === 'Completado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {item.estado}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-light border">Ver detalle</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">Aún no has solicitado servicios.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};