// Agrega horas de disposicion o fechas de servicio dinamicamente en el formulario de generacion de servicio (modificar segun necesidad)
import React from 'react';
import { obtenerFechaMinimaNativa } from '../../utils/dateUtils';
import '../../assets/css/genServiceView.css'; // sube a src y entra a assets

export const DynamicArrayInput = ({ type = 'text', label, items, placeholder, onChange }) => {
  
  const agregarCasilla = () => onChange([...items, '']);

  const actualizarValor = (index, value) => {
    const nuevosItems = [...items];
    nuevosItems[index] = value;
    onChange(nuevosItems);
  };

  const eliminarCasilla = (index) => {
    if (items.length === 1) {
      onChange(['']); 
    } else {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  const obtenerClaseAncho = (tipo) => {
    if (tipo === 'date') return 'input-dinamico-fecha';
    if (tipo === 'time') return 'input-dinamico-hora';
    return 'input-dinamico-texto';
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold text-secondary small">{label}</label>
      <div className="d-flex flex-wrap gap-2 align-items-center">
        
        {items.map((item, index) => (
          <div key={index} className="d-flex align-items-center gap-1 mb-1 position-relative">
            <input
              type={type}
              className={`form-control registro-cliente-input-lg ${obtenerClaseAncho(type)}`}
              value={item}
              placeholder={placeholder}
              min={type === 'date' ? obtenerFechaMinimaNativa() : undefined}
              onChange={(e) => actualizarValor(index, e.target.value)}
              required
            />
            {items.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger border-0 position-absolute end-0 top-50 translate-middle-y me-1 px-1 py-0"
                onClick={() => eliminarCasilla(index)}
              >
                <i className="bi bi-x" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-success rounded-3 px-3 d-flex align-items-center justify-content-center btn-agregar-dinamico"
          onClick={agregarCasilla}
        >
          <i className="bi bi-plus-lg fs-5" />
        </button>

      </div>
    </div>
  );
};