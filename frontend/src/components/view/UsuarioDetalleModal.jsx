import React, { useState } from 'react';
import { bloquearUsuario, desbloquearUsuario, desactivarUsuario } from '../../serviceFront/adminService';

const UsuarioDetalleModal = ({ usuario, onClose, onActionComplete }) => {
  const [loading, setLoading] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleBloquear = async () => {
    try {
      setLoading(true);
      setError(null);
      await bloquearUsuario(usuario.idUsuario, motivo || 'Sin especificar');
      setSuccess('Usuario bloqueado exitosamente');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error al bloquear: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDesbloquear = async () => {
    try {
      setLoading(true);
      setError(null);
      await desbloquearUsuario(usuario.idUsuario);
      setSuccess('Usuario desbloqueado exitosamente');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error al desbloquear: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async () => {
    try {
      setLoading(true);
      setError(null);
      await desactivarUsuario(usuario.idUsuario, motivo || 'Sin especificar');
      setSuccess('Usuario desactivado exitosamente');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error al desactivar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Usuario</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="detail-grid">
            <div className="detail-item">
              <p className="detail-label">RUT</p>
              <p className="detail-value">{usuario.rut}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Nombre</p>
              <p className="detail-value">{usuario.nombre} {usuario.apellido}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Email</p>
              <p className="detail-value">{usuario.correo}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Teléfono</p>
              <p className="detail-value">{usuario.telefono}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Rol</p>
              <p className="detail-value">{usuario.rol}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Estado</p>
              <p className={`detail-value estado-${usuario.estado?.toLowerCase()}`}>
                {usuario.estado}
              </p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Región</p>
              <p className="detail-value">{usuario.region || '-'}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Comuna</p>
              <p className="detail-value">{usuario.comuna || '-'}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Correo Validado</p>
              <p className="detail-value">
                {usuario.correoValidado ? '✅ Sí' : '❌ No'}
              </p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Fecha Registro</p>
              <p className="detail-value">
                {new Date(usuario.fechaRegistro).toLocaleString('es-CL')}
              </p>
            </div>
          </div>

          <div className="acciones-usuario">
            <textarea
              placeholder="Motivo de la acción (opcional)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="motivo-textarea"
              rows="3"
            />

            <div className="button-group">
              {usuario.estado === 'bloqueado' ? (
                <button
                  className="btn btn-success"
                  onClick={handleDesbloquear}
                  disabled={loading}
                >
                  {loading ? 'Desbloqueando...' : '🔓 Desbloquear'}
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={handleBloquear}
                  disabled={loading}
                >
                  {loading ? 'Bloqueando...' : '🔒 Bloquear'}
                </button>
              )}

              <button
                className="btn btn-warning"
                onClick={handleDesactivar}
                disabled={loading}
              >
                {loading ? 'Desactivando...' : '🚫 Desactivar'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetalleModal;
