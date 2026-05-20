import React from 'react';

export const ContactCTA = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="row g-0">
                
                {/* LADO IZQUIERDO: Mensaje y Contacto (Fondo Verde) */}
                <div className="col-md-5 bg-success text-white p-5 d-flex flex-column justify-content-center">
                  <h3 className="fw-bold mb-3">¿No sabes por dónde empezar?</h3>
                  <p className="mb-4" style={{ fontSize: '0.95rem', opacity: '0.9' }}>
                    Déjanos tus datos y un asesor de ServiGo te contactará a la brevedad para entender tu necesidad y conectarte con el especialista ideal.
                  </p>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-white text-success rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px' }}>
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <span className="fw-medium">+56 9 1234 5678</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-white text-success rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px' }}>
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    {/* AQUÍ ACTUALIZAMOS EL CORREO */}
                    <span className="fw-medium">Contacto.servigo@gmail.com</span>
                  </div>
                </div>
                
                {/* LADO DERECHO: Formulario (Fondo Blanco) */}
                <div className="col-md-7 p-5">
                  <h4 className="fw-bold text-dark mb-4">Te contactamos</h4>
                  <form>
                    <div className="mb-3">
                      <label className="form-label small text-muted fw-medium">Nombre completo</label>
                      <input type="text" className="form-control" placeholder="Ej. Juan Pérez" />
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label small text-muted fw-medium">Teléfono</label>
                        <input type="tel" className="form-control" placeholder="+56 9..." />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label small text-muted fw-medium">Servicio que buscas</label>
                        <select className="form-select text-muted">
                          <option value="">Selecciona una opción...</option>
                          <option value="gasfiteria">Gasfitería</option>
                          <option value="electricidad">Electricidad</option>
                          <option value="kinesiologia">Kinesiología</option>
                          <option value="aseo">Aseo y Limpieza</option>
                          <option value="otro">Otro / No estoy seguro</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small text-muted fw-medium">Breve descripción (Opcional)</label>
                      <textarea className="form-control" rows="2" placeholder="Cuéntanos un poco sobre lo que necesitas..."></textarea>
                    </div>
                    
                    <button type="button" className="btn btn-success w-100 rounded-pill fw-bold py-2 shadow-sm">
                      Solicitar Contacto
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};