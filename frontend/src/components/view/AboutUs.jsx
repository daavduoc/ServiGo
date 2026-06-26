import React from 'react';
// ¡Aquí estaba el detalle! Cambiamos .jpg por .png
import imgQuienesSomos from '../../assets/img/quienes-somos.png';

export const AboutUs = () => {
  return (
    <section className="py-5 bg-white">
      <div className="container py-5">
        <div className="row align-items-center gap-4 gap-lg-0">
          
          {/* COLUMNA IZQUIERDA: LA FOTO */}
          <div className="col-lg-6 position-relative">
            {/* El cuadrito verde de fondo decorativo */}
            <div 
              className="position-absolute bg-success rounded-4" 
              style={{ width: '100%', height: '100%', top: '15px', left: '-15px', opacity: '0.1', zIndex: 0 }}
            ></div>
            
            {/* Usamos la variable importada */}
            <img 
              src={imgQuienesSomos} 
              alt="Equipo de ServiGo" 
              className="img-fluid rounded-4 shadow position-relative"
              style={{ objectFit: 'cover', width: '100%', minHeight: '400px', zIndex: 1 }}
            />
          </div>

          {/* COLUMNA DERECHA: LA HISTORIA */}
          <div className="col-lg-6 ps-lg-5">
            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill mb-3 fw-medium">
            Nuestra historia
            </span>
            <h2 className="fw-bold mb-4 display-6">
              Conectando talento con <span className="text-success">necesidades reales</span>
            </h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
              <strong>ServiGo</strong> nació al notar lo complejo y estresante que puede ser encontrar especialistas de confianza para resolver problemas cotidianos o atender necesidades específicas en el hogar.
            </p>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
              Nos propusimos crear un puente directo, transparente y eficiente. Hoy somos la plataforma que impulsa el trabajo independiente local, garantizando confianza, rapidez y soluciones efectivas a un solo clic.
            </p>
            
            <div className="d-flex gap-3 mt-4">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px' }}>✓</div>
                <span className="fw-medium text-dark">Confianza</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px' }}>✓</div>
                <span className="fw-medium text-dark">Rapidez</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};