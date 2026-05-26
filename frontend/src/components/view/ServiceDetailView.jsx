import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerPrestadorPublico } from '../../serviceFront/prestadorService';
import { crearReservaCliente } from '../../serviceFront/reservaService';
import { formatFechaCitaLegible } from '../../utils/booking';
import { formatearPrecio } from '../../utils/formatPrice';
import { LoginModal } from '../ui/LoginModal';
import { BookingForm } from './BookingForm';
import '../../assets/css/service-detail.css';

const PLACEHOLDER_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" fill="#e9ecef"/>' +
      '<circle cx="50" cy="38" r="18" fill="#adb5bd"/>' +
      '<ellipse cx="50" cy="78" rx="28" ry="18" fill="#adb5bd"/>' +
      '</svg>'
  );

export const ServiceDetailView = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [prestador, setPrestador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mensajeExito, setMensajeExito] = useState('');
  const [reservando, setReservando] = useState(false);
  const [errorReserva, setErrorReserva] = useState(null);
  const [showReservaExitoModal, setShowReservaExitoModal] = useState(false);
  const [reservaExito, setReservaExito] = useState(null);
  const [bookingResetKey, setBookingResetKey] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const cargarPrestador = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await obtenerPrestadorPublico(id);
        setPrestador(data);
      } catch (err) {
        setError(err.message || 'No se pudo cargar el perfil del especialista');
        setPrestador(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarPrestador();
    }
  }, [id]);

  const handleBookingSubmit = async (fecha, hora) => {
    const tieneSesion = isAuthenticated && Boolean(localStorage.getItem('token'));
    if (!tieneSesion) {
      setShowAuthModal(true);
      return;
    }

    if (!prestador) return;

    const servicioPrincipal = prestador.servicios?.[0];

    setReservando(true);
    setErrorReserva(null);

    try {
      await crearReservaCliente({
        idPrestador: prestador.idPrestador,
        idServicio: servicioPrincipal?.idServicio ?? null,
        fecha,
        hora,
      });

      setMensajeExito(
        `Tu cita con ${prestador.nombre} quedó registrada para el ${fecha} a las ${hora} hrs. Puedes revisarla en Mis Horas y Reservas.`
      );
      setReservaExito({
        nombre: prestador.nombre,
        fecha,
        hora,
        fechaLegible: formatFechaCitaLegible(fecha),
      });
      setShowReservaExitoModal(true);
    } catch (err) {
      setErrorReserva(err.message || 'No se pudo registrar la reserva. Intenta nuevamente.');
    } finally {
      setReservando(false);
    }
  };

  const cerrarModalReservaExito = () => {
    setShowReservaExitoModal(false);
    setBookingResetKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (error || !prestador) {
    return (
      <div className="container py-5" style={{ maxWidth: '720px' }}>
        <div className="alert alert-warning">{error || 'Especialista no encontrado.'}</div>
        <Link to="/buscar" className="btn btn-success">
          Volver al buscador
        </Link>
      </div>
    );
  }

  const servicioPrincipal = prestador.servicios?.[0];
  const tituloServicio = servicioPrincipal?.nombre || prestador.profesion;
  const descripcion =
    prestador.descripcion ||
    servicioPrincipal?.descripcion ||
    `${prestador.nombre} ofrece servicios de ${prestador.profesion} en ${prestador.comuna || 'tu comuna'}.`;

  return (
    <div className="container py-4" style={{ maxWidth: '1000px' }}>
      <div className="mb-3">
        <Link to="/buscar" className="text-success text-decoration-none small fw-semibold">
          ← Volver al buscador
        </Link>
      </div>

      {mensajeExito ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4 bg-white mt-3">
          <span className="display-1 mb-3">🎉</span>
          <h3 className="fw-bold text-success">¡Solicitud registrada!</h3>
          <p className="text-muted mx-auto mt-2" style={{ maxWidth: '550px' }}>
            {mensajeExito}
          </p>
          <div className="mt-4">
            <Link to="/buscar" className="btn btn-success px-4 py-2 rounded-3 me-2">
              Buscar más especialistas
            </Link>
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2 rounded-3"
              onClick={() => setMensajeExito('')}
            >
              Volver al perfil
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white h-100">
              <div className="d-flex align-items-center gap-3 mb-4">
                <img
                  src={prestador.imagen || PLACEHOLDER_AVATAR}
                  alt={prestador.nombre}
                  className="rounded-circle border border-3 border-light shadow-sm"
                  style={{ width: '88px', height: '88px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_AVATAR;
                  }}
                />
                <div>
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1.5 fs-6 fw-semibold">
                    {prestador.area}
                  </span>
                  <h2 className="fw-bold text-dark mb-1 mt-2">{prestador.nombre}</h2>
                  <p className="text-muted mb-0">{prestador.profesion}</p>
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mb-4">
                <span>
                  📍 {[prestador.comuna, prestador.region].filter(Boolean).join(', ')}
                </span>
                {prestador.experiencia && <span>💼 {prestador.experiencia}</span>}
              </div>

              <h5 className="fw-bold text-dark mb-2">{tituloServicio}</h5>
              <p className="text-secondary lh-base mb-4 small">{descripcion}</p>

              {prestador.servicios?.length > 0 && (
                <>
                  <h5 className="fw-bold text-dark mb-3">Servicios ofrecidos</h5>
                  <ul className="list-unstyled mb-4">
                    {prestador.servicios.map((servicio) => (
                      <li
                        key={servicio.idServicio}
                        className="border rounded-3 p-3 mb-2 bg-light"
                      >
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div>
                            <strong className="text-dark">{servicio.nombre}</strong>
                            {servicio.descripcion && (
                              <p className="text-muted small mb-0 mt-1">{servicio.descripcion}</p>
                            )}
                          </div>
                          <span className="text-success fw-bold small text-nowrap">
                            {formatearPrecio(servicio.precioReferencial)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="bg-light p-3 rounded-3 mt-auto d-flex justify-content-between align-items-center border-start border-success border-4">
                <div>
                  <small className="text-muted d-block text-uppercase fw-bold">Desde</small>
                  <span className="fs-3 fw-bold text-success">
                    {formatearPrecio(prestador.precio)}
                  </span>
                </div>
                <small className="text-muted text-end">
                  Precio referencial
                  <br />
                  según servicio
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            {errorReserva && (
              <div className="alert alert-danger small mb-3">{errorReserva}</div>
            )}
            <BookingForm
              prestador={prestador}
              onSubmit={handleBookingSubmit}
              submitting={reservando}
              resetKey={bookingResetKey}
            />
          </div>
        </div>
      )}

      {showReservaExitoModal && reservaExito && (
        <div
          className="modal show d-block custom-modal-backdrop"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reservaExitoTitulo"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={cerrarModalReservaExito}
                />
              </div>
              <div className="modal-body text-center px-4 pt-0 pb-4">
                <h2 className="fw-bold text-success display-6 mb-3">ServiGo</h2>
                <h4 className="fw-bold text-dark mb-2" id="reservaExitoTitulo">
                  ¡Tu cita quedó agendada!
                </h4>
                <p className="text-muted mb-3">
                  Solicitaste una cita con <strong>{reservaExito.nombre}</strong> para el{' '}
                  <strong>{reservaExito.fechaLegible}</strong> a las <strong>{reservaExito.hora} hrs</strong>.
                </p>
                <p className="small text-warning-emphasis bg-warning bg-opacity-10 rounded-3 px-3 py-2 mb-0">
                  <i className="bi bi-hourglass-split me-1" aria-hidden="true" />
                  El especialista debe confirmar tu solicitud. Te avisaremos en{' '}
                  <strong>Mis Horas y Reservas</strong>.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0 flex-column flex-sm-row gap-2 justify-content-center px-4 pb-4">
                <Link
                  to="/mis-reservas"
                  className="btn btn-success rounded-pill px-4 fw-bold w-100 w-sm-auto"
                  onClick={cerrarModalReservaExito}
                >
                  Ver mis reservas
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-success rounded-pill px-4 w-100 w-sm-auto"
                  onClick={cerrarModalReservaExito}
                >
                  Seguir en este perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔽 MODAL DE AUTENTICACIÓN REQUERIDA ACTUALIZADO 🔽 */}
      {showAuthModal && (
        <div className="modal show d-block custom-modal-backdrop" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" onClick={() => setShowAuthModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body text-center px-4 pb-5">
                
                {/* AQUÍ ESTÁ EL CAMBIO: Título de la marca en lugar del punto verde */}
                <div className="mb-4">
                  <h2 className="fw-bold text-success display-6 mb-0">ServiGo</h2>
                </div>
                
                <h4 className="fw-bold mb-3">¡Casi listo!</h4>
                <p className="text-muted px-3">
                  Para poder agendar la visita de <strong>{prestador.nombre}</strong> a tu domicilio, necesitamos que inicies sesión o crees una cuenta gratuita.
                </p>
                
                <div className="d-grid gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-success fw-bold py-2 rounded-pill shadow-sm"
                    onClick={() => {
                      setShowAuthModal(false);
                      setShowLoginModal(true);
                    }}
                  >
                    Iniciar Sesión
                  </button>
                  <Link
                    to="/registro"
                    className="btn btn-outline-success fw-bold py-2 rounded-pill"
                    onClick={() => setShowAuthModal(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <LoginModal show={showLoginModal} handleClose={() => setShowLoginModal(false)} />
    </div>
  );
};