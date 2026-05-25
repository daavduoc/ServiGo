// componente para el mapa
import React from 'react';

// Inicio seccion de verificación de geolocalización
export const GeolocalizacionSection = ({ direccionVisible }) => (
  <>
    <h5 className="registro-section-title mt-4">Verificación de geolocalización</h5>

    <div className="registro-cliente-geo-search mb-2">
      <div className="input-group registro-cliente-input-lg">
        <span className="input-group-text bg-white">
          <i className="bi bi-search text-muted" aria-hidden="true" />
        </span>
        <input
          type="text" className="form-control"
          value={direccionVisible} readOnly
          placeholder="Busca tu dirección o mueve el marcador en el mapa"
          aria-label="Dirección para ubicación en mapa"
        />
      </div>
    </div>

    <div className="registro-cliente-hint registro-cliente-hint--success mb-0">
      <i className="bi bi-check-circle-fill" aria-hidden="true" />
      <span>Ubica el marcador donde atiendes o desde donde operas tus servicios.</span>
    </div>
  </>
);
// Fin seccion de verificación de geolocalización