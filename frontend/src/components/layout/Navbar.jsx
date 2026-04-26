import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const NavbarInicio = () => {
  return (
    <nav className="navbar" style={{ height: "80px", overflow: "visible", backgroundColor: "#F0F5F2" }}>
      <div className="container-fluid h-100 d-flex align-items-center">
        <div className="d-flex align-items-center" style={{ flex: 1 }}>
          <a className="navbar-brand fw-bold fs-1" href="/" style={{ color: '#4AD990' }}>
  ServiGo
</a>
        </div>

        <div className="d-flex justify-content-center" style={{ flex: 1 }}>
          <form
            className="d-flex align-items-center w-100"
            role="search"
            style={{ maxWidth: "460px" }}
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

        <div className="d-flex justify-content-end" style={{ flex: 1 }}>
          <div className="d-flex gap-3 pe-3">
            <button type="button" className="btn btn-outline-success">Registrar</button>
            <button type="button" className="btn btn-outline-success">Iniciar sesión</button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavbarInicio;