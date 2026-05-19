import React from 'react';
// Importamos tu banner desde la carpeta ui
import BannerInicio from '../ui/Banner';

export const HomeView = () => {
  return (
    <>
      <BannerInicio />
      
      {/* SECCIÓN 1: ¿Por qué elegir ServiGo? */}
      <div className="container py-5 mt-4">
        <h2 className="text-center fw-bold mb-5 text-dark">¿Por qué elegir ServiGo?</h2>
        <div className="row g-4">
          
          {/* Tarjeta 1: Seguridad */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-shield-check fs-1"></i>
                </div>
              </div>
              <h5 className="fw-bold mb-3">Especialistas Verificados</h5>
              <p className="text-muted small mb-0">Revisamos los antecedentes y certificaciones de cada profesional para que tu hogar esté en buenas manos.</p>
            </div>
          </div>

          {/* Tarjeta 2: Rapidez */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-lightning-charge fs-1"></i>
                </div>
              </div>
              <h5 className="fw-bold mb-3">Respuestas Rápidas</h5>
              <p className="text-muted small mb-0">Conectamos tu solicitud con los técnicos más cercanos a tu comuna en tiempo real.</p>
            </div>
          </div>

          {/* Tarjeta 3: Confianza */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-award fs-1"></i>
                </div>
              </div>
              <h5 className="fw-bold mb-3">Calidad Garantizada</h5>
              <p className="text-muted small mb-0">Lee las evaluaciones de otros clientes y califica el servicio una vez que el trabajo esté terminado.</p>
            </div>
          </div>

        </div>
      </div>

      {/* SECCIÓN 2: ¿Cómo funciona ServiGo? */}
      <div className="bg-light py-5 mt-3">
        <div className="container py-4">
          <h2 className="text-center fw-bold mb-5 text-dark">¿Cómo funciona ServiGo?</h2>
          <div className="row g-4 position-relative">
            
            <div className="col-md-4 text-center">
              <div className="mb-3 position-relative z-1">
                <div className="d-inline-flex align-items-center justify-content-center bg-white shadow-sm text-success rounded-circle border border-2 border-success" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-search fs-2"></i>
                </div>
              </div>
              <h5 className="fw-bold">1. Busca</h5>
              <p className="text-muted small">Encuentra al especialista ideal según tu necesidad y ubicación.</p>
            </div>

            <div className="col-md-4 text-center">
              <div className="mb-3 position-relative z-1">
                <div className="d-inline-flex align-items-center justify-content-center bg-white shadow-sm text-success rounded-circle border border-2 border-success" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-calendar-check fs-2"></i>
                </div>
              </div>
              <h5 className="fw-bold">2. Reserva</h5>
              <p className="text-muted small">Agenda la visita en el horario que mejor te acomode.</p>
            </div>

            <div className="col-md-4 text-center">
              <div className="mb-3 position-relative z-1">
                <div className="d-inline-flex align-items-center justify-content-center bg-white shadow-sm text-success rounded-circle border border-2 border-success" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-check-lg fs-1"></i>
                </div>
              </div>
              <h5 className="fw-bold">3. Soluciona</h5>
              <p className="text-muted small">Recibe al especialista en tu hogar y resuelve el problema.</p>
            </div>

          </div>
        </div>
      </div>
      
    </>
  );
};