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
  useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true, duration: 1.5 });
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [center, map]);
  return null;
}

export const MapSection = ({
  label,
  fullAddress,
  onCoordsChange,
  mapHint,
  mapClassName = '',
  allowMarkerDrag = false,
  manualLoad = false, // <-- NUEVA PROP (Por defecto false para no romper los registros)
}) => {
  const [position, setPosition] = useState([-33.4489, -70.6693]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Si manualLoad es true, el mapa parte inactivo. Si es false, se activa al tiro.
  const [mapaActivo, setMapaActivo] = useState(!manualLoad);

  // BUSCADOR AUTOMÁTICO (Solo funciona si manualLoad es false)
  useEffect(() => {
    if (manualLoad) return; 

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
  }, [fullAddress, onCoordsChange, manualLoad]);

  // BUSCADOR MANUAL (Se dispara al presionar el botón)
  const handleBuscarManual = async () => {
    const direccionLimpia = fullAddress.replace(/,\s*,/g, ',').trim();
    if (!direccionLimpia || direccionLimpia.length < 5) {
      alert('Por favor, ingresa una dirección válida.');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionLimpia)}`
      );
      const data = await response.json();

      if (data && data[0]) {
        const newPos = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setPosition(newPos);
        onCoordsChange({ lat: newPos[0], lng: newPos[1] });
        setMapaActivo(true);
      } else {
        alert('No se encontró la dirección exacta. Cargando mapa para ajuste manual.');
        setMapaActivo(true);
      }
    } catch (error) {
      console.error('Error en búsqueda manual:', error);
    } finally {
      setIsSearching(false);
    }
  };

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
          <span className="badge bg-success rounded-pill fw-normal animate__animated animate__pulse animate__infinite">
            Buscando...
          </span>
        )}
      </label>

      {/* RENDER CONDICIONAL */}
      {!mapaActivo ? (
        <div 
          className="d-flex flex-column align-items-center justify-content-center border rounded-3 p-5 bg-light"
          style={{ minHeight: '300px' }}
        >
          <i className="bi bi-geo-alt-fill text-success fs-1 mb-3" />
          <p className="text-muted text-center small mb-4" style={{ maxWidth: '400px' }}>
            Dirección: <strong>{fullAddress.replace(/,\s*,/g, ',').trim()}</strong>. 
            Confirma tu dirección para cargar el mapa e indicar tu ubicación aproximada.
          </p>
          <button
            type="button"
            onClick={handleBuscarManual}
            disabled={isSearching}
            className="btn btn-success text-white fw-bold px-4 rounded-pill shadow-sm"
          >
            {isSearching ? 'Buscando...' : 'Confirmar Dirección y Cargar Mapa'}
          </button>
        </div>
      ) : (
        <div>
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
            </MapContainer>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-2">
            {mapHint && (
              <div className="registro-cliente-hint registro-cliente-hint--info m-0 p-2">
                <i className="bi bi-info-circle" aria-hidden="true" />
                <span className="small">{mapHint}</span>
              </div>
            )}
            {/* Si es carga manual, mostramos botón para re-buscar si lo desean */}
            {manualLoad && (
              <button
                type="button"
                onClick={handleBuscarManual}
                className="btn btn-link text-success text-decoration-none p-0 small fw-bold"
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-arrow-clockwise me-1" /> Re-ubicar dirección
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};