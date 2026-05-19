import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-3">
      <div className="container">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold fs-3 text-success" to="/">
          Servi<span className="text-dark">Go</span>
        </Link>

        {/* BOTÓN PARA MÓVILES */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ENLACES Y MENÚ DE USUARIO */}
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
            {/* Botón para captar trabajadores (Llamado a la acción) */}
            <Link to="/registro/prestador" className="text-success fw-bold text-decoration-none small d-none d-lg-block">
              Únete como Especialista
            </Link>
            
            <div className="vr d-none d-lg-block mx-2 text-muted"></div>

            {/* Menú Desplegable del Usuario */}
            <div className="dropdown">
              <button 
                className="btn btn-light rounded-pill px-3 py-2 border d-flex align-items-center gap-2" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                  NC
                </div>
                <span className="fw-medium small">Nicole Chávez</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li><Link className="dropdown-item py-2 small" to="/dashboard-cliente">Panel de Cliente</Link></li>
                <li><Link className="dropdown-item py-2 small" to="/perfil">Configurar Perfil</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item py-2 small text-danger">Cerrar Sesión</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;