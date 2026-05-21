import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundView = () => (
  <div className="text-center py-5">
    <h1 className="display-6 fw-bold mb-3">Página no encontrada</h1>
    <p className="text-muted mb-4">La ruta que buscas no existe o fue movida.</p>
    <div className="d-flex flex-wrap justify-content-center gap-2">
      <Link to="/" className="btn btn-outline-secondary">
        Ir al inicio
      </Link>
      <Link to="/registro" className="btn btn-success">
        Crear cuenta
      </Link>
    </div>
  </div>
);
