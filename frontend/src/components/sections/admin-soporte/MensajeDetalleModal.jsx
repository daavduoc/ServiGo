import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { responderMensajeAdmin, actualizarEstadoMensajeAdmin, eliminarMensajeAdmin } from '../../../serviceFront/adminService';

const formatFecha = (value) => {
  if (!value) return '—';
  if (Array.isArray(value)) {
    try {
      const [y, m, d, h = 0, min = 0] = value;
      return new Date(y, m - 1, d, h, min).toLocaleDateString('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return '—'; }
  }
  try {
    return new Date(value).toLocaleDateString('es-CL', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return '—'; }
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

const tipoLabel = (tipo) => {
  const map = {
    cita: 'Problema con una cita',
    reconocimiento: 'Problema con reconocimiento facial',
    otro: 'Otro problema',
  };
  return map[tipo] || tipo;
};

const rolLabel = (rol) => {
  if (!rol) return '—';
  const map = { CLIENTE: 'Cliente', PRESTADOR: 'Prestador' };
  return map[rol] || rol;
};

const MensajeDetalleModal = ({ mensaje, onClose, onActionComplete }) => {
  const [respuesta, setRespuesta] = useState(mensaje.respuesta || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      setLoading(true);
      setError(null);
      await actualizarEstadoMensajeAdmin(mensaje.idMensaje, nuevoEstado);
      const estadoLabels = { en_proceso: 'En proceso', resuelto: 'Resuelto', pendiente: 'Pendiente' };
      setSuccess(`Estado cambiado a "${estadoLabels[nuevoEstado] || nuevoEstado}"`);
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResponder = async () => {
    if (!respuesta.trim()) {
      setError('La respuesta no puede estar vacía');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await responderMensajeAdmin(mensaje.idMensaje, respuesta);
      setSuccess('Respuesta enviada exitosamente');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await eliminarMensajeAdmin(mensaje.idMensaje);
      setSuccess('Mensaje eliminado');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1000);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <div className="admin-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="admin-modal-dialog admin-modal-dialog--lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-soporte-modal-title"
      >
        <div className="admin-modal-dialog__header">
          <h2 id="admin-soporte-modal-title">Mensaje de soporte #{mensaje.idMensaje}</h2>
          <button type="button" className="admin-modal-dialog__close" onClick={onClose} aria-label="Cerrar">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="admin-modal-dialog__alerts">
          {error && <div className="alert alert-danger mb-2">{error}</div>}
          {success && <div className="alert alert-success mb-2">{success}</div>}
        </div>

        <div className="admin-modal-dialog__body">
          <div className="detail-grid">
            <div className="detail-item">
              <p className="detail-label">Remitente</p>
              <p className="detail-value">{mensaje.nombreRemitente || '—'}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Correo</p>
              <p className="detail-value">{mensaje.correoRemitente || '—'}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Rol</p>
              <p className="detail-value">{rolLabel(mensaje.rolRemitente)}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Estado</p>
              <p className="detail-value">{estadoBadge(mensaje.estado)}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Tipo de problema</p>
              <p className="detail-value">{tipoLabel(mensaje.tipoProblema)}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Fecha de creación</p>
              <p className="detail-value">{formatFecha(mensaje.fechaCreacion)}</p>
            </div>
            <div className="detail-item full-width">
              <p className="detail-label">Asunto</p>
              <p className="detail-value">{mensaje.asunto || '—'}</p>
            </div>
            <div className="detail-item full-width">
              <p className="detail-label">Descripción</p>
              <p className="detail-value" style={{ whiteSpace: 'pre-line' }}>{mensaje.descripcion || '—'}</p>
            </div>
            {mensaje.respuesta && (
              <div className="detail-item full-width">
                <p className="detail-label">Respuesta anterior</p>
                <p className="detail-value" style={{ whiteSpace: 'pre-line' }}>{mensaje.respuesta}</p>
              </div>
            )}
            {mensaje.fechaActualizacion && (
              <div className="detail-item">
                <p className="detail-label">Última actualización</p>
                <p className="detail-value">{formatFecha(mensaje.fechaActualizacion)}</p>
              </div>
            )}
          </div>

          {mensaje.estado !== 'resuelto' && (
            <div className="acciones-soporte mt-4">
              <label htmlFor="respuesta-soporte" className="form-label small fw-bold text-secondary">
                Responder al mensaje
              </label>
              <textarea
                id="respuesta-soporte"
                className="form-control border-2"
                placeholder="Escribe tu respuesta..."
                rows={4}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              />

              <div className="d-flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleResponder}
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar respuesta'}
                </button>

                <button
                  type="button"
                  className="btn btn-info text-dark"
                  onClick={() => handleCambiarEstado('resuelto')}
                  disabled={loading}
                >
                  Resuelto
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleEliminar}
                  disabled={loading}
                >
                  Eliminar
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {mensaje.estado === 'resuelto' && (
            <div className="mt-4">
              <div className="alert alert-success mb-3">
                <i className="bi bi-check-circle me-1" aria-hidden="true" />
                Este mensaje ya fue resuelto.
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleEliminar}
                  disabled={loading}
                >
                  Eliminar mensaje
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default MensajeDetalleModal;
