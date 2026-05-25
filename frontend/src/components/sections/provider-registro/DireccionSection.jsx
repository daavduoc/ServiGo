import React from 'react';
import { REGIONES } from '../../view/auth/formConstants';

// Inicio seccion de dirección del prestador
export const DireccionSection = ({ formData, handleChange, esEmpresa }) => (
  <>
    <h5 className="registro-section-title mt-4">
      {esEmpresa ? 'Dirección del local o sede principal' : 'Dirección'}
    </h5>

    <div className="row g-3">
      <div className="col-md-6">
        <label htmlFor="region" className="form-label">
          Región <span className="text-danger">*</span>
        </label>
        <select
          id="region" name="region" className="form-select"
          value={formData.region} onChange={handleChange} required
        >
          <option value="">Selecciona región</option>
          {REGIONES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label htmlFor="comuna" className="form-label">
          Comuna <span className="text-danger">*</span>
        </label>
        <input
          id="comuna" name="comuna" className="form-control"
          value={formData.comuna} onChange={handleChange}
          placeholder="Ej: PROVIDENCIA" required
        />
      </div>

      <div className="col-12">
        <label htmlFor="direccion" className="form-label">
          Dirección / Calle <span className="text-danger">*</span>
        </label>
        <input
          id="direccion" name="direccion" className="form-control"
          value={formData.direccion} onChange={handleChange}
          placeholder="Calle, número, depto." required
        />
      </div>
    </div>
  </>
);
// Fin seccion de dirección del prestador