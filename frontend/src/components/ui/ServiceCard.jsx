import React from 'react';
import { Link } from 'react-router-dom';

const PLACEHOLDER_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" fill="#e9ecef"/>' +
      '<circle cx="50" cy="38" r="18" fill="#adb5bd"/>' +
      '<ellipse cx="50" cy="78" rx="28" ry="18" fill="#adb5bd"/>' +
      '</svg>'
  );

export const ServiceCard = ({ idPrestador, nombre, profesion, area, precio, imagen, comuna }) => {
  const badgeClass = 'bg-success';

  const precioTexto =
    precio != null && precio > 0
      ? `$${Number(precio).toLocaleString('es-CL')}`
      : 'Consultar precio';

  const detalleLink = idPrestador ? `/servicio-detalle/${idPrestador}` : '/buscar';

  return (
    <div className="card h-100 shadow-sm border-0 py-3 text-center">
      <div className="d-flex justify-content-center">
        <img
          src={imagen || PLACEHOLDER_AVATAR}
          className="rounded-circle border border-3 border-light shadow-sm"
          alt={nombre}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_AVATAR;
          }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold mb-1">{nombre}</h5>
        <p className="text-muted small mb-2">{profesion}</p>
        {comuna && <p className="text-muted small mb-2">{comuna}</p>}
        <span className={`badge rounded-pill ${badgeClass} mb-3`}>{area}</span>
        <h6 className="fw-bold text-success">{precioTexto}</h6>
      </div>
      <div className="px-3">
        <Link to={detalleLink} className="btn btn-outline-success w-100 rounded-pill">
          Ver Perfil
        </Link>
      </div>
    </div>
  );
};
