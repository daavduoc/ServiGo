import React from 'react';
import { Link } from 'react-router-dom';
import bannerMedico from '../../assets/img/banner-medico.png';
import bannerTecnico from '../../assets/img/banner-tecnico.png';

export const Banner = () => {
  return (
    // Mantenemos data-bs-ride="carousel" para que sea automático
    <div id="heroCarousel" className="carousel slide shadow-sm rounded mb-4" data-bs-ride="carousel" data-bs-interval="3000">
      
    

      <div className="carousel-inner rounded">
        
        {/* Diapositiva 1: Área de Salud */}
        <div className="carousel-item active">
          <img src={bannerMedico} className="d-block w-100" alt="Área de Salud ServiGo" style={{ objectFit: 'cover' }} />
          <div className="carousel-caption d-none d-md-flex flex-column justify-content-center h-100" style={{ top: 0, left: '5%', width: '40%', textAlign: 'left' }}>
            <h1 className="fw-bold text-dark display-5">Salud y Bienestar a Domicilio</h1>
            <p className="fs-5 text-dark mt-3"> listos para atenderte.</p>
            <div>
              <Link to="/buscar" className="btn btn-success btn-lg fw-bold mt-3 shadow">
                Buscar Especialista
              </Link>
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
              <Link to="/buscar" className="btn btn-success btn-lg fw-bold mt-3 shadow">
                Pedir Servicio
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ¡ELIMINAMOS LAS FLECHAS DE LOS LADOS DE AQUÍ! */}

    </div>
  );
};

export default Banner;