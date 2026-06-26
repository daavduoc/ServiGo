import React from 'react';
import { Link } from 'react-router-dom';

// 1. Nombres corregidos para que coincidan con la foto
import imgSalud from '../../assets/img/banner-medico.png';
import imgTecnica from '../../assets/img/banner-tecnico.png';

const BannerInicio = () => {
  return (
    <div className="bg-light pb-5">
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        </div>

        <div className="carousel-inner" style={{ height: '500px' }}>
          
          {/* SLIDE 1: SALUD */}
          <div className="carousel-item active h-100">
            {/* Usamos la imagen correcta */}
            <img 
              src={imgSalud} 
              className="d-block w-100 h-100" 
              style={{ objectFit: 'cover' }} 
              alt="Salud" 
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: '0.35' }}></div>
            
            <div className="carousel-caption d-flex flex-column h-100 justify-content-center align-items-center pb-5">
              <h1 className="display-4 fw-bold text-white mb-3 shadow-sm" style={{ maxWidth: '800px' }}>
               Tu salud no espera, y nosotros estamos preparados para atenderte hoy mismo.
              </h1>
              
              <Link to="/buscar" className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                Encuentra tu Especialista
              </Link>
            </div>
          </div>

          {/* SLIDE 2: SERVICIO TÉCNICO */}
          <div className="carousel-item h-100">
            {/* Usamos la imagen correcta */}
            <img 
              src={imgTecnica} 
              className="d-block w-100 h-100" 
              style={{ objectFit: 'cover' }} 
              alt="Servicio Técnico" 
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: '0.35' }}></div>
            
            <div className="carousel-caption d-flex flex-column h-100 justify-content-center align-items-center pb-5">
              <h1 className="display-4 fw-bold text-white mb-3 shadow-sm" style={{ maxWidth: '800px' }}>
                Servicio técnico a domicilio, sin complicaciones ni esperas.
              </h1>
              <p className="fs-5 text-light mb-4" style={{ maxWidth: '600px' }}>
               
              </p>
              
              <Link to="/buscar" className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                Agendar Atención técnica
              </Link>
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
    </div>
  );
};

export default BannerInicio;