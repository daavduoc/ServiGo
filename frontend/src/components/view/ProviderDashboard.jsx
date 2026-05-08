import React, { useState } from 'react';

export const ProviderDashboard = () => {
  // Datos simulados del Prestador
  const [prestador] = useState({
    nombre: "Juan Pérez",
    profesion: "Gasfíter Certificado",
    calificacion: "⭐ 4.8",
    gananciasMes: "$450.000",
    trabajosCompletados: 12
  });

  // Solicitudes pendientes que le envían los clientes
  const [solicitudes] = useState([
    { id: 201, cliente: "Nicole", direccion: "Puente Alto", fecha: "10/05/2026", detalle: "Fuga de agua en lavaplatos", estado: "Pendiente" },
    { id: 202, cliente: "Matías", direccion: "La Florida", fecha: "11/05/2026", detalle: "Instalación de calefón", estado: "Pendiente" },
  ]);

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold">Panel de Control: {prestador.nombre}</h2>
          <p className="text-muted">{prestador.profesion} | Calificación: {prestador.calificacion}</p>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 bg-primary text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Ganancias del Mes</h5>
              <h3 className="fw-bold">{prestador.gananciasMes}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 bg-success text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Trabajos Completados</h5>
              <h3 className="fw-bold">{prestador.trabajosCompletados}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Solicitudes */}
      <div className="card shadow-sm border-0 p-4">
        <h4 className="fw-bold mb-3">Nuevas Solicitudes de Trabajo</h4>
        
        {solicitudes.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Cliente</th>
                  <th>Dirección</th>
                  <th>Fecha Solicitada</th>
                  <th>Detalle</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td className="fw-bold">{solicitud.cliente}</td>
                    <td>{solicitud.direccion}</td>
                    <td>{solicitud.fecha}</td>
                    <td>{solicitud.detalle}</td>
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
          <div className="alert alert-info">No tienes nuevas solicitudes por el momento.</div>
        )}
      </div>
    </div>
  );
};