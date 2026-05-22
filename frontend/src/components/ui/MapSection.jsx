import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 15, { animate: true, duration: 1.5 });
  return null;
}

function MapFocusGuard() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    container.setAttribute('tabindex', '-1');
    if (document.activeElement === container) {
      container.blur();
    }

    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(frame);
  }, [map]);

  return null;
}

export const MapSection = ({
  label,
  fullAddress,
  onCoordsChange,
  mapHint,
  mapClassName = '',
  allowMarkerDrag = false,
}) => {
  const [position, setPosition] = useState([-33.4489, -70.6693]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const direccionLimpia = fullAddress.replace(/,\s*,/g, ',').trim();

    if (direccionLimpia.length < 10) return;

    setIsSearching(true);

    const temporizador = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionLimpia)}`
        );
        const data = await response.json();

        if (data && data[0]) {
          const newPos = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setPosition(newPos);
          onCoordsChange({ lat: newPos[0], lng: newPos[1] });
        }
      } catch (error) {
        console.error('Error al buscar dirección:', error);
      } finally {
        setIsSearching(false);
      }
    }, 1500);

    return () => clearTimeout(temporizador);
  }, [fullAddress, onCoordsChange]);

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    const newPos = [lat, lng];
    setPosition(newPos);
    onCoordsChange({ lat, lng });
  };

  return (
    <div className="mb-4 registro-cliente-map-wrap">
      <label className="form-label fw-bold d-flex justify-content-between align-items-center">
        {label}
        {isSearching && (
          <span className="badge bg-success rounded-pill fw-normal">Ubicando...</span>
        )}
      </label>
      <div
        className={`map-section-map ${mapClassName}`.trim()}
        style={{
          height: '300px',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #dee2e6',
        }}
      >
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker
            position={position}
            icon={DefaultIcon}
            draggable={allowMarkerDrag}
            eventHandlers={allowMarkerDrag ? { dragend: handleMarkerDragEnd } : undefined}
          />
          <ChangeView center={position} />
          <MapFocusGuard />
        </MapContainer>
      </div>
      {mapHint && (
        <div className="registro-cliente-hint registro-cliente-hint--info mt-2">
          <i className="bi bi-info-circle" aria-hidden="true" />
          <span>{mapHint}</span>
        </div>
      )}
    </div>
  );
};
