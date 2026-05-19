import React from 'react';
import { Link } from 'react-router-dom';

// Mantenemos las rutas perfectas a las imágenes
import imgTecnica from '../../assets/img/banner-medico.png';
import imgSalud from '../../assets/img/banner-tecnico.png';

const BannerInicio = () => {
  return (
    <div className="bg-light pb-5">
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        </div>

        <div className="carousel-inner" style={{ height: '500px' }}>
          
          {/* SLIDE 1: GASFITERÍA Y TÉCNICOS */}
          <div className="carousel-item active h-100">
            <img 
              src={imgTecnica} 
              className="d-block w-100 h-100" 
              style={{ objectFit: 'cover' }} 
              alt="Herramientas" 
            />
            {/* Opacidad clara al 35% */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: '0.35' }}></div>
            
            <div className="carousel-caption d-flex flex-column h-100 justify-content-center align-items-center pb-5">
              {/* 🔽 CAMBIO 1: Eliminamos la etiqueta (badge) de aquí 🔽 */}
              
              <h1 className="display-4 fw-bold text-white mb-3 shadow-sm" style={{ maxWidth: '800px' }}>
               Tu salud no espera, y nosotros estamos preparados para atenderte hoy mismo.
              </h1>
              
              {/* Botón verde (btn-success) */}
              <Link to="/buscar?area=Técnica" className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                Encuentra tu Especialista
              </Link>
            </div>
          </div>

          {/* SLIDE 2: SALUD Y BIENESTAR */}
          <div className="carousel-item h-100">
            <img 
              src={imgSalud} 
              className="d-block w-100 h-100" 
              style={{ objectFit: 'cover' }} 
              alt="Salud" 
            />
            {/* Misma opacidad */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: '0.35' }}></div>
            
            <div className="carousel-caption d-flex flex-column h-100 justify-content-center align-items-center pb-5">
              {/* 🔽 CAMBIO 2: Eliminamos la etiqueta "Área Salud" de aquí 🔽 */}
              
              <h1 className="display-4 fw-bold text-white mb-3 shadow-sm" style={{ maxWidth: '800px' }}>
                Servicio tecnico a domicilio, sin complicaciones ni esperas.
              </h1>
              <p className="fs-5 text-light mb-4" style={{ maxWidth: '600px' }}>
               
              </p>
              {/* 🔽 CAMBIO 3: Botón cambiado a Verde (btn-success) 🔽 */}
              <Link to="/buscar?area=Salud" className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                Agendar Atención tecnica
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