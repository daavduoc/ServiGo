import React from 'react';

const Footer = () => {
  return (
    <footer
      className="py-3 mt-auto"
      style={{ backgroundColor: "#d9f2df", color: "#1f3b2f" }}
    >
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          
          {/* Columna 1: Nombre del Proyecto */}
          <div className="col-md-4 col-lg-4 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold" style={{ color: "#2f9e44" }}>ServiGo</h6>
            <p className="mb-2 small">Conectando profesionales de confianza con el hogar y la salud.</p>
          </div>

          {/* Columna 2: Enlaces Útiles */}
          <div className="col-md-3 col-lg-3 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold">Servicios</h6>
            <p className="mb-1 small"><a href="#" className="text-decoration-none" style={{ color: "#1f3b2f" }}>Técnicos</a></p>
            <p className="mb-1 small"><a href="#" className="text-decoration-none" style={{ color: "#1f3b2f" }}>Salud</a></p>
         
          </div>

          {/* Columna 3: Contacto */}
          <div className="col-md-4 col-lg-4 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold">Contacto</h6>
            <p className="mb-1 small"><i className="bi bi-geo-alt-fill"></i> Puente Alto, Chile</p>
            <p className="mb-0 small"><i className="bi bi-envelope-fill"></i> contacto@servigo.cl</p>
          </div>

        </div>

        <hr className="my-2" />

        <div className="row align-items-center">
          <div className="col-12">
            <p className="mb-0 small text-center">
              © 2026 Copyright: <strong style={{ color: "#2f9e44" }}>ServiGo</strong> - Duoc UC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;