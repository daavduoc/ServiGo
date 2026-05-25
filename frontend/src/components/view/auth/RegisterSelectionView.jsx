import React from 'react';
import { Link } from 'react-router-dom';
import '../../../assets/css/registro.css';

const CLIENT_FEATURES = [
  'Busca servicios',
  'Contacta prestadores',
  'Gestiona tus contrataciones',
  'Califica y deja opiniones',
];

const PROVIDER_FEATURES = [
  'Publica tus servicios',
  'Recibe solicitudes',
  'Gestiona tus trabajos',
  'Haz crecer tu negocio',
];

export const RegisterSelectionView = () => (
    <div className="container register-selection-view py-3">
      <header className="register-selection-header">
        <h1>Crear tu cuenta</h1>
        <p className="subtitle">Selecciona el tipo de cuenta que deseas registrar</p>
        <div className="register-title-underline" aria-hidden="true" />
        <p className="register-trust-badge">
          <i className="bi bi-shield-check" aria-hidden="true" />
          Es rápido, fácil y seguro
        </p>
      </header>

      <div className="row g-4 justify-content-center">
        {/* Cliente → /registro/cliente */}
        <div className="col-lg-6 col-md-6">
          <article className="register-role-card register-role-card--client">
            <div className="register-role-icon" aria-hidden="true">
              <i className="bi bi-person" />
            </div>
            <h2>Soy Cliente</h2>
            <p className="role-description">
              Encuentra y contrata los mejores servicios cerca de ti.
            </p>
            <ul className="register-feature-list">
              {CLIENT_FEATURES.map((text) => (
                <li key={text}>
                  <i className="bi bi-check-circle-fill" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Link to="/registro/cliente" className="register-role-btn">
              Registrarme como cliente
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </Link>
          </article>
        </div>

        {/* Prestador → /registro/prestador */}
        <div className="col-lg-6 col-md-6">
          <article className="register-role-card register-role-card--provider">
            <div className="register-role-icon" aria-hidden="true">
              <i className="bi bi-briefcase" />
            </div>
            <h2>Soy Prestador</h2>
            <p className="role-description">
              Ofrece tus servicios y encuentra más clientes.
            </p>
            <ul className="register-feature-list">
              {PROVIDER_FEATURES.map((text) => (
                <li key={text}>
                  <i className="bi bi-check-circle-fill" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Link to="/registro/prestador" className="register-role-btn">
              Registrarme como prestador
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </div>

      <aside className="register-security-banner" aria-label="Información de seguridad">
        <i className="bi bi-lock-fill security-icon" aria-hidden="true" />
        <div>
          <strong>Tu información está protegida</strong>
          <p>Nos tomamos muy en serio la seguridad de tus datos personales.</p>
        </div>
      </aside>
    </div>
);
