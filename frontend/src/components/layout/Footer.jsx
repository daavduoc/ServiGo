import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className="py-3 mt-auto border-top"
      style={{ backgroundColor: "#d9f2df", color: "#1f3b2f" }}
    >
      <div className="container text-center text-md-start">
        <div className="row g-3 text-center text-md-start">
          
          {/* Columna 1: Nombre del Proyecto */}
          <div className="col-md-4 col-lg-4 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold" style={{ color: "#2f9e44" }}>
              <i className="bi bi-tools me-2"></i>ServiGo
            </h6>
            <p className="small mb-2" style={{ lineHeight: '1.4' }}>
              Conectando profesionales de confianza con el hogar y la salud. Soluciones rápidas y efectivas a un clic.
            </p>
            {/* Redes sociales */}
            <div className="d-flex gap-3 justify-content-center justify-content-md-start mt-2">
              <a href="#facebook" style={{ color: "#1f3b2f" }} className="fs-6 hover-success"><i className="bi bi-facebook"></i></a>
              <a href="#instagram" style={{ color: "#1f3b2f" }} className="fs-6 hover-success"><i className="bi bi-instagram"></i></a>
              <a href="#linkedin" style={{ color: "#1f3b2f" }} className="fs-6 hover-success"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="col-md-3 col-lg-3 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold">Navegación</h6>
            <ul className="list-unstyled small d-flex flex-column gap-1 mb-0">
              <li><Link to="/" className="text-decoration-none" style={{ color: "#1f3b2f" }}>Inicio</Link></li>
              <li><Link to="/buscar" className="text-decoration-none" style={{ color: "#1f3b2f" }}>Explorar Servicios</Link></li>
              <li><Link to="/registro/prestador" className="text-decoration-none" style={{ color: "#1f3b2f" }}>Únete como Especialista</Link></li>
              <li><Link to="/soporte" className="text-decoration-none" style={{ color: "#1f3b2f" }}>Soporte y Ayuda</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="col-md-4 col-lg-4 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold">Contacto Oficial</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <i className="bi bi-envelope-fill fs-6" style={{ color: "#2f9e44" }}></i>
                <a href="mailto:Contacto.servigo@gmail.com" className="text-decoration-none fw-medium" style={{ color: "#1f3b2f" }}>
                  Contacto.servigo@gmail.com
                </a>
              </li>
              <li className="d-flex align-items-start justify-content-center justify-content-md-start gap-2">
                <i className="bi bi-geo-alt-fill fs-6" style={{ color: "#2f9e44" }}></i>
                <span>Puente Alto, Chile</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="my-3 border-success opacity-25" />

        <div className="row align-items-center">
          <div className="col-12">
            <p className="mb-0 small text-center" style={{ fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} Copyright: <strong style={{ color: "#2f9e44" }}>ServiGo</strong> - Duoc UC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;