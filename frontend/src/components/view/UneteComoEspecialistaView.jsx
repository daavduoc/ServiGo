import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import imgEspecialista from '../../assets/img/especialista-hero.png';
import '../../assets/css/unete-especialista.css';

const STEPS = [
  {
    num: 1,
    icon: 'bi-person-plus',
    title: 'Regístrate',
    text: 'Crea tu cuenta como especialista y completa tu información.',
  },
  {
    num: 2,
    icon: 'bi-clipboard-check',
    title: 'Publica tus servicios',
    text: 'Agrega los servicios que ofreces y define tus precios.',
  },
  {
    num: 3,
    icon: 'bi-calendar-check',
    title: 'Recibe solicitudes',
    text: 'Los clientes te encontrarán y solicitarán tus servicios.',
  },
  {
    num: 4,
    icon: 'bi-currency-dollar',
    title: 'Realiza y crece',
    text: 'Completa los trabajos, recibe valoraciones y haz crecer tu negocio.',
  },
];

const BENEFITS_HERO = [
  {
    icon: 'bi-people',
    title: 'Más clientes',
    text: 'Accede a una amplia red de clientes.',
  },
  {
    icon: 'bi-calendar3',
    title: 'Gestiona tu tiempo',
    text: 'Organiza tu agenda y servicios fácilmente.',
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Haz crecer tu negocio',
    text: 'Aumenta tus ingresos y visibilidad.',
  },
];

const BENEFITS_GRID = [
  {
    icon: 'bi-people-fill',
    title: 'Más clientes',
    text: 'Accede a miles de clientes que buscan tus servicios cada día.',
  },
  {
    icon: 'bi-calendar3-week',
    title: 'Gestiona tu negocio',
    text: 'Administra tus servicios, horarios y solicitudes desde un solo lugar.',
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Mayor visibilidad',
    text: 'Destaca en tu categoría y aparece en los resultados de búsqueda.',
  },
  {
    icon: 'bi-star-fill',
    title: 'Construye reputación',
    text: 'Recibe valoraciones de clientes satisfechos y construye tu marca.',
  },
];

const TRUST_ITEMS = [
  'Verificación de identidad',
  'Perfiles y servicios revisados',
  'Comunidad segura para todos',
];

const TESTIMONIALS = [
  {
    initials: 'CM',
    name: 'Carlos M.',
    role: 'Electricista',
    quote:
      'Desde que me uní a ServiGo, mis ingresos aumentaron un 40%. La plataforma es muy fácil de usar.',
    color: '#198754',
  },
  {
    initials: 'MG',
    name: 'María G.',
    role: 'Jardinera',
    quote:
      'Me encanta poder gestionar mi agenda y recibir solicitudes directamente. ¡Totalmente recomendado!',
    color: '#157347',
  },
  {
    initials: 'RL',
    name: 'Roberto L.',
    role: 'Técnico en refrigeración',
    quote:
      'La verificación de clientes me da tranquilidad. Es una plataforma profesional y confiable.',
    color: '#146c43',
  },
];

const REQUIREMENTS = [
  'Documento de identidad (RUT)',
  'Datos de contacto verificados',
  'Descripción de tus servicios',
  'Experiencia comprobable (opcional)',
];

const FAQ_ITEMS = [
  {
    q: '¿Necesito tener empresa para registrarme?',
    a: 'No. Puedes registrarte como persona natural (particular) o como empresa, según cómo operes tu negocio.',
  },
  {
    q: '¿Cuánto cuesta registrarse?',
    a: 'Crear tu cuenta de especialista en ServiGo es gratuito. Solo pagas comisión cuando concretas un servicio.',
  },
  {
    q: '¿Cómo recibo los pagos?',
    a: 'Los pagos se gestionan de forma segura a través de la plataforma una vez completado el servicio.',
  },
  {
    q: '¿Puedo ofrecer varios servicios?',
    a: 'Sí. Puedes publicar todos los servicios que ofrezcas y administrarlos desde tu panel de prestador.',
  },
];

