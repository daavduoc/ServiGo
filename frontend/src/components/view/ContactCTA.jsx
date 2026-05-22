import React from 'react';

export const ContactCTA = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container py-4">
        
        {/* =========================================
            SECCIÓN: TESTIMONIOS DE CLIENTES
        ========================================= */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <h3 className="fw-bold text-dark">Lo que dicen nuestros clientes</h3>
              <p className="text-muted">Personas reales, soluciones reales.</p>
            </div>
            
            <div className="row g-4">
              {/* Testimonio 1 */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-white border-top border-success border-4">
                  <div className="text-warning mb-2">
                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                  </div>
                  <p className="text-muted small fst-italic mb-4">
                    "Se me rompió una cañería a las 8 PM. Encontré un gasfíter en ServiGo en 5 minutos y llegó en media hora. Excelente servicio, muy profesional."
                  </p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <div className="bg-light text-success rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '40px', height: '40px' }}>
                      C
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Carolina P.</h6>
                      <small className="text-muted">Puente Alto</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonio 2 */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-white border-top border-success border-4">
                  <div className="text-warning mb-2">
                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                  </div>
                  <p className="text-muted small fst-italic mb-4">
                    "Necesitaba un kinesiólogo a domicilio para mi papá. Encontrar a alguien verificado y con tan buenas recomendaciones me dio mucha tranquilidad."
                  </p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <div className="bg-light text-success rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '40px', height: '40px' }}>
                      M
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Miguel A.</h6>
                      <small className="text-muted">La Florida</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonio 3 */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-white border-top border-success border-4">
                  <div className="text-warning mb-2">
                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-half"></i>
                  </div>
                  <p className="text-muted small fst-italic mb-4">
                    "La plataforma es súper fácil de usar. Agendé una limpieza profunda para mi departamento y el especialista fue puntual y muy detallista."
                  </p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <div className="bg-light text-success rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '40px', height: '40px' }}>
                      V
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Valentina R.</h6>
                      <small className="text-muted">Santiago Centro</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
};