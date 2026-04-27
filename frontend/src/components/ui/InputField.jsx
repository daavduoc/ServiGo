// src/components/ui/InputField.jsx
import React from 'react';

export const InputField = ({ tipo = "text", placeholder, name }) => (
    <input 
        type={tipo} 
        className="input-caja" // Mantiene el estilo de ServiGo
        placeholder={placeholder} 
        name={name} 
    />
);