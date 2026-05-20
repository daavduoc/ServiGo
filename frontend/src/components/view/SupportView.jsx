import React, { useState } from 'react';
import { ButtonCustom } from '../ui/ButtonCustom';

const SupportView = () => {
  const [tipoProblema, setTipoProblema] = useState('cita');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setMensaje('Tu reporte ha sido preparado. Cuando el backend esté listo, se enviará a los administradores.');
    setAsunto('');
    setDescripcion('');
    setTipoProblema('cita');
  };

  return (
    <div className="support-view container py-4" style={{ maxWidth: '650px' }}>
      <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
        <div className="card-body">
          
          {/* Título principal más pequeño (h4) */}
          <div className="d-flex align-items-center mb-3">
            <span className="fs-4 me-2"></span>
            <h4 className="fw-bold m-0 text-dark">Centro de Ayuda y Soporte</h4>
          </div>
          
          {/* Texto descriptivo con clase 'small' para que se vea más fino */}
          <p className="text-muted small mb-4 lh-base">
            Tu experiencia nos importa. Si encuentras algún inconveniente con tus citas o el reconocimiento facial, háznoslo saber aquí. Nuestro equipo de soporte está listo para escucharte y ayudarte a resolverlo lo antes posible.
          </p>

          <hr className="text-muted mb-4" />

          <form onSubmit={handleSubmit}>
            {/* Tipo de problema (Tamaño estándar) */}
            <div className="mb-3">
              <label htmlFor="tipoProblema" className="form-label small fw-bold text-secondary">
                 Tipo de problema
              </label>
              <select
                id="tipoProblema"
                className="form-select border-2"
                value={tipoProblema}
                onChange={(event) => setTipoProblema(event.target.value)}
              >
                <option value="cita">Problema con una cita</option>
                <option value="reconocimiento">Problema con reconocimiento facial</option>
                <option value="otro">Otro problema</option>
              </select>
            </div>

            {/* Asunto (Tamaño estándar) */}
            <div className="mb-3">
              <label htmlFor="asunto" className="form-label small fw-bold text-secondary">
                 Asunto
              </label>
              <input
                id="asunto"
                type="text"
                className="form-control border-2"
                placeholder="Describe brevemente el problema"
                value={asunto}
                onChange={(event) => setAsunto(event.target.value)}
                required
              />
            </div>

            {/* Descripción (Tamaño estándar) */}
            <div className="mb-4">
              <label htmlFor="descripcion" className="form-label small fw-bold text-secondary">
                 Descripción detallada
              </label>
              <textarea
                id="descripcion"
                className="form-control border-2"
                placeholder="Explica lo que sucedió paso a paso..."
                rows={4}
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                required
              />
            </div>

            {/* Botón de envío */}
            <div className="d-grid mb-2">
              <ButtonCustom texto="Enviar reporte" tipo="submit" color="success" />
            </div>

            {/* Alerta de Éxito */}
            {mensaje && (
              <div className="alert alert-success border-0 shadow-sm mt-3 p-2 rounded-3 d-flex align-items-center small" role="alert">
                <span className="fs-6 me-2">✅</span>
                <div>{mensaje}</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportView;