import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración de iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Componente para animar el vuelo de la cámara
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, 15, { animate: true, duration: 1.5 });
    return null;
}

export const MapSection = ({ label, fullAddress, onCoordsChange }) => {
    // se deja Santiago centro por defecto
    const [position, setPosition] = useState([-33.4489, -70.6693]);
    const [isSearching, setIsSearching] = useState(false);

    // correciones en los campos de Region, comuna y calle 
    useEffect(() => {
        // Limpia la dirección de comas vacías (por si el usuario aún no llena los campos)
        const direccionLimpia = fullAddress.replace(/,\s*,/g, ',').trim();

        // Si la dirección es muy corta (ej: ", , Chile"), no  se nada en el mapa
        if (direccionLimpia.length < 10) return;

        setIsSearching(true);

        // configura un temporizador. Espera 1.5 segundos después de la última tecla para que de tiempo de rellenar campos de direccion.
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
                console.error("Error al buscar dirección:", error);
            } finally {
                setIsSearching(false);
            }
        }, 1500);
        // 1500 milisegundos = 1.5 segundos

        // Si el usuario vuelve a escribir antes de 1.5 seg, se cancela la búsqueda anterior automatica
        return () => clearTimeout(temporizador);

    }, [fullAddress]); // Esto hace que el código escuche cada vez que la direccion completa o fullAddress cambia

    return (
        <div className="mb-4">
            <label className="form-label fw-bold d-flex justify-content-between align-items-center">
                {label}
                {/* Pequeño indicador visual de que está buscando */}
                {isSearching && <span className="badge bg-primary rounded-pill fw-normal">Ubicando...</span>}
            </label>

            <div className="input-group mb-2">
                <span className="input-group-text bg-white">
                    <i className="bi bi-geo-alt text-primary"></i>
                </span>
                {/* Mostramos la dirección que el mapa está leyendo en tiempo real */}
                <input
                    type="text"
                    className="form-control bg-light text-muted"
                    value={fullAddress.replace(/,\s*,/g, ',').replace(/^,\s*/, '')} // Texto limpio
                    readOnly
                />
            </div>

            <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={position} icon={DefaultIcon} />
                    <ChangeView center={position} />
                </MapContainer>
            </div>
        </div>
    );
};