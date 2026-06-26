import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelarReservaCliente, getMisReservasCliente, eliminarReservaCliente } from '../../serviceFront/reservaService';
import { mensajeEstadoReserva } from '../../utils/booking';

const estadoBadgeClass = (etiqueta) => {
  if (etiqueta === 'success') return 'badge bg-success text-white';
  if (etiqueta === 'warning') return 'badge bg-warning text-dark';
  if (etiqueta === 'danger') return 'badge bg-danger text-white';
  return 'badge bg-secondary text-white';
};

const mapCitaDesdeApi = (item) => ({
  id: item.idReserva,
  idPrestador: item.idPrestador,
  servicio: item.servicio,
  especialista: item.especialista,
  fecha: item.fechaTexto,
  hora: item.horaTexto,
  fechaSolicitud: item.fechaSolicitudTexto,
  estado: item.estado,
  precio: item.precioTexto,
  etiqueta: item.estadoEtiqueta || 'secondary',
  mensajeDetalle: item.mensajeDetalle || mensajeEstadoReserva(item.estado),
  puedeEliminar: item.puedeEliminar || false,
  puedeRealizar: item.puedeRealizar || false,
});

export const ClientReservationsView = () => {
  const [proximasCitas, setProximasCitas] = useState([]);
  const [historialCitas, setHistorialCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [citaDetalle, setCitaDetalle] = useState(null);

  const cargarReservas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMisReservasCliente();
      setProximasCitas((data?.proximas || []).map(mapCitaDesdeApi));
      setHistorialCitas((data?.historial || []).map(mapCitaDesdeApi));
    } catch (err) {
      console.error('Error cargando reservas:', err);
      setError(err.message || 'No se pudieron cargar tus reservas');
      setProximasCitas([]);
      setHistorialCitas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  const handleCancelar = async (idReserva) => {
    if (!window.confirm('¿Deseas cancelar esta cita?')) {
      return;
    }

    try {
      setCancelandoId(idReserva);
      await cancelarReservaCliente(idReserva);
      await cargarReservas();
    } catch (err) {
      alert(err.message || 'No se pudo cancelar la reserva');
    } finally {
      setCancelandoId(null);
    }
  };

  const handleEliminar = async (idReserva) => {
    if (!window.confirm('¿Deseas eliminar esta reserva del historial? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setEliminandoId(idReserva);
      await eliminarReservaCliente(idReserva);
      await cargarReservas();
    } catch (err) {
      alert(err.message || 'No se pudo eliminar la reserva');
    } finally {
      setEliminandoId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 mb-5 text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-3 mb-0">Cargando tus reservas...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
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

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={cargarReservas}>
            Reintentar
          </button>
        </div>
      )}

      <div className="card shadow-sm border-0 p-4 mb-4">
        <h4 className="mb-4 profile-panel-title">
          <i className="bi bi-clock-history" aria-hidden="true" />
          Próximas Citas
        </h4>

        {proximasCitas.length > 0 ? (
          <div className="row g-3">
            {proximasCitas.map((cita) => (
              <div className="col-12" key={cita.id}>
                <div className="card border-0 shadow-sm rounded-3 bg-white border-start border-success border-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
                      <div>
                        <span
                          className={`${estadoBadgeClass(cita.etiqueta)} px-3 py-1 rounded-pill mb-2 fw-semibold`}
                        >
                          {cita.estado}
                        </span>
                        <h5 className="fw-bold m-0">{cita.servicio}</h5>
                        <p className="text-muted small m-0">Con: {cita.especialista}</p>
                        {cita.fechaSolicitud && (
                          <p className="small text-secondary mb-0 mt-2">
                            <i className="bi bi-clock me-1" aria-hidden="true" />
                            {cita.fechaSolicitud}
                          </p>
                        )}
                        {cita.mensajeDetalle && (
                          <p className="small text-secondary mb-0 mt-2">
                            <i className="bi bi-info-circle me-1" aria-hidden="true" />
                            {cita.mensajeDetalle}
                          </p>
                        )}
                      </div>
                      <div
                        className="text-center bg-light p-3 rounded-3"
                        style={{ minWidth: '130px' }}
                      >
                        <div className="fw-bold text-dark small mb-1">{cita.fecha}</div>
                        <div className="text-success fw-bold">{cita.hora}</div>
                      </div>
                    </div>
                    <hr className="text-muted my-3" />
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <span className="fw-bold text-dark">Total: {cita.precio}</span>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger px-3 rounded-pill"
                          disabled={cancelandoId === cita.id}
                          onClick={() => handleCancelar(cita.id)}
                        >
                          {cancelandoId === cita.id ? 'Cancelando...' : 'Cancelar'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-success px-3 rounded-pill"
                          onClick={() => setCitaDetalle(cita)}
                        >
                          Ver detalles
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

      <div className="card shadow-sm border-0 p-4">
        <h4 className="mb-4 profile-panel-title">
          <i className="bi bi-journal-text" aria-hidden="true" />
          Historial de Atenciones
        </h4>

        {historialCitas.length > 0 ? (
          <div className="row g-3">
            {historialCitas.map((cita) => (
              <div className="col-12" key={cita.id}>
                <div className="card border-0 shadow-sm rounded-3 bg-light hover-shadow-md transition-all">
                  <div className="card-body p-3">
                    <div className="row align-items-center g-3">
                      <div className="col-auto">
                        <div className="bg-white p-3 rounded-circle shadow-sm text-success">
                          {cita.etiqueta === 'danger' ? (
                            <i className="bi bi-x-circle fs-5" aria-hidden="true" />
                          ) : (
                            <i className="bi bi-check-circle fs-5" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                      <div className="col">
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                          <div>
                            <h6 className="fw-bold m-0 text-dark">{cita.servicio}</h6>
                            <small className="text-muted d-block">
                              <i className="bi bi-person me-1" aria-hidden="true" />
                              {cita.especialista}
                            </small>
                            <small className="text-muted d-block">
                              <i className="bi bi-calendar me-1" aria-hidden="true" />
                              {cita.fecha} • {cita.hora}
                            </small>
                            {cita.fechaSolicitud && (
                              <small className="text-secondary d-block mt-1">
                                <i className="bi bi-clock me-1" aria-hidden="true" />
                                {cita.fechaSolicitud}
                              </small>
                            )}
                            {cita.mensajeDetalle && (
                              <small className="text-secondary d-block mt-1">{cita.mensajeDetalle}</small>
                            )}
                          </div>
                          <span
                            className={`${estadoBadgeClass(cita.etiqueta)} px-2 py-1 rounded-pill fw-semibold text-nowrap`}
                          >
                            {cita.estado}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 col-md-auto">
                        <div className="d-flex gap-2 flex-wrap">
                          <Link
                            to="/buscar"
                            className="btn btn-sm btn-outline-secondary rounded-pill"
                          >
                            <i className="bi bi-plus-circle me-1" aria-hidden="true" />
                            Agendar de nuevo
                          </Link>
                          {cita.puedeEliminar && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              disabled={eliminandoId === cita.id}
                              onClick={() => handleEliminar(cita.id)}
                              title="Eliminar este registro del historial"
                            >
                              {eliminandoId === cita.id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                                  Eliminando...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-trash me-1" aria-hidden="true" />
                                  Eliminar
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-light border text-center p-4 rounded-3 mb-0 text-muted">
            Aún no tienes atenciones finalizadas en tu historial.
          </div>
        )}
      </div>

      <div className="bg-light p-4 rounded-3 border-start border-success border-4 mt-4">
        <p className="text-muted mb-0">
          <i className="bi bi-lightbulb text-success me-2" aria-hidden="true" />
          Usa <strong>Agendar Nueva Cita</strong> para buscar especialistas disponibles en tu comuna.
        </p>
      </div>

      {citaDetalle && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalleCitaTitulo"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" id="detalleCitaTitulo">
                  Detalle de tu cita
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setCitaDetalle(null)}
                />
              </div>
              <div className="modal-body pt-2">
                <p className="mb-2">
                  <span className={`${estadoBadgeClass(citaDetalle.etiqueta)} px-2 py-1 rounded-pill`}>
                    {citaDetalle.estado}
                  </span>
                </p>
                <p className="fw-bold mb-1">{citaDetalle.servicio}</p>
                <p className="text-muted small mb-2">Con: {citaDetalle.especialista}</p>
                {citaDetalle.mensajeDetalle && (
                  <p className="small alert alert-light border py-2 mb-3">
                    {citaDetalle.mensajeDetalle}
                  </p>
                )}

                <ul className="list-unstyled small mb-0">
                  <li className="mb-2">
                    <strong>Fecha:</strong> {citaDetalle.fecha}
                  </li>
                  <li className="mb-2">
                    <strong>Hora:</strong> {citaDetalle.hora}
                  </li>
                  {citaDetalle.fechaSolicitud && (
                    <li className="mb-2">
                      <strong>Solicitado:</strong> {citaDetalle.fechaSolicitud.replace('Solicitado: ', '')}
                    </li>
                  )}
                  <li className="mb-2">
                    <strong>Total:</strong> {citaDetalle.precio}
                  </li>
                  <li>
                    <strong>Reserva Nº:</strong> {citaDetalle.id}
                  </li>
                </ul>
              </div>
              <div className="modal-footer border-0 pt-0 flex-wrap gap-2">
                {citaDetalle.idPrestador ? (
                  <Link
                    to={`/servicio-detalle/${citaDetalle.idPrestador}`}
                    className="btn btn-outline-success rounded-pill btn-sm"
                    onClick={() => setCitaDetalle(null)}
                  >
                    Ver perfil del especialista
                  </Link>
                ) : (
                  <span className="text-muted small">—</span>
                )}
                <button
                  type="button"
                  className="btn btn-success rounded-pill btn-sm ms-auto"
                  onClick={() => setCitaDetalle(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};