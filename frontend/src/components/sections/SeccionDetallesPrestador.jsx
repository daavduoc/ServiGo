import React from 'react';
import { FormSelect, FormRow } from '../ui';

//Esta seccion agrupará todos los campos específicos del prestador de servicio
export const SeccionDetallesPrestador = ({ formData, handleChange }) => {
    return (
        <>
            <h5 className="text-primary mb-4 border-bottom pb-2">Datos del Servicio</h5>

            <div className="col-12">
                <FormSelect
                    label="Tipo de Prestador"
                    name="tipo_prestador"
                    value={formData.tipo_prestador}
                    options={[
                        { label: "Particular", value: "particular" },
                        { label: "Empresa", value: "empresa" }
                    ]}
                    onChange={handleChange}
                />
            </div>

            <div className="col-12">
                <FormRow
                    label="Años de Experiencia"
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleChange}
                />
            </div>

            {formData.tipo_prestador === 'empresa' && (
                <div className="col-12">
                    <FormRow
                        label="Nombre Comercial (Empresa)"
                        name="nombre_comercial"
                        value={formData.nombre_comercial}
                        onChange={handleChange}
                    />
                </div>
            )}

            <div className="col-12">
                <FormRow
                    label="Descripción de servicios"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                />
            </div>

            <div className="col-12">
                <FormRow
                    label="Dirección del Local"
                    name="direccion_local"
                    value={formData.direccion_local}
                    onChange={handleChange}
                    placeholder="Ej: Av. Providencia 1234"
                />
            </div>
        </>
    );
};