import React from 'react';
import { Link } from 'react-router-dom';

const PROXIMAS_CITAS = [
  {
    id: 101,
    servicio: 'Reparación e Instalación de Calefón',
    especialista: 'Juan Pérez',
    fecha: '25 de Mayo, 2026',
    hora: '14:30 hrs',
    estado: 'Confirmada',
    precio: '$25.000',
    etiqueta: 'success',
  },
];

const estadoBadgeClass = (etiqueta) => {
  if (etiqueta === 'success') return 'badge bg-success text-white';
  if (etiqueta === 'warning') return 'badge bg-warning text-dark';
  return 'badge bg-secondary text-white';
};

const HISTORIAL_CITAS = [
  {
    id: 84,
    servicio: 'Evaluación Kinesiología',
    especialista: 'Ana Silva',
    fecha: '10 de Abril, 2026',
    hora: '10:00 hrs',
    estado: 'Finalizada',
    precio: '$18.000',
    etiqueta: 'secondary',
  },
];

export const ClientReservationsView = () => {
  return (
    <div className="container mt-5 mb-5">
      {/* Mismo patrón de encabezado que el resto del panel cliente */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <h2 className="m-0 d-flex align-items-center gap-2 profile-panel-title">
          <i className="bi bi-calendar-check" aria-hidden="true" />
          Mis Horas y Reservas
        </h2>
        <Link
          to="/buscar"
          className="btn btn-success client-panel-cta-btn fw-bold rounded-pill shadow-sm text-nowrap"
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Agendar Nueva Cita
        </Link>
      </div>

      {/* Panel 1 — igual estilo que "Mis Datos Personales" en /perfil */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h4 className="mb-4 profile-panel-title">
          <i className="bi bi-clock-history" aria-hidden="true" />
          Próximas Citas
        </h4>

        {PROXIMAS_CITAS.length > 0 ? (
          <div className="row g-3">
            {PROXIMAS_CITAS.map((cita) => (
              <div className="col-12" key={cita.id}>
                <div className="card border-0 shadow-sm rounded-3 bg-white border-start border-success border-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-3">
                      <div>
                        <span
                          className={`${estadoBadgeClass(cita.etiqueta)} px-3 py-1 rounded-pill mb-2 fw-semibold`}
                        >
                          {cita.estado}
                        </span>
                        <h5 className="fw-bold m-0">{cita.servicio}</h5>
                        <p className="text-muted small m-0">Con: {cita.especialista}</p>
                      </div>
                      <div
                        className="text-end bg-light p-2 rounded-3 text-center"
                        style={{ minWidth: '100px' }}
                      >
                        <span className="d-block fw-bold text-dark">
                          {cita.fecha.split(' ')[0]} {cita.fecha.split(' ')[2]}
                        </span>
                        <small className="text-success fw-bold">{cita.hora}</small>
                      </div>
                    </div>
                    <hr className="text-muted" />
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <span className="fw-bold text-dark">Total: {cita.precio}</span>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger px-3 rounded-pill"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-success px-3 rounded-pill"
                        >
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-light border text-center p-4 rounded-3 mb-0 text-muted">
            No tienes próximas reservas agendadas.
            <br />
            <Link to="/buscar" className="text-success fw-bold text-decoration-none">
              ¡Explora la plataforma y agenda hoy!
            </Link>
          </div>
        )}
      </div>

      {/* Panel 2 — historial */}
      <div className="card shadow-sm border-0 p-4">
        <h4 className="mb-4 profile-panel-title">
          <i className="bi bi-journal-text" aria-hidden="true" />
          Historial de Atenciones
        </h4>
        <div className="row g-3">
          {HISTORIAL_CITAS.map((cita) => (
            <div className="col-12" key={cita.id}>
              <div className="card border-0 shadow-sm rounded-3 bg-light">
                <div className="card-body p-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-white p-3 rounded-circle shadow-sm text-success">
                      <i className="bi bi-calendar-check fs-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h6 className="fw-bold m-0 text-dark">{cita.servicio}</h6>
                      <small className="text-muted">
                        {cita.fecha} • {cita.especialista}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className={`${estadoBadgeClass(cita.etiqueta)} px-3 py-1 rounded-pill fw-semibold`}>
                      {cita.estado}
                    </span>
                    <Link to="/buscar" className="btn btn-sm btn-outline-secondary rounded-pill">
                      Volver a agendar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mismo recuadro informativo que /perfil */}
      <div className="bg-light p-4 rounded-3 border-start border-success border-4 mt-4">
        <p className="text-muted mb-0">
          <i className="bi bi-lightbulb text-success me-2" aria-hidden="true" />
          Usa <strong>Agendar Nueva Cita</strong> para buscar especialistas disponibles en tu comuna.
        </p>
      </div>
    </div>
  );
};
