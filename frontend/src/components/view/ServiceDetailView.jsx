import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerPrestadorPublico } from '../../serviceFront/prestadorService';

const PLACEHOLDER_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" fill="#e9ecef"/>' +
      '<circle cx="50" cy="38" r="18" fill="#adb5bd"/>' +
      '<ellipse cx="50" cy="78" rx="28" ry="18" fill="#adb5bd"/>' +
      '</svg>'
  );

const formatearPrecio = (precio) => {
  if (precio == null || precio <= 0) return 'Consultar precio';
  return `$${Number(precio).toLocaleString('es-CL')}`;
};

export const ServiceDetailView = () => {
  const { id } = useParams();
  const [prestador, setPrestador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false); 
  const [showAuthModal, setShowAuthModal] = useState(false);

  const bloquesHorarios = ['09:00', '11:00', '14:30', '16:30'];

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

  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  const fechaHoyString = `${anio}-${mes}-${dia}`;
  const horaActualString =
    String(hoy.getHours()).padStart(2, '0') + ':' + String(hoy.getMinutes()).padStart(2, '0');

  const handleAgendar = (e) => {
    e.preventDefault();
    if (!fechaSeleccionada || !horaSeleccionada) {
      alert('Por favor, selecciona una fecha y una hora para continuar.');
      return;
    }

    if (fechaSeleccionada === fechaHoyString && horaSeleccionada < horaActualString) {
      alert('El horario seleccionado ya ha pasado. Por favor, elige un bloque posterior.');
      return;
    }

    if (!usuarioAutenticado) {
      setShowAuthModal(true);
      return;
    }

    setMensajeExito(
      `¡Excelente! Tu solicitud con ${prestador.nombre} ha sido registrada para el ${fechaSeleccionada} a las ${horaSeleccionada} hrs. (Próximamente conectaremos la reserva al sistema).`
    );
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
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white h-100 border-top border-success border-4">
              <h4 className="fw-bold text-dark mb-3">📅 Agendar cita</h4>
              <p className="text-muted small mb-4">
                Selecciona fecha y hora para solicitar una cita con {prestador.nombre}.
              </p>

              <form onSubmit={handleAgendar}>
                <div className="mb-4">
                  <label htmlFor="fecha" className="form-label small fw-bold text-secondary">
                    1. Selecciona la fecha
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    className="form-control border-2 focus-success"
                    min={fechaHoyString}
                    value={fechaSeleccionada}
                    onChange={(e) => {
                      setFechaSeleccionada(e.target.value);
                      setHoraSeleccionada('');
                    }}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary d-block mb-2">
                    2. Selecciona una hora disponible
                  </label>
                  <div className="row g-2">
                    {bloquesHorarios.map((hora) => {
                      const esHoy = fechaSeleccionada === fechaHoyString;
                      const horaPasada = esHoy && hora < horaActualString;

                      return (
                        <div key={hora} className="col-6">
                          <button
                            type="button"
                            className={`btn w-100 py-2 rounded-3 fw-medium transition-all small ${
                              horaSeleccionada === hora
                                ? 'btn-success text-white shadow-sm'
                                : 'btn-outline-secondary border-2 hover-hour'
                            }`}
                            onClick={() => setHoraSeleccionada(hora)}
                            disabled={horaPasada}
                            style={horaPasada ? { cursor: 'not-allowed', opacity: 0.4 } : {}}
                          >
                            {horaPasada ? '❌ Pasado' : `🕒 ${hora} hrs`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="d-grid mt-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-success py-2 fw-bold text-white shadow-sm hover-btn-success"
                  >
                    {fechaSeleccionada && horaSeleccionada
                      ? `Confirmar para el ${fechaSeleccionada}`
                      : 'Selecciona fecha y hora'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🔽 MODAL DE AUTENTICACIÓN REQUERIDA ACTUALIZADO 🔽 */}
      {showAuthModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
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
                  <Link to="/login" className="btn btn-success fw-bold py-2 rounded-pill shadow-sm">
                    Iniciar Sesión
                  </Link>
                  <Link to="/registro" className="btn btn-outline-success fw-bold py-2 rounded-pill">
                    Registrarse
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 🔼 ----------------------------------- 🔼 */}

      <style>{`
        .hover-hour:hover:not(:disabled) {
          border-color: #198754 !important;
          color: #198754 !important;
          background-color: #f0fff4 !important;
        }
        .focus-success:focus {
          border-color: #198754 !important;
          box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25) !important;
        }
        .transition-all {
          transition: all 0.15s ease-in-out;
        }
        .hover-btn-success:hover {
          background-color: #157347;
        }
      `}</style>
    </div>
  );
};