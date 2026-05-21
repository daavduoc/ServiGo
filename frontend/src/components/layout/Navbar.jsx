import React from 'react';
import { Link } from 'react-router-dom';
import { AuthButtons } from '../ui/AuthButtons';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-3">
      <div className="container">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold fs-3 text-success" to="/">
          Servi<span className="text-dark">Go</span>
        </Link>

        {/* BOTÓN PARA MÓVILES */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-medium text-dark hover-success" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium text-dark hover-success" to="/buscar">Explorar Servicios</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link to="/registro/prestador" className="text-success fw-bold text-decoration-none small d-none d-lg-block">
              Únete como Especialista
            </Link>
            
            <div className="vr d-none d-lg-block mx-2 text-muted"></div>

            <AuthButtons />

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;