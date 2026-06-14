import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerPrestadorPublico } from '../../serviceFront/prestadorService';
import { crearReservaCliente, eliminarReservaCliente } from '../../serviceFront/reservaService';
import { formatFechaCitaLegible } from '../../utils/booking';
import { formatearPrecio } from '../../utils/formatPrice';
import { LoginModal } from '../ui/LoginModal';
import { MapSection } from '../ui/MapSection';
import { BookingForm } from './BookingForm';
import { FacialValidationModal } from '../camera/FacialValidationModal';
import { getReservaDetalle } from '../../serviceFront/validacionService';
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
  const { isAuthenticated, user } = useAuth();
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
  const [showFacialModal, setShowFacialModal] = useState(false);
  const [reservaCreadaId, setReservaCreadaId] = useState(null);
  const [solicitudAsociadaId, setSolicitudAsociadaId] = useState(null);

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

  const handleBookingSubmit = async (fecha, hora, idServicio) => {
    const tieneSesion = isAuthenticated && Boolean(localStorage.getItem('token'));
    if (!tieneSesion) {
      setShowAuthModal(true);
      return;
    }

    if (!prestador) return;

    const servicioElegido = idServicio
      ? prestador.servicios?.find((s) => s.idServicio === idServicio)
      : prestador.servicios?.[0];

    setReservando(true);
    setErrorReserva(null);

    try {
      const res = await crearReservaCliente({
        idPrestador: prestador.idPrestador,
        idServicio: servicioElegido?.idServicio ?? null,
        fecha,
        hora,
      });

      if (res && res.idReserva) {
        setReservaCreadaId(res.idReserva);
        
        // Consultar el detalle de la reserva para obtener el idSolicitud correspondiente
        const reservaDetalle = await getReservaDetalle(res.idReserva);
        if (reservaDetalle && reservaDetalle.solicitud) {
          setSolicitudAsociadaId(reservaDetalle.solicitud.idSolicitud);
          setReservaExito({
            nombre: prestador.nombre,
            fecha,
            hora,
            fechaLegible: formatFechaCitaLegible(fecha),
          });
          setShowFacialModal(true);
        } else {
          throw new Error("No se pudo obtener la solicitud asociada a la reserva.");
        }
      } else {
        throw new Error("No se pudo registrar la reserva. Intenta nuevamente.");
      }
    } catch (err) {
      setErrorReserva(err.message || 'No se pudo registrar la reserva. Intenta nuevamente.');
      setReservaCreadaId(null);
      setSolicitudAsociadaId(null);
    } finally {
      setReservando(false);
    }
  };

  const handleFacialSuccess = () => {
    setShowFacialModal(false);
    setMensajeExito(
      `Tu cita con ${prestador.nombre} quedó registrada para el ${reservaExito.fecha} a las ${reservaExito.hora} hrs. Puedes revisarla en Mis Horas y Reservas.`
    );
    setShowReservaExitoModal(true);
  };

  const handleFacialClose = async () => {
    setShowFacialModal(false);
    if (reservaCreadaId) {
      try {
        await eliminarReservaCliente(reservaCreadaId);
      } catch (e) {
        console.error("Error al cancelar la reserva incompleta:", e);
      }
    }
    setReservaCreadaId(null);
    setSolicitudAsociadaId(null);
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

  const esEmpresa =
    prestador.tipoPrestador?.toLowerCase() === 'empresa' ||
    Boolean(prestador.razonSocial || prestador.nombreComercial || prestador.giroComercial);
  const tituloServicio = esEmpresa
    ? prestador.giroComercial || 'Empresa establecida'
    : prestador.profesion || '';
  const descripcion =
    prestador.descripcion ||
    (esEmpresa
      ? `${prestador.nombre} ofrece servicios en ${prestador.comuna || 'tu comuna'}.`
      : `${prestador.nombre} ofrece servicios de ${prestador.profesion || 'su especialidad'} en ${prestador.comuna || 'tu comuna'}.`);

  const ubicacion = [prestador.comuna, prestador.region].filter(Boolean).join(', ');

  const esEstablecido = prestador.servicios?.some(s => s.modalidad === 'Establecido');
  const mostrarDireccionYMapa = esEmpresa || esEstablecido;

  // Construir la dirección completa para prestadores establecidos/empresa
  const direccionCompleta = prestador.direccionLocal || prestador.direccion || '';
  const direccionParaMapa = [direccionCompleta, prestador.comuna, prestador.region, 'Chile']
    .filter(Boolean)
    .join(', ');

  // Posición inicial para el mapa si hay coordenadas
  const initialMapPosition = (prestador.latitud != null && prestador.longitud != null)
    ? { lat: prestador.latitud, lng: prestador.longitud }
    : null;

  return (
    <div className="container py-4 servigo-detail-page">
      <div className="mb-3">
        <Link to="/buscar" className="servigo-detail-back text-decoration-none">
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
        <>
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="servigo-profile-card card border-0 shadow-sm bg-white h-100 overflow-hidden">
              <div className="servigo-profile-card__header">
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <img
                    src={prestador.imagen || PLACEHOLDER_AVATAR}
                    alt={prestador.nombre}
                    className="servigo-profile-card__avatar rounded-circle"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_AVATAR;
                    }}
                  />
                  <span className="servigo-profile-status badge bg-white rounded-pill shadow-sm">
                    <span className="servigo-status-dot" aria-hidden="true" />
                    Disponible
                  </span>
                </div>
              </div>

              <div className="card-body px-4 pb-4 pt-3">
                <h2 className="fw-bold text-dark mb-1">{prestador.nombre}</h2>
                {!esEmpresa && prestador.profesion && (
                  <p className="text-muted mb-2">{prestador.profesion}</p>
                )}
                {ubicacion && (
                  <p className="text-muted small mb-3">
                    <i className="bi bi-geo-alt-fill text-danger me-1" aria-hidden="true" />
                    {ubicacion.toUpperCase()}
                  </p>
                )}

                <div className="servigo-profile-highlight rounded-3 p-3 mb-3">
                  <div>
                    <strong className="text-dark d-block">{tituloServicio}</strong>
                    {prestador.area && (
                      <span className="text-muted small">{prestador.area}</span>
                    )}
                  </div>
                </div>

                <section className="servigo-profile-section border-top pt-3 mb-3">
                  <h6 className="servigo-profile-section__title">
                    <i className="bi bi-person" aria-hidden="true" />
                    Sobre mí
                  </h6>
                  <p className="text-secondary small lh-base mb-0">{descripcion}</p>
                  {prestador.experiencia && (
                    <p className="text-muted small mt-2 mb-0">
                      <i className="bi bi-briefcase me-1" aria-hidden="true" />
                      {prestador.experiencia}
                    </p>
                  )}
                </section>

                {prestador.servicios?.length > 0 && (
                  <section className="servigo-profile-section border-top pt-3 mb-3">
                    <h6 className="servigo-profile-section__title">
                      <i className="bi bi-star" aria-hidden="true" />
                      Servicios que ofrezco
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {prestador.servicios.map((servicio) => (
                        <span key={servicio.idServicio} className="servigo-profile-tag">
                          {servicio.nombre}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <div className="servigo-profile-price rounded-3 p-3 d-flex align-items-center gap-3 mt-2">
                  <span className="servigo-icon-badge" aria-hidden="true">
                    <i className="bi bi-tag" />
                  </span>
                  <div className="flex-grow-1">
                    <span className="servigo-profile-price__label d-block">DESDE</span>
                    <span className="servigo-profile-price__value">
                      {formatearPrecio(prestador.precio)}
                    </span>
                  </div>
                  <small className="text-muted text-end" style={{ maxWidth: '120px' }}>
                    Precio referencial según servicio
                  </small>
                </div>

                {/* Bloque de dirección y mapa para empresa / prestador establecido */}
                {mostrarDireccionYMapa && direccionCompleta && (
                  <section className="servigo-profile-section border-top pt-3 mt-3">
                    <h6 className="servigo-profile-section__title">
                      <i className="bi bi-building" aria-hidden="true" />
                      {esEmpresa ? 'Ubicación del Local' : 'Ubicación del Establecimiento'}
                    </h6>
                    <div className="bg-light rounded-3 p-3 mb-3 border-start border-primary border-3">
                      <p className="small mb-1">
                        <i className="bi bi-geo-alt-fill text-primary me-1" />
                        <strong>Dirección:</strong> {direccionCompleta}
                      </p>
                      {(prestador.comuna || prestador.region) && (
                        <p className="small text-muted mb-0">
                          {[prestador.comuna, prestador.region].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                    {/* Mapa miniatura de la ubicación del local */}
                    <MapSection
                      label=""
                      fullAddress={direccionParaMapa}
                      onCoordsChange={() => {}}
                      allowMarkerDrag={false}
                      initialPosition={initialMapPosition}
                      mapHint=""
                    />
                  </section>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            {errorReserva && (
              <div className="alert alert-danger small mb-3">{errorReserva}</div>
            )}
            <BookingForm
              prestador={prestador}
              precioReferencial={prestador.precio}
              onSubmit={handleBookingSubmit}
              submitting={reservando}
              resetKey={bookingResetKey}
            />
          </div>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-md-4">
            <div className="servigo-detail-trust text-center p-4 h-100">
              <div className="servigo-detail-trust-icon mb-3" aria-hidden="true">
                <i className="bi bi-shield-check" />
              </div>
              <h6>Pago seguro</h6>
              <p className="text-muted mb-0">
                Transacciones protegidas y proceso de reserva transparente.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="servigo-detail-trust text-center p-4 h-100">
              <div className="servigo-detail-trust-icon mb-3" aria-hidden="true">
                <i className="bi bi-chat-dots" />
              </div>
              <h6>Comunicación directa</h6>
              <p className="text-muted mb-0">
                Contacta al especialista y coordina los detalles de tu servicio.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="servigo-detail-trust text-center p-4 h-100">
              <div className="servigo-detail-trust-icon mb-3" aria-hidden="true">
                <i className="bi bi-patch-check" />
              </div>
              <h6>Especialistas verificados</h6>
              <p className="text-muted mb-0">
                Profesionales revisados para brindarte mayor confianza.
              </p>
            </div>
          </div>
        </div>
        </>
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
      <FacialValidationModal
        isOpen={showFacialModal}
        onClose={handleFacialClose}
        onValidationSuccess={handleFacialSuccess}
        idUsuario={user?.idUsuario}
        tipoValidacion="cliente"
        idSolicitud={solicitudAsociadaId}
      />
    </div>
  );
};