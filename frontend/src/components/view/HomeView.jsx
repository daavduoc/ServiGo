import React from 'react';
// Importamos tu banner desde la carpeta ui
import BannerInicio from '../ui/Banner';

export const HomeView = () => {
  return (
    <>
      <BannerInicio />
      
      {/* SECCIÓN 1: ¿Por qué elegir ServiGo? */}
      <div className="container my-5">
        <h3 className="text-center fw-bold mb-4">¿Por qué elegir ServiGo?</h3>
        <div className="row g-4 text-center">
          
          {/* Tarjeta 1: Seguridad */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 p-4">
              <div className="card-body">
                <div className="mb-3">
                  <span className="fs-1">🛡️</span>
                </div>
                <h5 className="card-title fw-bold">Especialistas Verificados</h5>
                <p className="card-text text-muted">Revisamos los antecedentes y certificaciones de cada profesional para que tu hogar esté en buenas manos.</p>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Rapidez */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 p-4">
              <div className="card-body">
                <div className="mb-3">
                  <span className="fs-1">⚡</span>
                </div>
                <h5 className="card-title fw-bold">Respuestas Rápidas</h5>
                <p className="card-text text-muted">Conectamos tu solicitud con los técnicos más cercanos a tu comuna en tiempo real.</p>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Confianza */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100 p-4">
              <div className="card-body">
                <div className="mb-3">
                  <span className="fs-1">⭐</span>
                </div>
                <h5 className="card-title fw-bold">Calidad Garantizada</h5>
                <p className="card-text text-muted">Lee las evaluaciones de otros clientes y califica el servicio una vez que el trabajo esté terminado.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECCIÓN 2: ¿Cómo funciona ServiGo? */}
      <div className="bg-light py-5 my-5">
        <div className="container">
          <h3 className="text-center fw-bold mb-5">¿Cómo funciona ServiGo?</h3>
          <div className="row text-center">
            
            <div className="col-md-4 mb-4">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style={{width: '80px', height: '80px'}}>
                <span className="fs-2">🔍</span>
              </div>
              <h5 className="fw-bold">1. Busca</h5>
              <p className="text-muted">Encuentra al especialista ideal según tu necesidad y ubicación.</p>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style={{width: '80px', height: '80px'}}>
                <span className="fs-2">📅</span>
              </div>
              <h5 className="fw-bold">2. Reserva</h5>
              <p className="text-muted">Agenda la visita en el horario que mejor te acomode.</p>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style={{width: '80px', height: '80px'}}>
                <span className="fs-2">✅</span>
              </div>
              <h5 className="fw-bold">3. Soluciona</h5>
              <p className="text-muted">Recibe al especialista en tu hogar y resuelve el problema.</p>
            </div>

          </div>
        </div>
      </div>
      
    </>
  );
};