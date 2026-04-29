import React from 'react';
import { Link } from 'react-router-dom';

export const AuthButtons = () => {
  return (
    <div className="d-flex gap-2">
      <Link to="/login" className="btn btn-outline-primary fw-bold">
        Iniciar Sesión
      </Link>
      <Link to="/registro" className="btn btn-primary fw-bold">
        Registrarse
      </Link>
    </div>
  );
};