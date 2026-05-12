import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// 1. Importamos el nuevo módulo de botones
import { AuthButtons } from "../ui/AuthButtons";
import { useNavigate } from 'react-router-dom';
import logoServigo from '../../assets/img/Logo-final.png';

const NavbarInicio = () => {
  const navigate = useNavigate(); 
  const handleBuscar = (e) => {
    e.preventDefault(); 
    navigate('/buscar');
  };

  return (
    <nav className="navbar" style={{ height: "80px", overflow: "visible", backgroundColor: "#FFFFFF" }}>
      <div className="container-fluid h-100 d-flex align-items-center">
        
        {/* Izquierda: Logo */}
        <div className="d-flex align-items-center" style={{ flex: 1 }}>
          <a className="navbar-brand fw-bold fs-1" href="/" style={{ color: '#4AD990' }}>
          <img 
              src={logoServigo} 
              alt="Logo ServiGo" 
              height="75" 
              className="d-inline-block align-top"
            />
          </a>
          
        </div>

        {/* Centro: Buscador */}
        <div className="d-flex justify-content-center" style={{ flex: 1 }}>
          <form 
            className="d-flex align-items-center w-100" 
            role="search" 
            style={{ maxWidth: "460px" }}
            onSubmit={handleBuscar}
          >
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="buscar servicio" 
              aria-label="Search" 
            />
            <button className="btn btn-outline-success" type="submit">
              Buscar
            </button>
          </form>
        </div>

        {/* Derecha: Botones Modulares */}
        {/* Le agregamos justify-content-end para que los botones se peguen a la derecha */}
        <div className="d-flex justify-content-end align-items-center" style={{ flex: 1 }}>
          <AuthButtons />
        </div>

      </div>
    </nav>
  );
};

export default NavbarInicio;