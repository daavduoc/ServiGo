import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/footer.css';

const SOCIAL_LINKS = [
  {
    label: 'Facebook de ServiGo',
    icon: 'bi-facebook',
    href: 'https://www.facebook.com/servigo',
  },
  {
    label: 'Instagram de ServiGo',
    icon: 'bi-instagram',
    href: 'https://www.instagram.com/servigo',
  },
  {
    label: 'LinkedIn de ServiGo',
    icon: 'bi-linkedin',
    href: 'https://www.linkedin.com/company/servigo',
  },
  {
    label: 'X (Twitter) de ServiGo',
    icon: 'bi-twitter-x',
    href: 'https://x.com/servigo',
  },
];

const Footer = () => {
  return (
    <footer
      className="py-3 mt-auto border-top"
      style={{ backgroundColor: 'var(--servigo-green-pale)', color: 'var(--servigo-text-muted)' }}
    >
      <div className="container text-center text-md-start">
        <div className="row g-3 text-center text-md-start">
          
          {/* Columna 1: Nombre del Proyecto */}
          <div className="col-md-4 col-lg-4 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold text-success">
              <i className="bi bi-tools me-2"></i>ServiGo
            </h6>
            <p className="small mb-2" style={{ lineHeight: '1.4' }}>
              Conectando profesionales de confianza con el hogar y la salud. Soluciones rápidas y efectivas a un clic.
            </p>
            <nav className="footer-social mt-2" aria-label="Redes sociales de ServiGo">
              {SOCIAL_LINKS.map(({ label, icon, href }) => (
                <a
                  key={icon}
                  href={href}
                  className="footer-social__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <i className={`bi ${icon}`} aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="col-md-3 col-lg-3 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold">Navegación</h6>
            <ul className="list-unstyled small d-flex flex-column gap-1 mb-0">
              <li><Link to="/" className="text-decoration-none" style={{ color: 'var(--servigo-text-muted)' }}>Inicio</Link></li>
              <li><Link to="/buscar" className="text-decoration-none" style={{ color: 'var(--servigo-text-muted)' }}>Explorar Servicios</Link></li>
              <li><Link to="/unete-especialista" className="text-decoration-none" style={{ color: 'var(--servigo-text-muted)' }}>Únete como Especialista</Link></li>
              <li><Link to="/politicas" className="text-decoration-none" style={{ color: 'var(--servigo-text-muted)' }}>Nuestras políticas</Link></li>
              <li><Link to="/soporte" className="text-decoration-none" style={{ color: 'var(--servigo-text-muted)' }}>Soporte y Ayuda</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="col-md-4 col-lg-4 mx-auto mt-2">
            <h6 className="text-uppercase mb-2 fw-bold">Contacto Oficial</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <i className="bi bi-envelope-fill fs-6 text-success"></i>
                <a href="mailto:Contacto.servigo@gmail.com" className="text-decoration-none fw-medium" style={{ color: 'var(--servigo-text-muted)' }}>
                  Contacto.servigo@gmail.com
                </a>
              </li>
              <li className="d-flex align-items-start justify-content-center justify-content-md-start gap-2">
                <i className="bi bi-geo-alt-fill fs-6 text-success"></i>
                <span>Puente Alto, Chile</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="my-3 border-success opacity-25" />

        <div className="row align-items-center">
          <div className="col-12">
            <p className="mb-0 small text-center" style={{ fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} Copyright: <strong className="text-success">ServiGo</strong> - Duoc UC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;