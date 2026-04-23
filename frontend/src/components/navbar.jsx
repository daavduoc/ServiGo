import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const NavbarInicio = () => {
  return (
    <nav className="navbar bg-body-tertiary" style={{ height: "80px", overflow: "visible" }}>
      <div className="container-fluid h-100 d-flex align-items-center">
        <div className="d-flex align-items-center" style={{ flex: 1 }}>
          <a className="navbar-brand m-0 p-0" href="/" style={{ height: "100%" }}>
            <img
              src="/logo-servigo.png"
              alt="ServiGo logo"
              style={{
                height: "110px",
                width: "auto",
                marginTop: "-40px",
                marginBottom: "-48px",
                display: "block",
              }}
            />
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

        <div style={{ flex: 1 }}></div>
      </div>
    </nav>
  );
};
export default NavbarInicio;