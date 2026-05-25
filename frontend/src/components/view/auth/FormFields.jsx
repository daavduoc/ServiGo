import React, { useState } from 'react';

export const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="form-label">
    {children}
    {required && <span className="text-danger"> *</span>}
  </label>
);

export const PasswordField = ({ id, name, value, onChange, label, required }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-3">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="registro-prestador-password-wrap">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          className="form-control"
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={name === 'contrasena' ? 'new-password' : 'off'}
        />
        <button
          type="button"
          className="registro-prestador-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
