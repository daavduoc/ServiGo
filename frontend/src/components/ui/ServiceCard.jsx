import React from 'react';
import { Link } from 'react-router-dom';

export const ServiceCard = ({ nombre, profesion, area, precio, imagen }) => {
  // Le damos un color diferente a la etiqueta dependiendo si es de Salud o Técnica
  const badgeClass = area === 'Salud' ? 'bg-info' : 'bg-warning text-dark';

  return (
    <div className="card h-100 shadow-sm border-0 py-3 text-center">
      <div className="d-flex justify-content-center">
        <img 
          src={imagen || "https://via.placeholder.com/100"} 
          className="rounded-circle border border-3 border-light shadow-sm" 
          alt={nombre}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold mb-1">{nombre}</h5>
        <p className="text-muted small mb-2">{profesion}</p>
        <span className={`badge rounded-pill ${badgeClass} mb-3`}>{area}</span>
        {/* Usamos toLocaleString para que el precio se formatee como peso chileno */}
        <h6 className="fw-bold text-success">${precio.toLocaleString('es-CL')}</h6>
      </div>
      <div className="px-3">
        {/* CAMBIO AQUÍ: Reemplazamos el <button> por <Link> apuntando a tu nueva vista */}
        <Link to="/servicio-detalle" className="btn btn-outline-success w-100 rounded-pill">
          Ver Perfil
        </Link>
      </div>
    </div>
  );
};