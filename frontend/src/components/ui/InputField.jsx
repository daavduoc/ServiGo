import React from 'react';

// Cuadros de texto generico para formulario
export const InputField = ({ label, tipo = 'text', placeholder, name }) => {
    return (
        /* input-contenedor viene de tu App.css corporativo */
        <div className="input-contenedor">
            {label && (
                <label className="input-etiqueta">
                    {label}
                </label>
            )}
            <input
                type={tipo}
                /* input-caja aplica el molde de ServiGo */
                className="input-caja"
                placeholder={placeholder}
                name={name}
            />
        </div>
    );
};
