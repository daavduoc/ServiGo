import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  obtenerCertificacionesPrestador,
  obtenerPrestadorValidacion,
  aprobarPrestador,
  rechazarPrestador,
} from '../../serviceFront/adminService';

const DetailItem = ({ label, value, fullWidth }) => (
  <div className={`detail-item${fullWidth ? ' full-width' : ''}`}>
    <p className="detail-label">{label}</p>
    <p className="detail-value">{value ?? '—'}</p>
  </div>
);

const formatFecha = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return value;
  }
};

const PrestadorValidacionModal = ({ prestador: prestadorInicial, onClose, onActionComplete }) => {
  const [tab, setTab] = useState('info');
  const [prestador, setPrestador] = useState(prestadorInicial);
  const [certificaciones, setCertificaciones] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(true);
  const [loadingAccion, setLoadingAccion] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const esEmpresa =
    prestador?.tipoPrestador &&
    String(prestador.tipoPrestador).toLowerCase() === 'empresa';

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setLoadingDetalle(true);
        const detalle = await obtenerPrestadorValidacion(prestadorInicial.idPrestador);
        setPrestador(detalle);
      } catch (err) {
        console.error(err);
        setPrestador(prestadorInicial);
      } finally {
        setLoadingDetalle(false);
      }
    };
    cargarDetalle();
  }, [prestadorInicial.idPrestador]);

  useEffect(() => {
    if (tab === 'certificaciones') {
      cargarCertificaciones();
    }
  }, [tab, prestador.idPrestador]);

  const cargarCertificaciones = async () => {
    try {
      setLoadingAccion(true);
      const data = await obtenerCertificacionesPrestador(prestador.idPrestador);
      setCertificaciones(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al cargar documentación');
    } finally {
      setLoadingAccion(false);
    }
  };

  const handleAprobar = async () => {
    try {
      setLoadingAccion(true);
      setError(null);
      await aprobarPrestador(prestador.idPrestador);
      setSuccess('Prestador aprobado. Ya puede operar en ServiGo.');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError(`Error al aprobar: ${err.message}`);
    } finally {
      setLoadingAccion(false);
    }
  };

  const handleRechazar = async () => {
    if (!motivo.trim()) {
      setError('Debe ingresar un motivo de rechazo');
      return;
    }
    try {
      setLoadingAccion(true);
      setError(null);
      await rechazarPrestador(prestador.idPrestador, motivo);
      setSuccess('Solicitud rechazada.');
      setTimeout(() => {
        onActionComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError(`Error al rechazar: ${err.message}`);
    } finally {
      setLoadingAccion(false);
    }
  };

  const modal = (
    <div className="admin-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="admin-modal-dialog admin-modal-dialog--lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-prestador-modal-title"
      >
        <div className="admin-modal-dialog__header">
          <h2 id="admin-prestador-modal-title">Validar registro: {prestador.nombrePrestador}</h2>
          <button type="button" className="admin-modal-dialog__close" onClick={onClose} aria-label="Cerrar">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="admin-modal-dialog__alerts">
          {error && <div className="alert alert-danger mb-2">{error}</div>}
          {success && <div className="alert alert-success mb-2">{success}</div>}
          <div className="alert alert-warning py-2 small mb-0">
            <i className="bi bi-hourglass-split me-1" aria-hidden="true" />
            Solicitud pendiente — el usuario fue informado de una revisión en hasta 24 horas hábiles.
          </div>
        </div>

        <div className="admin-modal-dialog__tabs">
          <button
            type="button"
            className={`admin-modal-tab${tab === 'info' ? ' is-active' : ''}`}
            onClick={() => setTab('info')}
          >
            Información
          </button>
          <button
            type="button"
            className={`admin-modal-tab${tab === 'certificaciones' ? ' is-active' : ''}`}
            onClick={() => setTab('certificaciones')}
          >
            Documentación ({prestador.certificacionesCount || 0})
          </button>
        </div>

        <div className="admin-modal-dialog__body">
          {loadingDetalle && (
            <p className="text-muted small text-center py-3 mb-0">
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
              Cargando detalle completo...
            </p>
          )}

          {tab === 'info' && (
            <>
              {prestador.urlFotoPerfil && (
                <div className="text-center mb-3">
                  <img
                    src={prestador.urlFotoPerfil}
                    alt="Foto de perfil"
                    className="rounded"
                    style={{ maxWidth: 120, maxHeight: 120, objectFit: 'cover' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              <div className="detail-grid">
                <DetailItem label="Estado" value={prestador.estadoValidacion} />
                <DetailItem
                  label="Tipo"
                  value={
                    esEmpresa ? 'Prestador establecido (empresa)' : 'Prestador a domicilio'
                  }
                />
                <DetailItem label="Correo" value={prestador.email} />
                <DetailItem label="Teléfono" value={prestador.telefono} />
                <DetailItem label="RUT (usuario)" value={prestador.rut} />
                <DetailItem
                  label="Correo verificado"
                  value={prestador.correoValidado ? 'Sí' : 'Pendiente'}
                />
                <DetailItem label="Categoría" value={prestador.categoriaPrestador} />
                <DetailItem
                  label="Especialidad"
                  value={
                    prestador.especialidad ||
                    (prestador.especialidadesServicios?.length
                      ? prestador.especialidadesServicios.join(', ')
                      : '—')
                  }
                />
                {!esEmpresa && (
                  <DetailItem
                    label="Fecha de nacimiento"
                    value={formatFecha(prestador.fechaNacimiento)}
                  />
                )}
                <DetailItem label="Región" value={prestador.region} />
                <DetailItem label="Comuna" value={prestador.comuna} />
                <DetailItem label="Dirección" value={prestador.direccion} fullWidth />
                <DetailItem
                  label="Fecha de registro"
                  value={formatFecha(prestador.fechaRegistro)}
                />
              </div>

              {esEmpresa && (
                <>
                  <h4 className="h6 text-success mt-4 mb-3">Datos de empresa</h4>
                  <div className="detail-grid">
                    <DetailItem label="Razón social" value={prestador.empresa} />
                    <DetailItem label="Nombre comercial" value={prestador.nombreComercial} />
                    <DetailItem label="RUT empresa" value={prestador.rutEmpresa} />
                    <DetailItem label="Giro comercial" value={prestador.giroComercial} />
                    <DetailItem label="Estado empresa" value={prestador.estadoEmpresa} />
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'certificaciones' && (
            <div className="certificaciones-list">
              {loadingAccion ? (
                <p>Cargando documentos...</p>
              ) : certificaciones.length > 0 ? (
                certificaciones.map((cert) => (
                  <div key={cert.idCertificacion} className="cert-item border rounded p-3 mb-2">
                    <h4 className="h6 mb-2">{cert.nombreDocumento || 'Documento'}</h4>
                    <p className="mb-1 small text-muted">
                      Estado: <strong>{cert.estado || 'pendiente'}</strong>
                      {cert.fechaSubida && (
                        <> · Subido: {formatFecha(cert.fechaSubida)}</>
                      )}
                    </p>
                    {cert.urlDocumento && (
                    <>
                      <a
                        href={cert.urlDocumento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-success"
                      >
                        <i className="bi bi-box-arrow-up-right me-1" aria-hidden="true" />
                        Ver / descargar archivo
                      </a>

                      {!esEmpresa &&
                        prestador?.especialidad === 'Kinesiología' && (
                          <div className="mt-2">
                            <a
                              href="https://rnpi.superdesalud.gob.cl/#"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-search me-1" aria-hidden="true" />
                              Verificar en Registro Nacional de Prestadores
                            </a>
                          </div>
                        )}
                    </>
                  )}
                  </div>
                ))
              ) : (
                <p className="text-muted">
                  {esEmpresa
                    ? 'No adjuntó documentación empresarial (opcional en el registro).'
                    : 'No adjuntó certificados obligatorios.'}
                </p>
              )}
            </div>
          )}

          <div className="acciones-prestador mt-4">
            <textarea
              placeholder="Motivo de rechazo (obligatorio si rechazas)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="motivo-textarea form-control"
              rows={3}
            />

            <div className="button-group d-flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleAprobar}
                disabled={loadingAccion}
              >
                {loadingAccion ? 'Procesando...' : 'Aprobar registro'}
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRechazar}
                disabled={loadingAccion}
              >
                Rechazar
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loadingAccion}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default PrestadorValidacionModal;
