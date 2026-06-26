import React, { useLayoutEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AuthButtons } from '../ui/AuthButtons';
import '../../assets/css/navbar-active.css';

const setNavbarHeight = (height) => {
  document.documentElement.style.setProperty('--servigo-navbar-h', `${height}px`);
};

const navLinkClass = ({ isActive }) =>
  `nav-link servigo-nav-link fw-medium ${isActive ? 'active' : ''}`;

const Navbar = () => {
  const navRef = useRef(null);
  const location = useLocation();

  const isEspecialistaPath =
    location.pathname === '/unete-especialista' ||
    location.pathname === '/unete-como-especialista';

  const especialistaLinkClass = ({ isActive }) =>
    `servigo-nav-link servigo-nav-link--especialista fw-bold text-decoration-none small ${
      isActive || isEspecialistaPath ? 'active' : ''
    }`;

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        setNavbarHeight(navRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    const navEl = navRef.current;
    const collapse = navEl?.querySelector('#navbarNav');
    collapse?.addEventListener('shown.bs.collapse', updateHeight);
    collapse?.addEventListener('hidden.bs.collapse', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      collapse?.removeEventListener('shown.bs.collapse', updateHeight);
      collapse?.removeEventListener('hidden.bs.collapse', updateHeight);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-2 fixed-top servigo-main-navbar"
    >
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 text-success mb-0" to="/">
          Servi<span className="text-dark">Go</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <NavLink to="/" end className={navLinkClass}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/buscar" className={navLinkClass}>
                Explorar Servicios
              </NavLink>
            </li>
            <li className="nav-item d-lg-none">
              <NavLink to="/unete-especialista" className={especialistaLinkClass}>
                Únete como Especialista
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <NavLink
              to="/unete-especialista"
              className={({ isActive }) =>
                `d-none d-lg-inline-block servigo-nav-link servigo-nav-link--especialista fw-bold text-decoration-none small ${
                  isActive || isEspecialistaPath ? 'active' : ''
                }`
              }
            >
              Únete como Especialista
            </NavLink>

            <div className="vr d-none d-lg-block mx-2 text-muted" />

            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
