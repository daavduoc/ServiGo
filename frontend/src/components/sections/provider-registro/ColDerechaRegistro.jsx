// componente para la columna derecha del registro (foto y mapa)
import React from 'react';
import { PhotoUpload } from '../../ui/PhotoUpload';
import { MapSection }  from '../../ui/MapSection';

// Inicio seccion de columna derecha del registro (foto y mapa)
export const ColDerechaRegistro = ({
  esEmpresa,
  nombrePreview,
  direccionParaMapa,
  onFotoSelect,
  onCoordsChange,
  fotoBiometrica,
  onOpenBiometricModal,
  biometricRejected,
}) => (
  <div className="col-lg-5 registro-cliente-col-right">

    {/* Sección de foto biométrica: solo se muestra para prestadores particulares, no para empresa */}
    {!esEmpresa && (
      <div className="card shadow-sm rounded-4 border-0 mb-4 p-4">
        <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
          <div>
            <p className="text-uppercase small text-secondary fw-semibold mb-2">Foto biométrica obligatoria</p>
            <p className="mb-0 small text-muted">
              Esta imagen solo se usa para tu validación futura. No reemplaza la foto de perfil.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={onOpenBiometricModal}
            style={{ minWidth: '120px' }}
          >
            {fotoBiometrica ? 'Repetir foto' : 'Tomar foto'}
          </button>
        </div>
        {fotoBiometrica ? (
          <div className="d-flex align-items-center gap-3">
            <img
              src={fotoBiometrica}
              alt="Foto biométrica tomada"
              className="rounded-4 shadow-sm"
              style={{ width: '100px', height: '100px', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
            <div>
              <p className="mb-1 fw-semibold">Foto biométrica lista</p>
              <p className="mb-0 small text-success">Continúa con el resto del registro.</p>
            </div>
          </div>
        ) : (
          <p className="mb-0 small text-muted">
            Presiona el botón para abrir la cámara y capturar tu foto biométrica.
          </p>
        )}
        {biometricRejected && (
          <div className="alert alert-warning mt-3 mb-0" role="alert">
            Si rechazas la foto no podrás registrarte.
          </div>
        )}
      </div>
    )}

    {/* Inicio seccion de subida de foto de perfil */}
    <PhotoUpload
      label={esEmpresa ? 'Logo de la empresa' : 'Foto de perfil'}
      variant={esEmpresa ? 'empresa' : 'person'}
      onImageSelect={onFotoSelect}
      dropzoneTitle={esEmpresa ? 'Sube el logo de tu empresa' : 'Sube tu foto de perfil'}
    />
    {/* Fin seccion de subida de foto de perfil */}

    {/* Inicio seccion de previsualización de empresa */}
    {esEmpresa && (
      <div className="registro-empresa-preview">
        <p className="registro-empresa-preview__label mb-0">Vista previa</p>
        <div className="registro-empresa-preview__body mt-2">
          <div className="registro-empresa-preview__icon" aria-hidden="true">
            <i className="bi bi-building" />
          </div>
          <div>
            <p className="registro-empresa-preview__name">{nombrePreview}</p>
            <span className="badge badge-pendiente rounded-pill">Pendiente</span>
          </div>
        </div>
      </div>
    )}
    {/* Fin seccion de previsualización de empresa */}

    {/* Inicio seccion de mapa */}
    <MapSection
      label="Ubicación en el mapa"
      fullAddress={direccionParaMapa}
      onCoordsChange={onCoordsChange}
      mapHint="Puedes mover el marcador para ajustar tu ubicación exacta."
      mapClassName="map-section-map"
      allowMarkerDrag
    />
    {/* Fin seccion de mapa*/}

  </div>
);
// Fin seccion de columna derecha del registro