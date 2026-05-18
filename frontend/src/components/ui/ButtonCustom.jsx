import React from 'react';

// Boton generico
export const ButtonCustom = ({ texto, onClick, tipo = "button", color = "primary", className = "", disabled = false }) => {
  return (
    <button
      type={tipo}
      className={`btn btn-${color} w-100 fw-bold ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {texto}
    </button>
  );
};