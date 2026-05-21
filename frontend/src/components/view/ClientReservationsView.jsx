import React from 'react';
import { Link } from 'react-router-dom';

export const ClientReservationsView = () => {
  // Mock: Citas que están por venir
  const proximasCitas = [
    {
      id: 101,
      servicio: "Reparación e Instalación de Calefón",
      especialista: "Juan Pérez",
      fecha: "25 de Mayo, 2026",
      hora: "14:30 hrs",
      estado: "Confirmada",
      precio: "$25.000",
      etiqueta: "success" // Verde
    }
  ];

  // Mock: Citas que ya pasaron
  const historialCitas = [
    {
      id: 84,
      servicio: "Evaluación Kinesiología",
      especialista: "Ana Silva",
      fecha: "10 de Abril, 2026",
      hora: "10:00 hrs",
      estado: "Finalizada",
      precio: "$18.000",
      etiqueta: "secondary" // Gris
    }
  ];

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '900px' }}>
      
      {/* HEADER CON BOTÓN AGREGADO */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <h2 className="fw-bold m-0">📅 Mis Horas y Reservas</h2>
        <Link to="/buscar" className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm hover-btn-success">
          <i className="bi bi-plus-lg me-2"></i>Agendar Nueva Cita
        </Link>
      </div>

      {/* SECCIÓN 1: PRÓXIMAS CITAS */}
      <h5 className="fw-bold text-dark mb-3">Próximas Citas</h5>
      {proximasCitas.length > 0 ? (
        <div className="row g-3 mb-5">
          {proximasCitas.map((cita) => (
            <div className="col-12" key={cita.id}>
              <div className="card border-0 shadow-sm rounded-3 bg-white border-start border-success border-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className={`badge bg-${cita.etiqueta} bg-opacity-10 text-${cita.etiqueta} px-3 py-1 rounded-pill mb-2`}>
                        {cita.estado}
                      </span>
                      <h5 className="fw-bold m-0">{cita.servicio}</h5>
                      <p className="text-muted small m-0">Con: {cita.especialista}</p>
                    </div>
                    <div className="text-end bg-light p-2 rounded-3 text-center" style={{ minWidth: '100px' }}>
                      <span className="d-block fw-bold text-dark">{cita.fecha.split(' ')[0]} {cita.fecha.split(' ')[2]}</span>
                      <small className="text-success fw-bold">{cita.hora}</small>
                    </div>
                  </div>
                  <hr className="text-muted" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">Total: {cita.precio}</span>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-danger px-3 rounded-pill">Cancelar</button>
                      <button className="btn btn-sm btn-success px-3 rounded-pill">Ver Detalle</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-light border text-center p-4 rounded-3 mb-5 text-muted">
          No tienes próximas reservas agendadas. <br/>
          <Link to="/buscar" className="text-success fw-bold text-decoration-none">¡Explora la plataforma y agenda hoy!</Link>
        </div>
      )}

      {/* SECCIÓN 2: HISTORIAL DE CITAS */}
      <h5 className="fw-bold text-dark mb-3">Historial de Atenciones</h5>
      <div className="row g-3">
        {historialCitas.map((cita) => (
          <div className="col-12" key={cita.id}>
            <div className="card border-0 shadow-sm rounded-3 bg-light">
              <div className="card-body p-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-white p-3 rounded-circle shadow-sm text-secondary">
                    🗓️
                  </div>
                  <div>
                    <h6 className="fw-bold m-0 text-dark">{cita.servicio}</h6>
                    <small className="text-muted">{cita.fecha} • {cita.especialista}</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className={`badge bg-${cita.etiqueta} px-3 py-1 rounded-pill`}>
                    {cita.estado}
                  </span>
                  <Link to="/buscar" className="btn btn-sm btn-outline-secondary rounded-pill">Volver a agendar</Link>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hover-btn-success:hover {
          background-color: #157347;
          color: white;
        }
      `}</style>
    </div>
  );
};