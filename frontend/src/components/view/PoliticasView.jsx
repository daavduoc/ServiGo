import React from 'react';
import { Link } from 'react-router-dom';
import imgPoliticas from '../../assets/img/politicas-hero.png';
import '../../assets/css/politicas.css';

const POLITICAS = [
  {
    icon: 'bi-shield-check',
    title: 'Seguridad y confianza',
    text: 'Verificamos a todos nuestros especialistas para garantizar un servicio confiable y seguro para nuestros clientes.',
  },
  {
    icon: 'bi-person-check',
    title: 'Respeto y trato',
    text: 'Fomentamos el respeto y la cordialidad entre clientes y especialistas. No toleramos conductas ofensivas o discriminatorias.',
  },
  {
    icon: 'bi-credit-card',
    title: 'Pagos y comisiones',
    text: 'Los pagos se realizan de forma segura a través de la plataforma. ServiGo aplica una comisión justa por cada servicio realizado.',
  },
  {
    icon: 'bi-clock',
    title: 'Cancelaciones',
    text: 'Si necesitas cancelar un servicio, hazlo con anticipación. Consulta nuestra política de cancelaciones para más detalles.',
  },
  {
    icon: 'bi-lock',
    title: 'Privacidad',
    text: 'Protegemos tu información personal y solo la usamos para brindar y mejorar nuestros servicios. No compartimos tus datos con terceros.',
  },
  {
    icon: 'bi-file-earmark-text',
    title: 'Uso de la plataforma',
    text: 'Está prohibido el uso indebido de la plataforma, como publicar contenido falso, fraudulento o que infrinja la ley.',
  },
];

export const PoliticasView = () => {
  return (
    <div className="politicas-view">
      <nav className="politicas-breadcrumb" aria-label="Ruta de navegación">
        <Link to="/">
          <i className="bi bi-house-door" aria-hidden="true" /> Inicio
        </Link>
        <span aria-hidden="true">&gt;</span>
        <span className="politicas-breadcrumb__current">Políticas</span>
      </nav>

      <header className="politicas-hero">
        <div>
          <h1 className="politicas-hero__title">Nuestras políticas</h1>
          <p className="politicas-hero__lead">
            En ServiGo trabajamos para ofrecer una experiencia segura, confiable y transparente
            para clientes y especialistas.
          </p>
        </div>
        <div className="politicas-hero__img-wrap">
          <img
            src={imgPoliticas}
            alt="Ilustración de políticas: lista de verificación y escudo de seguridad"
            className="politicas-hero__img"
          />
        </div>
      </header>

      <section className="politicas-grid" aria-label="Políticas de ServiGo">
        {POLITICAS.map((item) => (
          <article key={item.title} className="politicas-card">
            <div className="politicas-card__icon" aria-hidden="true">
              <i className={`bi ${item.icon}`} />
            </div>
            <div>
              <h2 className="politicas-card__title">{item.title}</h2>
              <p className="politicas-card__text">{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <aside className="politicas-changes" aria-label="Cambios en las políticas">
        <div className="politicas-changes__icon" aria-hidden="true">
          <i className="bi bi-info-circle" />
        </div>
        <div>
          <p className="politicas-changes__title">Cambios en las políticas</p>
          <p className="politicas-changes__text">
            Nos reservamos el derecho de actualizar estas políticas en cualquier momento.
            Te notificaremos sobre cambios importantes.
          </p>
        </div>
      </aside>

      <p className="politicas-footer-msg">
        <i className="bi bi-shield-check" aria-hidden="true" />
        <span>
          Gracias por ser parte de <strong>ServiGo</strong> y ayudarnos a construir una
          comunidad segura y confiable.
        </span>
      </p>
    </div>
  );
};