export const UneteComoEspecialistaView = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="unete-especialista-view">
      <section className="unete-hero">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-lg-5">
            <span className="unete-hero__badge">Para Prestadores de Servicios</span>
            <h1 className="unete-hero__title">
              Haz crecer tu negocio con{' '}
              <span className="unete-hero__brand-servi">Servi</span>
              <span className="unete-hero__brand-go">Go</span>
            </h1>
            <p className="unete-hero__lead">
              Conecta con clientes que necesitan tus servicios. Gestiona tu agenda, servicios y más
              desde un solo lugar.
            </p>
            <div className="unete-hero__actions">
              <Link to="/registro/prestador" className="unete-btn-primary">
                <i className="bi bi-person-plus-fill" aria-hidden="true" />
                Crear cuenta de prestador
              </Link>
              <a href="#especialista-como-funciona" className="unete-btn-outline">
                Conoce más
              </a>
            </div>
            <div className="unete-hero__benefits">
              {BENEFITS_HERO.map((b) => (
                <div key={b.title} className="unete-hero__benefit">
                  <i className={`bi ${b.icon}`} aria-hidden="true" />
                  <div>
                    <strong>{b.title}</strong>
                    <span>{b.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-7 unete-hero__media">
            <img src={imgEspecialista} alt="Especialista profesional en ServiGo" />
            <div className="unete-hero__float-card">
              <i className="bi bi-graph-up-arrow" aria-hidden="true" />
              <div>
                <strong>Más oportunidades</strong>
                <p>Únete a ServiGo y lleva tu negocio al siguiente nivel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="unete-benefits-section" aria-labelledby="unete-benefits-title">
        <h2 id="unete-benefits-title" className="unete-section-title">
          Beneficios de ser especialista en <span className="unete-brand">ServiGo</span>
        </h2>
        <div className="unete-benefits-grid">
          {BENEFITS_GRID.map((b) => (
            <article key={b.title} className="unete-benefit-card">
              <div className="unete-benefit-card__icon">
                <i className={`bi ${b.icon}`} aria-hidden="true" />
              </div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="especialista-como-funciona"
        className="unete-como-funciona"
        aria-labelledby="unete-como-title"
      >
        <h2 id="unete-como-title" className="unete-section-title">
          ¿Cómo funciona?
        </h2>
        <p className="unete-section-subtitle">
          Comienza a ofrecer tus servicios en simples pasos.
        </p>
        <div className="position-relative">
          <div className="unete-steps-connector" aria-hidden="true" />
          <div className="unete-steps">
            {STEPS.map((step) => (
              <article key={step.num} className="unete-step-card">
                <span className="unete-step-card__num">{step.num}</span>
                <div className="unete-step-card__icon">
                  <i className={`bi ${step.icon}`} aria-hidden="true" />
                </div>
                <h5>{step.title}</h5>
                <p>{step.text}</p>
                {step.num === 1 && (
                  <Link to="/registro/prestador" className="unete-step-card__cta">
                    Ir al registro
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="unete-trust" aria-label="Seguridad y confianza">
        <div className="unete-trust__shield" aria-hidden="true">
          <i className="bi bi-shield-check" />
        </div>
        <div className="unete-trust__main">
          <h3 className="unete-trust__heading">Seguridad y confianza</h3>
          <p className="unete-trust__desc">
            Verificamos a todos nuestros especialistas para garantizar la mejor experiencia para
            clientes y prestadores.
          </p>
          <Link to="/politicas" className="unete-trust__link">
            Conoce nuestras políticas →
          </Link>
        </div>
        <ul className="unete-trust__list">
          {TRUST_ITEMS.map((item) => (
            <li key={item}>
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="unete-testimonials" aria-labelledby="unete-testimonials-title">
        <h2 id="unete-testimonials-title" className="unete-section-title">
          Lo que dicen nuestros especialistas
        </h2>
        <div className="unete-testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="unete-testimonial-card">
              <div
                className="unete-testimonial-card__avatar"
                style={{ backgroundColor: t.color }}
                aria-hidden="true"
              >
                {t.initials}
              </div>
              <div className="unete-testimonial-card__meta">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
              <div className="unete-testimonial-card__stars" aria-label="5 estrellas">
                {[1, 2, 3, 4, 5].map((n) => (
                  <i key={n} className="bi bi-star-fill" aria-hidden="true" />
                ))}
              </div>
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
            </article>
          ))}
        </div>
      </section>

      <section className="unete-req-faq">
        <div className="row g-4 g-xl-5 align-items-start">
          <div className="col-lg-6">
            <h2 className="unete-section-title unete-section-title--left">
              Requisitos para registrarte
            </h2>
            <div className="unete-requirements">
              <ul className="unete-requirements__list">
                {REQUIREMENTS.map((req) => (
                  <li key={req}>
                    <i className="bi bi-check-circle-fill" aria-hidden="true" />
                    {req}
                  </li>
                ))}
              </ul>
              <div className="unete-requirements__illus" aria-hidden="true">
                <i className="bi bi-clipboard-check" />
                <span className="unete-requirements__badge">
                  <i className="bi bi-check-lg" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h2 className="unete-section-title unete-section-title--left">Preguntas frecuentes</h2>
            <div className="unete-faq">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.q} className={`unete-faq__item${isOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="unete-faq__question"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      {item.q}
                      <i className="bi bi-chevron-down" aria-hidden="true" />
                    </button>
                    {isOpen && (
                      <div className="unete-faq__answer">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="unete-cta-banner" aria-labelledby="unete-cta-title">
        <div className="unete-cta-banner__rocket" aria-hidden="true">
          <i className="bi bi-rocket-takeoff-fill" />
        </div>
        <div className="unete-cta-banner__text">
          <h2 id="unete-cta-title">¿Listo para hacer crecer tu negocio?</h2>
          <p>Únete a cientos de especialistas que ya están creciendo con ServiGo.</p>
        </div>
        <Link to="/registro/prestador" className="unete-cta-banner__btn">
          Únete ahora →
        </Link>
      </section>
    </div>
  );
};
