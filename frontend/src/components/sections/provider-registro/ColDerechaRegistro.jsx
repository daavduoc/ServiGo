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
}) => (
  <div className="col-lg-5 registro-cliente-col-right">

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