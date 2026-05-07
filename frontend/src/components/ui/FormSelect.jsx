import React from 'react';

export const FormSelect = ({ label, name, options, onChange, value }) => (
  <div className="row mb-3 align-items-center">
    <label className="col-md-3 fw-bold text-secondary">{label}</label>
    <div className="col-md-9">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-select"
        style={{ borderRadius: '8px' }}
      >
        <option value="">Seleccione una opción...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);