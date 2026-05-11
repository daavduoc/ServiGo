import React, { useState } from 'react';

export const ClientDashboard = () => {
  // Datos del dashboard
  const [usuario] = useState({
    nombre: "Nicole Chávez",
    correo: "nicole.chavez@ejemplo.cl",
    comuna: "Puente Alto",
    telefono: "+56 9 1234 5678"
  });

  const [historial] = useState([
    { id: 101, servicio: "Gasfitería", especialista: "Juan Pérez", fecha: "15/05/2024", estado: "Completado" },
    { id: 102, servicio: "Kinesiología", especialista: "Dra. María González", fecha: "20/05/2024", estado: "Pendiente" },
  ]);

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Panel General</h2>
      <div className="row">
        {/* Tu tarjeta de perfil */}
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body text-center">
              <div className="mb-3"><span className="fs-1">👤</span></div>
              <h4 className="fw-bold">{usuario.nombre}</h4>
              <p className="text-muted">{usuario.comuna}, Chile</p>
            </div>
          </div>
        </div>

        {/* Tabla de historial */}
        <div className="col-md-7 col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-3">Historial de Servicios</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Servicio</th>
                    <th>Especialista</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold">{item.servicio}</td>
                      <td>{item.especialista}</td>
                      <td><span className="badge bg-success">{item.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};