import React, { useState } from 'react';

export const ServiceDetailView = () => {
  // Mock: Datos del servicio seleccionado (Ejemplo: Gasfitería)
  const [servicio] = useState({
    titulo: "Reparación e Instalación de Calefón y Cañerías",
    proveedor: "Juan Pérez",
    rubro: "Gasfíter Certificado SEC",
    calificacion: "⭐ 4.8 (24 evaluaciones)",
    comuna: "Puente Alto",
    precioBase: "$25.000",
    descripcion: "Servicio técnico profesional especializado en la reparación, mantención e instalación de calefones de todas las marcas y sistemas de cañerías de agua o gas. Cuento con certificación SEC vigente para garantizar la máxima seguridad en tu hogar. El valor base incluye la visita de diagnóstico y trabajos menores de reparación.",
    puntosClave: [
      "Instalación bajo norma SEC vigente.",
      "Detección y reparación de fugas de agua/gas.",
      "Garantía de 3 meses por el trabajo realizado.",
      "Disponibilidad de herramientas avanzadas."
    ]
  });

  // Estados para el agendamiento
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Horas simuladas disponibles
  const bloquesHorarios = ["09:00", "11:00", "14:30", "16:30"];

  // ==========================================
  // LÓGICA DE CONTROL DE TIEMPO ACTUAL
  // ==========================================
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  
  // Obtiene la fecha de hoy en formato "YYYY-MM-DD"
  const fechaHoyString = `${anio}-${mes}-${dia}`; 

  // Obtiene la hora actual en formato "HH:MM"
  const horaActualString = String(hoy.getHours()).padStart(2, '0') + ":" + String(hoy.getMinutes()).padStart(2, '0');
  // ==========================================

  const handleAgendar = (e) => {
    e.preventDefault();
    if (!fechaSeleccionada || !horaSeleccionada) {
      alert("Por favor, selecciona una fecha y una hora para continuar.");
      return;
    }

    // Validación de seguridad extra por si acaso
    if (fechaSeleccionada === fechaHoyString && horaSeleccionada < horaActualString) {
      alert("El horario seleccionado ya ha pasado. Por favor, elige un bloque posterior.");
      return;
    }

    setMensajeExito(`¡Excelente! Tu cita para "${servicio.titulo}" con ${servicio.proveedor} ha sido reservada con éxito para el día ${fechaSeleccionada} a las ${horaSeleccionada} hrs.`);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '1000px' }}>
      
      {mensajeExito ? (
        /* Alerta de Éxito al agendar */
        <div className="card border-0 shadow-sm p-5 text-center rounded-4 bg-white mt-3">
          <span className="display-1 mb-3">🎉</span>
          <h3 className="fw-bold text-success">¡Reserva Confirmada!</h3>
          <p className="text-muted mx-auto mt-2" style={{ maxWidth: '550px' }}>{mensajeExito}</p>
          <div className="mt-4">
            <button className="btn btn-success px-4 py-2 rounded-3 me-2" onClick={() => window.location.href='/mis-reservas'}>
              Ver mis reservas
            </button>
            <button className="btn btn-outline-secondary px-4 py-2 rounded-3" onClick={() => setMensajeExito('')}>
              Volver al inicio
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          
          {/* COLUMNA IZQUIERDA: Detalle del Anuncio */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white h-100">
              
              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1.5 fs-6 fw-semibold align-self-start mb-3">
                {servicio.rubro}
              </span>
              
              <h2 className="fw-bold text-dark mb-2">{servicio.titulo}</h2>
              
              <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mb-4">
                <span>👤 Por: <strong>{servicio.proveedor}</strong></span>
                <span>{servicio.calificacion}</span>
                <span>📍 {servicio.comuna}, Chile</span>
              </div>

              <h5 className="fw-bold text-dark mb-2">Sobre el servicio</h5>
              <p className="text-secondary lh-base mb-4 small">{servicio.descripcion}</p>

              <h5 className="fw-bold text-dark mb-3">¿Qué incluye este servicio?</h5>
              <ul className="list-unstyled row g-2 mb-4">
                {servicio.puntosClave.map((punto, index) => (
                  <li key={index} className="col-md-6 text-secondary small d-flex align-items-start gap-2">
                    <span className="text-success">✔</span> {punto}
                  </li>
                ))}
              </ul>

              <div className="bg-light p-3 rounded-3 mt-auto d-flex justify-content-between align-items-center border-start border-success border-4">
                <div>
                  <small className="text-muted d-block text-uppercase fw-bold">Valor del Servicio</small>
                  <span className="fs-3 fw-bold text-success">{servicio.precioBase}</span>
                </div>
                <small className="text-muted text-end">Precio base<br />incluye diagnóstico</small>
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA: Calendario y Agenda */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white h-100 border-top border-success border-4">
              <h4 className="fw-bold text-dark mb-3">📅 Agendar Cita</h4>
              <p className="text-muted small mb-4">Selecciona los días disponibles del especialista para reservar tu bloque.</p>

              <form onSubmit={handleAgendar}>
                
                {/* Selector de Fecha */}
                <div className="mb-4">
                  <label htmlFor="fecha" className="form-label small fw-bold text-secondary">
                    1. Selecciona la fecha
                  </label>
                  <input 
                    type="date" 
                    id="fecha"
                    className="form-control border-2 focus-success"
                    min={fechaHoyString} // Restringe los días anteriores dinámicamente
                    value={fechaSeleccionada}
                    onChange={(e) => {
                      setFechaSeleccionada(e.target.value);
                      setHoraSeleccionada(''); // Resetea la hora elegida al cambiar de día
                    }}
                    required
                  />
                </div>

                {/* Bloques de Horas */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary d-block mb-2">
                    2. Selecciona una hora disponible
                  </label>
                  <div className="row g-2">
                    {bloquesHorarios.map((hora) => {
                      // Evaluamos si el bloque ya pasó únicamente si se seleccionó el día de hoy
                      const esHoy = fechaSeleccionada === fechaHoyString;
                      const horaPasada = esHoy && hora < horaActualString;

                      return (
                        <div key={hora} className="col-6">
                          <button
                            type="button"
                            className={`btn w-100 py-2.5 rounded-3 fw-medium transition-all small ${
                              horaSeleccionada === hora 
                                ? 'btn-success text-white shadow-sm' 
                                : 'btn-outline-secondary border-2 hover-hour'
                            }`}
                            onClick={() => setHoraSeleccionada(hora)}
                            disabled={horaPasada} // Deshabilita el botón si la hora ya pasó
                            style={horaPasada ? { cursor: 'not-allowed', opacity: 0.4 } : {}}
                          >
                            {horaPasada ? '❌ Pasado' : `🕒 ${hora} hrs`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botón de Acción Principal */}
                <div className="d-grid mt-4 pt-2">
                  <button type="submit" className="btn btn-success py-2 fw-bold text-white shadow-sm hover-btn-success">
                    {fechaSeleccionada && horaSeleccionada ? `Confirmar para el ${fechaSeleccionada}` : "Selecciona fecha y hora"}
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      )}

      <style>{`
        .hover-hour:hover:not(:disabled) {
          border-color: #198754 !important;
          color: #198754 !important;
          background-color: #f0fff4 !important;
        }
        .focus-success:focus {
          border-color: #198754 !important;
          box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25) !important;
        }
        .transition-all {
          transition: all 0.15s ease-in-out;
        }
        .hover-btn-success:hover {
          background-color: #157347;
        }
      `}</style>
    </div>
  );
};