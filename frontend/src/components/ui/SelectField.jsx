import React from 'react';

// cuadro de opciones para formulario basico, se usara para seleccionar tipo usuario

export const SelectField = ({ label, name, opciones }) => {
    return (
        <div className="mb-3">
            <label className="form-label fw-bold text-dark">{label}</label>
            <select className="form-select" name={name} defaultValue="">
                <option value="" disabled>Selecciona una opción...</option>
                {opciones.map((opcion, index) => (
                    <option key={index} value={opcion.valor}>
                        {opcion.texto}
                    </option>
                ))}
            </select>
        </div>
    );
};