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
    <div className="support-view container py-4" style={{ maxWidth: '720px' }}>
      <h1 className="mb-3">Centro de Ayuda y Soporte</h1>
      <p className="mb-4">
        Una vista donde el usuario puede reportar problemas con una cita o con el reconocimiento facial directamente a los administradores.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="tipoProblema" className="form-label fw-bold">
            Tipo de problema
          </label>
          <select
            id="tipoProblema"
            className="form-select"
            value={tipoProblema}
            onChange={(event) => setTipoProblema(event.target.value)}
          >
            <option value="cita">Problema con una cita</option>
            <option value="reconocimiento">Problema con reconocimiento facial</option>
            <option value="otro">Otro problema</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="asunto" className="form-label fw-bold">
            Asunto
          </label>
          <input
            id="asunto"
            type="text"
            className="form-control"
            placeholder="Describe brevemente el problema"
            value={asunto}
            onChange={(event) => setAsunto(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label fw-bold">
            Descripción detallada
          </label>
          <textarea
            id="descripcion"
            className="form-control"
            placeholder="Explica lo que sucedió paso a paso"
            rows={5}
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <ButtonCustom texto="Enviar reporte" tipo="submit" color="primary" />
        </div>

        {mensaje && (
          <div className="alert alert-success" role="alert">
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
};

export default SupportView;
