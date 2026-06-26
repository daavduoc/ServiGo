import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import imgEspecialista from '../../assets/img/especialista-hero.png';
import '../../assets/css/unete-especialista.css';
import {
  BENEFITS_GRID,
  BENEFITS_HERO,
  FAQ_ITEMS,
  REQUIREMENTS,
  STEPS,
  TESTIMONIALS,
  TRUST_ITEMS,
} from './constants/uneteConstants';

export const UneteComoEspecialistaView = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="unete-especialista-view container pb-4">
      <section className="bg-success-subtle rounded-4 p-4 p-lg-5 mb-5 overflow-hidden">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-lg-5">
            <span className="badge rounded-pill bg-success bg-opacity-25 text-success fw-semibold mb-3 px-3 py-2">
              Para Prestadores de Servicios
            </span>
            <h1 className="fw-bold mb-3 lh-sm unete-hero-title">
              Haz crecer tu negocio con <span className="text-success">Servi</span>Go
            </h1>
            <p className="text-muted mb-4 unete-hero-lead">
              Conecta con clientes que necesitan tus servicios. Gestiona tu agenda, servicios y más desde un solo
              lugar.
            </p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <Link
                to="/registro/prestador"
                className="btn btn-success fw-semibold d-inline-flex align-items-center gap-2 rounded-3"
              >
                <i className="bi bi-person-plus-fill" aria-hidden="true" />
                Crear cuenta de prestador
              </Link>
              <a href="#especialista-como-funciona" className="btn btn-outline-success fw-semibold rounded-3">
                Conoce más
              </a>
            </div>
            <div className="d-flex flex-wrap gap-4">
              {BENEFITS_HERO.map((b) => (
                <div key={b.title} className="d-flex gap-2 unete-hero-benefit">
                  <i className={`bi ${b.icon} text-success fs-5 flex-shrink-0`} aria-hidden="true" />
                  <div>
                    <strong className="d-block small">{b.title}</strong>
                    <span className="text-muted">{b.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-7 unete-hero-media">
            <img
              src={imgEspecialista}
              alt="Especialista profesional en ServiGo"
              className="unete-hero-img rounded-4 shadow"
            />
            <div className="unete-float-card card border-0 shadow-sm p-3 d-flex gap-2">
              <i className="bi bi-graph-up-arrow text-success flex-shrink-0" aria-hidden="true" />
              <div>
                <strong>Más oportunidades</strong>
                <p className="text-muted mb-0">Únete a ServiGo y lleva tu negocio al siguiente nivel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5" aria-labelledby="unete-benefits-title">
        <h2 id="unete-benefits-title" className="text-center fw-bold mb-4">
          Beneficios de ser especialista en <span className="text-success">ServiGo</span>
        </h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {BENEFITS_GRID.map((b) => (
            <div key={b.title} className="col">
              <article className="card border-0 shadow-sm h-100 text-center p-4">
                <div className="servigo-icon-badge mx-auto mb-3">
                  <i className={`bi ${b.icon}`} aria-hidden="true" />
                </div>
                <h3 className="h6 fw-bold mb-2">{b.title}</h3>
                <p className="text-muted small mb-0">{b.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section
        id="especialista-como-funciona"
        className="unete-como-funciona mb-5"
        aria-labelledby="unete-como-title"
      >
        <h2 id="unete-como-title" className="text-center fw-bold mb-2">
          ¿Cómo funciona?
        </h2>
        <p className="text-center text-muted mb-4 mb-lg-5">Comienza a ofrecer tus servicios en simples pasos.</p>
        <div className="position-relative">
          <div className="unete-steps-line" aria-hidden="true" />
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 position-relative">
            {STEPS.map((step) => (
              <div key={step.num} className="col">
                <article className="card border-0 shadow-sm h-100 text-center p-4 position-relative">
                  <span className="badge rounded-circle bg-success mb-3 px-0 d-inline-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, fontSize: '0.8rem' }}
                  >
                    {step.num}
                  </span>
                  <div className="servigo-icon-badge servigo-icon-badge--lg mx-auto mb-3">
                    <i className={`bi ${step.icon}`} aria-hidden="true" />
                  </div>
                  <h3 className="h6 fw-bold mb-2">{step.title}</h3>
                  <p className="text-muted small mb-0">{step.text}</p>
                  {step.num === 1 && (
                    <Link to="/registro/prestador" className="small fw-semibold text-success text-decoration-none d-inline-block mt-3">
                      Ir al registro
                    </Link>
                  )}
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-success-subtle rounded-4 p-4 p-lg-5 mb-5" aria-label="Seguridad y confianza">
        <div className="row align-items-center g-4 text-center text-lg-start">
          <div className="col-lg-auto mx-auto mx-lg-0">
            <div className="unete-trust-icon rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center mx-auto">
              <i className="bi bi-shield-check text-success" aria-hidden="true" />
            </div>
          </div>
          <div className="col-lg">
            <h3 className="h5 fw-bold mb-2">Seguridad y confianza</h3>
            <p className="text-muted mb-2 unete-trust-desc mx-auto mx-lg-0">
              Verificamos a todos nuestros especialistas para garantizar la mejor experiencia para clientes y
              prestadores.
            </p>
            <Link to="/politicas" className="fw-semibold text-success text-decoration-none">
              Conoce nuestras políticas →
            </Link>
          </div>
          <div className="col-lg-4 text-center text-lg-start">
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 unete-trust-list align-items-center align-items-lg-start">
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="d-flex align-items-center gap-2 fw-medium text-nowrap">
                  <i className="bi bi-check-circle-fill text-success flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-5" aria-labelledby="unete-testimonials-title">
        <h2 id="unete-testimonials-title" className="text-center fw-bold mb-4">
          Lo que dicen nuestros especialistas
        </h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="col">
              <article className="card border-0 shadow-sm h-100 p-4">
                <div
                  className={`unete-avatar rounded-circle text-white fw-bold d-flex align-items-center justify-content-center mb-3 ${t.avatarClass}`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div className="mb-1">
                  <strong className="d-block">{t.name}</strong>
                  <span className="text-muted small">{t.role}</span>
                </div>
                <div className="text-success small mb-2 d-flex gap-1" aria-label="5 estrellas">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <i key={n} className="bi bi-star-fill" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mb-0 small text-muted fst-italic lh-base">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="row g-4 g-xl-5 align-items-start">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-4">Requisitos para registrarte</h2>
            <div className="d-flex align-items-center gap-4 flex-column flex-sm-row">
              <ul className="list-unstyled mb-0 flex-grow-1">
                {REQUIREMENTS.map((req) => (
                  <li key={req} className="d-flex gap-2 mb-3">
                    <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1" aria-hidden="true" />
                    {req}
                  </li>
                ))}
              </ul>
              <div className="unete-requirements-illus" aria-hidden="true">
                <i className="bi bi-clipboard-check" />
                <span className="badge rounded-circle bg-success text-white">
                  <i className="bi bi-check-lg" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h2 className="fw-bold mb-4">Preguntas frecuentes</h2>
            <div className="d-flex flex-column gap-2">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.q} className="card border overflow-hidden">
                    <button
                      type="button"
                      className="unete-faq-btn btn bg-white border-0 w-100 text-start fw-semibold d-flex justify-content-between align-items-center gap-3 py-3 px-3 shadow-none"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      {item.q}
                      <i className="bi bi-chevron-down text-muted" aria-hidden="true" />
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3">
                        <p className="text-muted small mb-0">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-success rounded-4 p-4 p-lg-5 d-flex flex-wrap align-items-center gap-4 text-white mb-2"
        aria-labelledby="unete-cta-title"
      >
        <div className="unete-cta-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
          <i className="bi bi-rocket-takeoff-fill" aria-hidden="true" />
        </div>
        <div className="flex-grow-1" style={{ minWidth: '200px' }}>
          <h2 id="unete-cta-title" className="h4 fw-bold text-white mb-1">
            ¿Listo para hacer crecer tu negocio?
          </h2>
          <p className="mb-0 opacity-75">Únete a cientos de especialistas que ya están creciendo con ServiGo.</p>
        </div>
        <Link to="/registro/prestador" className="btn btn-light text-success fw-bold rounded-3 px-4 py-2">
          Únete ahora →
        </Link>
      </section>
    </div>
  );
};
