import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import { useAuth } from '../../context/AuthContext';
import { getDisplayName, isAdminUser, isPrestadorUser } from '../../utils/userDisplay';

export const AuthButtons = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hayNotificacionesNuevas, setHayNotificacionesNuevas] = useState(true);

  const { isAuthenticated, user, logout } = useAuth();
  
  // Inicializa navigate
  const navigate = useNavigate(); 

  // la función que limpia y redirige al usar logout
  const handleCerrarSesion = () => {
    logout();
    navigate('/'); 
  };

  if (isAuthenticated && user) {
    const esAdmin = isAdminUser(user);
    const esPrestador = isPrestadorUser(user);

    return (
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted d-none d-md-inline">
          Bienvenido, <strong>{getDisplayName(user)}</strong>
        </span>

        {esAdmin ? (
          <Link to="/admin/dashboard" className="btn btn-outline-success btn-sm fw-bold">
            Panel Admin
          </Link>
        ) : (
          <>
            <Link
              to="/notificaciones"
              className="text-dark position-relative hover-success"
              title="Notificaciones"
              onClick={() => setHayNotificacionesNuevas(false)}
            >
              <i className="bi bi-bell fs-5" />
              {hayNotificacionesNuevas && (
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                  <span className="visually-hidden">Nuevas notificaciones</span>
                </span>
              )}
            </Link>
            
            {/* 👇 AQUÍ ESTÁ LA CORRECCIÓN DEL REDIRECCIONAMIENTO 👇 */}
            <Link
              to={esPrestador ? '/dashboard-prestador' : '/dashboard-cliente'}
              className="btn btn-outline-success btn-sm fw-bold"
            >
              Mi Panel
            </Link>
            
          </>
        )}

        {/* función al botón cerrar sesión */}
        <button className="btn btn-outline-danger btn-sm fw-bold" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Si NO hay nadie logueado, mostramos los botones de inicio
  return (
    <>
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-success fw-bold"
          onClick={() => setShowLoginModal(true)}
        >
          Iniciar Sesión
        </button>

        <Link to="/registro" className="btn btn-success fw-bold">
          Registrarse
        </Link>
      </div>

      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
      />
    </>
  );
};