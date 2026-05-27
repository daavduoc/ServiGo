import React from 'react';
import { MapSection } from '../../ui/MapSection';

export const UbicacionSection = ({ user, coordenadas, setCoordenadas }) => {
  const region = user?.region || '';
  const comuna = user?.comuna || '';
  const direccion = user?.direccion || '';

  const initialPosition = (user?.latitud != null && user?.longitud != null)
    ? { lat: user.latitud, lng: user.longitud }
    : null;

  return (
    <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
      <h4 className="profile-panel-title mb-4">
        <i className="bi bi-geo-alt" />
        Ubicación del Servicio
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
          <label className="form-label fw-bold">Dirección</label>
          <input
            type="text"
            className="form-control bg-light"
            value={direccion}
            readOnly
            disabled
          />
        </div>
      </div>

      <MapSection
        label="Ubicación Prestador Aproximada"
        fullAddress={`${direccion}, ${comuna}, ${region}, Chile`}
        onCoordsChange={setCoordenadas}
        allowMarkerDrag={true}
        mapHint="El marcador del mapa se genera en base a tu dirección de perfil registrada"
        initialPosition={initialPosition}
      />
    </div>
  );
};
