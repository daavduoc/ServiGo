import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import { useAuth } from '../../context/AuthContext';
import { getDisplayName, isAdminUser, isPrestadorUser } from '../../utils/userDisplay';
import { obtenerEstadisticas } from '../../serviceFront/adminService';

export const AuthButtons = () => {
  // Estado para la ventana de Iniciar Sesión
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Estado para controlar el puntito verde de las notificaciones
  const [hayNotificacionesNuevas, setHayNotificacionesNuevas] = useState(true);

  // Estado para notificaciones del admin
  const [adminNotifs, setAdminNotifs] = useState({ prestadoresPendientes: 0, soportePendientes: 0 });
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user || !isAdminUser(user)) return;
    obtenerEstadisticas()
      .then((data) => {
        setAdminNotifs({
          prestadoresPendientes: data.prestadoresPendientes || 0,
          soportePendientes: data.soportePendientes || 0,
        });
      })
      .catch(() => {});
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!showNotifDropdown) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifDropdown]);

  if (isAuthenticated && user) {
    const esAdmin = isAdminUser(user);
    const esPrestador = isPrestadorUser(user);

    return (
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted d-none d-md-inline">
          Bienvenido, <strong>{getDisplayName(user)}</strong>
        </span>

        {esAdmin ? (
          <>
            <div className="position-relative" ref={dropdownRef}>
              <button
                type="button"
                className="btn btn-link text-dark p-0 border-0 position-relative"
                title="Notificaciones"
                onClick={() => setShowNotifDropdown((prev) => !prev)}
              >
                <i className="bi bi-bell fs-5" />
                {(adminNotifs.prestadoresPendientes + adminNotifs.soportePendientes) > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {adminNotifs.prestadoresPendientes + adminNotifs.soportePendientes}
                    <span className="visually-hidden">notificaciones pendientes</span>
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="dropdown-menu show end-0 mt-2 shadow-sm" style={{ minWidth: '260px' }}>
                  <h6 className="dropdown-header">Notificaciones</h6>
                  <Link
                    to="/admin/prestadores"
                    className="dropdown-item d-flex justify-content-between align-items-center"
                    onClick={() => setShowNotifDropdown(false)}
                  >
                    <span>
                      <i className="bi bi-person-badge me-2" />
                      Prestadores pendientes
                    </span>
                    <span className={`badge ${adminNotifs.prestadoresPendientes > 0 ? 'bg-warning text-dark' : 'bg-secondary'} rounded-pill`}>
                      {adminNotifs.prestadoresPendientes}
                    </span>
                  </Link>
                  <Link
                    to="/admin/soporte"
                    className="dropdown-item d-flex justify-content-between align-items-center"
                    onClick={() => setShowNotifDropdown(false)}
                  >
                    <span>
                      <i className="bi bi-headset me-2" />
                      Mensajes de soporte
                    </span>
                    <span className={`badge ${adminNotifs.soportePendientes > 0 ? 'bg-warning text-dark' : 'bg-secondary'} rounded-pill`}>
                      {adminNotifs.soportePendientes}
                    </span>
                  </Link>
                  {(adminNotifs.prestadoresPendientes + adminNotifs.soportePendientes) === 0 && (
                    <span className="dropdown-item text-muted small">
                      Sin notificaciones pendientes
                    </span>
                  )}
                </div>
              )}
            </div>

            <Link to="/admin/dashboard" className="btn btn-outline-success btn-sm fw-bold">
              Panel Admin
            </Link>
          </>
        ) : (
          <>
            <Link
              to={esPrestador ? '/prestador/notificaciones' : '/notificaciones'}
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
            <Link
              to={esPrestador ? '/dashboard-prestador' : '/perfil'}
              className="btn btn-outline-success btn-sm fw-bold"
            >
              {esPrestador ? 'Mi Panel' : 'Mi Perfil'}
            </Link>
          </>
        )}

        <button className="btn btn-outline-danger btn-sm fw-bold" onClick={logout}>
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