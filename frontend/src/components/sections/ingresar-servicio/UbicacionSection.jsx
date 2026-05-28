import React from 'react';
import { MapSection } from '../../ui/MapSection';

export const UbicacionSection = ({ user, coordenadas, setCoordenadas, esEmpresa }) => {
  const region = user?.region || '';
  const comuna = user?.comuna || '';
  // Para empresas, usar direccionLocal como fallback si direccion está vacío
  const direccion = user?.direccion || user?.direccionLocal || '';

  const initialPosition = (user?.latitud != null && user?.longitud != null)
    ? { lat: user.latitud, lng: user.longitud }
    : null;

  return (
    <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
      <h4 className="profile-panel-title mb-4">
        <i className="bi bi-geo-alt" />
        {esEmpresa ? 'Ubicación del Local / Sede' : 'Ubicación del Servicio'}
      </h4>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label fw-bold">Región</label>
          <input
            type="text"
            className="form-control bg-light"
            value={region}
            readOnly
            disabled
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Comuna</label>
          <input
            type="text"
            className="form-control bg-light"
            value={comuna}
            readOnly
            disabled
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">
            {esEmpresa ? 'Dirección del Local' : 'Dirección'}
          </label>
          <input
            type="text"
            className="form-control bg-light"
            value={direccion}
            readOnly
            disabled
          />
        </div>
      </div>

      {/* Alerta si no se ha registrado dirección aún */}
      {!direccion && !region && (
        <div className="alert alert-warning small mb-3">
          <i className="bi bi-exclamation-triangle me-2" />
          No se encontró dirección en tu perfil. Actualiza tu perfil con tu dirección para que aparezca aquí y en el mapa.
        </div>
      )}

      <MapSection
        label={esEmpresa ? 'Ubicación del Local / Sede Aproximada' : 'Ubicación Prestador Aproximada'}
        fullAddress={`${direccion}, ${comuna}, ${region}, Chile`}
        onCoordsChange={setCoordenadas}
        allowMarkerDrag={true}
        mapHint={esEmpresa
          ? 'El marcador del mapa se genera en base a la dirección del local registrada en tu perfil'
          : 'El marcador del mapa se genera en base a tu dirección de perfil registrada'
        }
        initialPosition={initialPosition}
      />
    </div>
  );
};