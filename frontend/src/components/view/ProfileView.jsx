import React from 'react';

export const ProfileView = () => {
  // Datos de prueba para simular un técnico real
  const tecnico = {
    nombre: "Juan Pérez",
    profesion: "Gasfíter Certificado",
    calificacion: 4.8,
    trabajosRealizados: 124,
    descripcion: "Especialista en reparaciones de hogar, filtraciones y calefont con más de 10 años de experiencia. Certificación SEC vigente y disponibilidad inmediata en Puente Alto.",
    precioVisita: "$15.000",
    habilidades: ["Gasfitería", "Instalaciones", "Certificación SEC", "Reparación de Calefont"]
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Lado Izquierdo: Foto y Datos Rápidos */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <div className="bg-secondary bg-opacity-25 rounded-circle d-inline-flex justify-content-center align-items-center mb-3 mx-auto" style={{ width: '150px', height: '150px' }}>
              <span style={{ fontSize: '5rem' }}>👤</span>
            </div>
            <h3 className="fw-bold">{tecnico.nombre}</h3>
            <p className="text-muted">{tecnico.profesion}</p>
            <div className="mb-3 text-warning">
              <span className="fs-4">★ ★ ★ ★ ☆</span> 
              <span className="text-dark ms-2">({tecnico.calificacion})</span>
            </div>
            <hr />
            <div className="d-flex justify-content-around">
              <div>
                <p className="mb-0 fw-bold">{tecnico.trabajosRealizados}</p>
                <small className="text-muted">Trabajos</small>
              </div>
              <div>
                <p className="mb-0 fw-bold">{tecnico.precioVisita}</p>
                <small className="text-muted">Visita</small>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Descripción y Contratación */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-3">Sobre mí</h4>
            <p className="fs-5">{tecnico.descripcion}</p>
            
            <h5 className="fw-bold mt-4 mb-3">Especialidades</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {tecnico.habilidades.map((skill, index) => (
                <span key={index} className="badge bg-success bg-opacity-10 text-success px-3 py-2 border border-success">
                  {skill}
                </span>
              ))}
            </div>

            <div className="bg-light p-4 rounded-3 border-start border-success border-4 mt-auto">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1">¿Necesitas este servicio?</h5>
                  <p className="mb-0 text-muted">Contrata ahora y paga al finalizar el trabajo.</p>
                </div>
                <button className="btn btn-success btn-lg fw-bold px-5">Solicitar Servicio</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};