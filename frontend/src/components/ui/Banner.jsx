import React from 'react';
import { Link } from 'react-router-dom';
import bannerMedico from '../../assets/img/banner-medico.png';
import bannerTecnico from '../../assets/img/banner-tecnico.png';

export const Banner = () => {
  return (
    <div id="heroCarousel" className="carousel slide shadow-sm rounded mb-4 position-relative" data-bs-ride="carousel" data-bs-interval="3000">

      {/* Indicadores */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
      </div>

      <div className="carousel-inner rounded">

        {/* Diapositiva 1: Área de Salud */}
        <div className="carousel-item active">
          <img src={bannerMedico} className="d-block w-100" alt="Área de Salud ServiGo" style={{ objectFit: 'cover', height: '400px' }} />
          <div className="carousel-caption d-none d-md-flex flex-column justify-content-center h-100" style={{ top: 0, left: '8%', width: '40%', textAlign: 'left', zIndex: 10 }}>
            <h1 className="fw-bold text-dark display-5">Salud y Bienestar a Domicilio</h1>
            <p className="fs-5 text-dark mt-3">Profesionales listos para atenderte.</p>
            <div>
              {/* Usamos Link combinado con los z-index que habíamos configurado */}
              <Link to="/buscar?area=Salud" className="btn btn-success btn-lg fw-bold mt-3 shadow position-relative" style={{ zIndex: 20 }}>
                Buscar Especialista
              </Link>
            </div>
          </div>
        </div>

        {/* Diapositiva 2: Área Técnica */}
        <div className="carousel-item">
          <img src={bannerTecnico} className="d-block w-100" alt="Área Técnica ServiGo" style={{ objectFit: 'cover', height: '400px' }} />
          <div className="carousel-caption d-none d-md-flex flex-column justify-content-center h-100" style={{ top: 0, left: '8%', width: '40%', textAlign: 'left', zIndex: 10 }}>
            <h1 className="fw-bold text-dark display-5">Soluciones Rápidas para tu Hogar</h1>
            <p className="fs-5 text-dark mt-3">Gasfíteres, electricistas y más, garantizados.</p>
            <div>
              <Link to="/buscar?area=Técnica" className="btn btn-success btn-lg fw-bold mt-3 shadow position-relative" style={{ zIndex: 20 }}>
                Pedir Servicio
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* CONTROLES MODIFICADOS: Ancho reducido para no tapar los botones */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
        style={{ width: '5%' }}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
        style={{ width: '5%' }}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>

    </div>
  );
};

export default Banner;