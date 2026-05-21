import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import { useAuth } from '../../context/AuthContext';
import { getDisplayName } from '../../utils/userDisplay';

export const AuthButtons = () => {
  // 1. Estado local: generamos un switch para mostrar u ocultar el boton de Iniciar Sesión
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted d-none d-md-inline">
          Bienvenido, <strong>{getDisplayName(user)}</strong>
        </span>
        <Link to="/perfil" className="btn btn-outline-success btn-sm fw-bold">
          Mi Perfil
        </Link>
        <button className="btn btn-outline-danger btn-sm fw-bold" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // 4. Si NO hay nadie logueado, mostramos los botones iniciales de iniciar sesión y registrarse
  return (
    <>
      <div className="d-flex gap-2">
        {/* este botón muestra la ventaa de iniciar sesión */}
        <button
          className="btn btn-outline-success fw-bold"
          onClick={() => setShowLoginModal(true)}
        >
          Iniciar Sesión
        </button>

        {/* Este botón nos redirige a la página donde el usuario elige si ser Cliente o Prestador */}
        <Link to="/registro" className="btn btn-success fw-bold">
          Registrarse
        </Link>
      </div>

      {/* La ventana del login que está invisible hasta que showLoginModal sea true */}
      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
      />
    </>
  );
};