import React, { useState, useEffect } from 'react';
import { 
  obtenerCertificacionesPrestador, 
  aprobarPrestador, 
  rechazarPrestador 
} from '../../serviceFront/adminService';

const PrestadorValidacionModal = ({ prestador, onClose, onActionComplete }) => {
  const [tab, setTab] = useState('info'); // info, certificaciones, resenas
  const [certificaciones, setCertificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (tab === 'certificaciones') {
      cargarCertificaciones();
    }
  }, [tab]);

  const cargarCertificaciones = async () => {
    try {
      setLoading(true);
      const data = await obtenerCertificacionesPrestador(prestador.idPrestador);
      setCertificaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Error al cargar certificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async () => {
    try {
      setLoading(true);
      setError(null);
      await aprobarPrestador(prestador.idPrestador);
      setSuccess('Prestador aprobado exitosamente');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error al aprobar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!motivo.trim()) {
      setError('Debe ingresar un motivo de rechazo');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await rechazarPrestador(prestador.idPrestador, motivo);
      setSuccess('Prestador rechazado exitosamente');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error al rechazar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Validación de Prestador: {prestador.nombrePrestador}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="modal-tabs">
          <button 
            className={`tab ${tab === 'info' ? 'active' : ''}`}
            onClick={() => setTab('info')}
          >
            📋 Información
          </button>
          <button 
            className={`tab ${tab === 'certificaciones' ? 'active' : ''}`}
            onClick={() => setTab('certificaciones')}
          >
            🏆 Certificaciones ({prestador.certificacionesCount || 0})
          </button>
          <button 
            className={`tab ${tab === 'resenas' ? 'active' : ''}`}
            onClick={() => setTab('resenas')}
          >
            ⭐ Reseñas
          </button>
        </div>

        <div className="modal-body">
          {tab === 'info' && (
            <div className="detail-grid">
              <div className="detail-item">
                <p className="detail-label">Nombre</p>
                <p className="detail-value">{prestador.nombrePrestador}</p>
              </div>

              <div className="detail-item">
                <p className="detail-label">Email</p>
                <p className="detail-value">{prestador.email}</p>
              </div>

              <div className="detail-item">
                <p className="detail-label">Teléfono</p>
                <p className="detail-value">{prestador.telefono}</p>
              </div>

              <div className="detail-item">
                <p className="detail-label">Especialidad</p>
                <p className="detail-value">{prestador.especialidad}</p>
              </div>

              <div className="detail-item">
                <p className="detail-label">Categoría</p>
                <p className="detail-value">{prestador.categoria || '-'}</p>
              </div>

              <div className="detail-item">
                <p className="detail-label">Tipo de Prestador</p>
                <p className="detail-value">{prestador.tipoPrestador || '-'}</p>
              </div>

              <div className="detail-item">
                <p className="detail-label">Años de Experiencia</p>
                <p className="detail-value">{prestador.experiencia || '-'}</p>
              </div>

              <div className="detail-item">
                <p className="detail-label">Empresa</p>
                <p className="detail-value">{prestador.empresa || '-'}</p>
              </div>

              <div className="detail-item full-width">
                <p className="detail-label">Descripción</p>
                <p className="detail-value">{prestador.descripcion || '-'}</p>
              </div>

              <div className="detail-item">
                <p className="detail-label">Estado Validación</p>
                <p className={`detail-value estado-${prestador.estadoValidacion?.toLowerCase()}`}>
                  {prestador.estadoValidacion}
                </p>
              </div>
            </div>
          )}

          {tab === 'certificaciones' && (
            <div className="certificaciones-list">
              {loading ? (
                <p>Cargando certificaciones...</p>
              ) : certificaciones.length > 0 ? (
                certificaciones.map((cert, idx) => (
                  <div key={idx} className="cert-item">
                    <h4>{cert.nombre}</h4>
                    <p><strong>Institución:</strong> {cert.institucion}</p>
                    <p><strong>Fecha:</strong> {new Date(cert.fechaObtencion).toLocaleDateString('es-CL')}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted">No hay certificaciones registradas</p>
              )}
            </div>
          )}

          {tab === 'resenas' && (
            <div className="resenas-list">
              <p className="text-muted">Reseñas no disponibles en esta versión</p>
            </div>
          )}

          <div className="acciones-prestador">
            <textarea
              placeholder="Motivo de rechazo (requerido si rechaza)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="motivo-textarea"
              rows="3"
            />

            <div className="button-group">
              <button
                className="btn btn-success"
                onClick={handleAprobar}
                disabled={loading}
              >
                {loading ? 'Aprobando...' : '✅ Aprobar'}
              </button>

              <button
                className="btn btn-danger"
                onClick={handleRechazar}
                disabled={loading}
              >
                {loading ? 'Rechazando...' : '❌ Rechazar'}
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

export default PrestadorValidacionModal;
