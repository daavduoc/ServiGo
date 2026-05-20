import React from 'react';

// Este componente es un selector de roles para usarlo en registro de usuario
import { ButtonCustom } from './ButtonCustom';

export const RoleSelector = ({ label = "Tipo de Perfil" }) => {
    return (
        <div className="row mb-4 align-items-center">
            {/* Etiqueta alineada al estándar del formulario */}
            <label className="col-md-3 fw-bold text-secondary">
                {label}
            </label>

            {/* Contenedor de botones */}
            <div className="col-md-9 d-flex gap-2">
                <ButtonCustom 
                    texto="Cliente" 
                    color="outline-primary" 
                    className="w-50" 
                    onClick={() => console.log("Seleccionado: Cliente")}
                />
                <ButtonCustom 
                    texto="Prestador de Servicio" 
                    color="primary" 
                    className="w-50 shadow-sm" 
                    onClick={() => console.log("Seleccionado: Prestador")}
                />
            </div>
        </div>
    );
};