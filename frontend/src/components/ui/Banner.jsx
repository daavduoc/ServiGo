import React from 'react';
// Rutas ajustadas exactamente a como las tienes en tu terminal
import bannerMedico from '../../assets/img/banner-medico.png';
import bannerTecnico from '../../assets/img/banner-tecnico.png';

export const Banner = () => {
  return (
    <div id="heroCarousel" className="carousel slide shadow-sm rounded mb-4" data-bs-ride="carousel" data-bs-interval="3000">
      
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
      </div>

      <div className="carousel-inner rounded">
        
        {/* Diapositiva 1: Área de Salud */}
        <div className="carousel-item active">
          <img src={bannerMedico} className="d-block w-100" alt="Área de Salud ServiGo" style={{ objectFit: 'cover' }} />
          <div className="carousel-caption d-none d-md-flex flex-column justify-content-center h-100" style={{ top: 0, left: '5%', width: '40%', textAlign: 'left' }}>
            <h1 className="fw-bold text-dark display-5">Salud y Bienestar a Domicilio</h1>
            <p className="fs-5 text-dark mt-3"> listos para atenderte.</p>
            <div>
              <button className="btn btn-success btn-lg fw-bold mt-3 shadow">Buscar Especialista</button>
            </div>
          </div>
        </div>

        {/* Diapositiva 2: Área Técnica */}
        <div className="carousel-item">
          <img src={bannerTecnico} className="d-block w-100" alt="Área Técnica ServiGo" style={{ objectFit: 'cover' }} />
          <div className="carousel-caption d-none d-md-flex flex-column justify-content-center h-100" style={{ top: 0, left: '5%', width: '40%', textAlign: 'left' }}>
            <h1 className="fw-bold text-dark display-5">Soluciones Rápidas para tu Hogar</h1>
            <p className="fs-5 text-dark mt-3">Gasfíteres, electricistas y más, garantizados.</p>
            <div>
              <button className="btn btn-success btn-lg fw-bold mt-3 shadow">Pedir Servicio</button>
            </div>
          </div>
        </div>

      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};
export default Banner;