import React, { useState } from 'react';
import { ButtonCustom } from '../ui/ButtonCustom';
import { enviarMensajeSoporte, obtenerMisMensajes } from '../../serviceFront/soporteService';

const tipoProblemaLabel = (tipo) => {
  const map = {
    cita: 'Problema con una cita',
    reconocimiento: 'Problema con reconocimiento facial',
    otro: 'Otro problema',
  };
  return map[tipo] || tipo;
};

const estadoBadge = (estado) => {
  const map = {
    pendiente: 'bg-warning text-dark',
    en_proceso: 'bg-info text-dark',
    resuelto: 'bg-success',
  };
  const labelMap = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    resuelto: 'Resuelto',
  };
  return (
    <span className={`badge ${map[estado] || 'bg-secondary'} rounded-pill`}>
      {labelMap[estado] || estado}
    </span>
  );
};

const formatFecha = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) {
    try {
      const [y, m, d] = value;
      return new Date(y, m - 1, d).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }
  try {
    return new Date(value).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const SupportView = () => {
  const [tipoProblema, setTipoProblema] = useState('cita');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMensaje('');

    if (!asunto.trim() || !descripcion.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      await enviarMensajeSoporte({ tipoProblema, asunto, descripcion });
      setMensaje('Tu reporte ha sido enviado exitosamente. Nuestro equipo de soporte lo revisará.');
      setAsunto('');
      setDescripcion('');
      setTipoProblema('cita');
    } catch (err) {
      setError(err.message || 'Error al enviar el reporte. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorial = async () => {
    try {
      setLoadingHistorial(true);
      const data = await obtenerMisMensajes();
      setHistorial(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar historial:', err);
    } finally {
      setLoadingHistorial(false);
    }
  };

  const toggleHistorial = () => {
    if (!mostrarHistorial) {
      cargarHistorial();
    }
    setMostrarHistorial(!mostrarHistorial);
  };

  return (
    <div className="support-view container py-4" style={{ maxWidth: '750px' }}>
      <div className="card shadow-sm border-0 rounded-3 p-4 bg-white mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-2 mb-3 profile-panel-title">
            <i className="bi bi-headset" aria-hidden="true" />
            <h4 className="m-0">Centro de Ayuda y Soporte</h4>
          </div>

          <p className="text-muted small mb-4 lh-base">
            Tu experiencia nos importa. Si encuentras algún inconveniente con tus citas o el reconocimiento facial, háznoslo saber aquí. Nuestro equipo de soporte está listo para escucharte y ayudarte a resolverlo lo antes posible.
          </p>

          <hr className="text-muted mb-4" />

          {error && (
            <div className="alert alert-danger border-0 shadow-sm p-2 rounded-3 small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="tipoProblema" className="form-label small fw-bold text-secondary">
                Tipo de problema
              </label>
              <select
                id="tipoProblema"
                className="form-select border-2"
                value={tipoProblema}
                onChange={(event) => setTipoProblema(event.target.value)}
              >
                <option value="cita">Problema con una cita</option>
                <option value="reconocimiento">Problema con reconocimiento facial</option>
                <option value="otro">Otro problema</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="asunto" className="form-label small fw-bold text-secondary">
                Asunto
              </label>
              <input
                id="asunto"
                type="text"
                className="form-control border-2"
                placeholder="Describe brevemente el problema"
                value={asunto}
                onChange={(event) => setAsunto(event.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="descripcion" className="form-label small fw-bold text-secondary">
                Descripción detallada
              </label>
              <textarea
                id="descripcion"
                className="form-control border-2"
                placeholder="Explica lo que sucedió paso a paso..."
                rows={4}
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                required
              />
            </div>

            <div className="d-grid mb-2">
              <ButtonCustom
                texto={loading ? 'Enviando...' : 'Enviar reporte'}
                tipo="submit"
                color="success"
              />
            </div>

            {mensaje && (
              <div className="alert alert-success border-0 shadow-sm mt-3 p-2 rounded-3 d-flex align-items-center small" role="alert">
                <span className="fs-6 me-2">&#10003;</span>
                <div>{mensaje}</div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2 profile-panel-title">
              <i className="bi bi-clock-history" aria-hidden="true" />
              <h5 className="m-0">Mis reportes</h5>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-success rounded-pill px-3"
              onClick={toggleHistorial}
            >
              {mostrarHistorial ? 'Ocultar' : 'Ver historial'}
            </button>
          </div>

          {mostrarHistorial && (
            <>
              {loadingHistorial ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="text-muted small mt-2 mb-0">Cargando tus reportes...</p>
                </div>
              ) : historial.length === 0 ? (
                <p className="text-muted small mb-0">No has enviado reportes aún.</p>
              ) : (
                <div className="list-group">
                  {historial.map((msg) => (
                    <div key={msg.idMensaje} className="list-group-item list-group-item-action border rounded mb-2">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0 fw-semibold">{msg.asunto}</h6>
                        {estadoBadge(msg.estado)}
                      </div>
                      <p className="mb-1 small text-muted">{tipoProblemaLabel(msg.tipoProblema)}</p>
                      <p className="mb-1 small">
                        {msg.descripcion?.length > 100
                          ? msg.descripcion.substring(0, 100) + '...'
                          : msg.descripcion}
                      </p>
                      {msg.respuesta && (
                        <div className="alert alert-success p-2 mb-1 small">
                          <strong>Respuesta:</strong> {msg.respuesta}
                        </div>
                      )}
                      <small className="text-muted">{formatFecha(msg.fechaCreacion)}</small>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportView;
