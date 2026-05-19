import React from 'react';
import BannerInicio from '../ui/Banner';
import '../../assets/css/home.css';

const BENEFITS = [
  {
    icon: 'bi-shield-check',
    title: 'Especialistas Verificados',
    text: 'Revisamos los antecedentes y certificaciones de cada profesional para que tu hogar esté en buenas manos.',
  },
  {
    icon: 'bi-lightning-charge',
    title: 'Respuestas Rápidas',
    text: 'Conectamos tu solicitud con los técnicos más cercanos a tu comuna en tiempo real.',
  },
  {
    icon: 'bi-star',
    title: 'Calidad Garantizada',
    text: 'Lee las evaluaciones de otros clientes y califica el servicio una vez que el trabajo esté terminado.',
  },
];

const STEPS = [
  {
    icon: 'bi-search',
    title: '1. Busca',
    text: 'Encuentra al especialista ideal según tu necesidad y ubicación.',
  },
  {
    icon: 'bi-calendar-event',
    title: '2. Reserva',
    text: 'Agenda la visita en el horario que mejor te acomode.',
  },
  {
    icon: 'bi-check2-square',
    title: '3. Soluciona',
    text: 'Recibe al especialista en tu hogar y resuelve el problema.',
  },
];

export const HomeView = () => {
  return (
    <div className="home-view">
      <BannerInicio />

      {/* ¿Por qué elegir ServiGo? */}
      <section className="my-5" aria-labelledby="home-benefits-title">
        <h3 id="home-benefits-title" className="home-section-title">
          ¿Por qué elegir ServiGo?
        </h3>
        <div className="row g-4 justify-content-center">
          {BENEFITS.map((item) => (
            <div key={item.title} className="col-md-4 col-sm-6">
              <article className="home-benefit-card">
                <div className="home-icon-circle" aria-hidden="true">
                  <i className={`bi ${item.icon}`} />
                </div>
                <h5>{item.title}</h5>
                <p>{item.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ¿Cómo funciona ServiGo? */}
      <section className="home-how-box" aria-labelledby="home-how-title">
        <h3 id="home-how-title" className="home-section-title">
          ¿Cómo funciona ServiGo?
        </h3>

        <div className="home-steps-row">
          <svg
            className="home-step-connectors d-none d-md-block"
            viewBox="0 0 900 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M 180 45 Q 300 5, 450 45" />
            <path d="M 450 45 Q 600 5, 720 45" />
          </svg>

          {STEPS.map((step) => (
            <div className="home-step" key={step.title}>
              <div className="home-icon-circle" aria-hidden="true">
                <i className={`bi ${step.icon}`} />
              </div>
              <h5>{step.title}</h5>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
