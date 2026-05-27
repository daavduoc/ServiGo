import React from 'react';

export const InfoGeneralSection = ({
  nombre, setNombre,
  area,
  precio, setPrecio,
  modalidad, setModalidad,
  descripcion, setDescripcion,
}) => {
  return (
    <div className="card border-0 shadow-sm p-4 mb-4 bg-white animate__animated animate__fadeIn">
      <h4 className="profile-panel-title mb-4">
        <i className="bi bi-pencil-square" />
        Información General del Servicio
      </h4>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Nombre del Servicio</label>
          <input
            type="text"
            className="form-control"
            placeholder="ej: Desarrollador de App"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Área / Especialidad</label>
          <input
            type="text"
            className="form-control bg-light text-secondary fw-semibold"
            value={area}
            disabled
            readOnly
            placeholder="Sin especialidad asignada"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Precio Referencial ($)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Ej: 25000"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Modalidad de Servicio</label>
          <select
            className="form-select"
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
          >
            <option value="Domicilio">A Domicilio</option>
            <option value="Establecido">En Establecimiento</option>
            <option value="Online">Online / Remoto</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label fw-bold">Descripción del Servicio</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="ej: Desarrollador Fullstack con especialidad en paginas web responsivas con React"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
      </div>
    </div>
  );
};
