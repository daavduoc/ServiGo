import React from 'react';
import { FormRow } from '../ui';

export const SeccionUsuarioBase = ({ handleChange, formData }) => {
    return (
        <>
            <h5 className="text-primary mb-4 border-bottom pb-2">Datos Personales (Tabla USUARIO)</h5>
            <div className="row">
                <div className="col-12">
                    <FormRow label="RUT" name="rut" type="text" value={formData.rut} onChange={handleChange} placeholder="Ej: 12345678-9" />
                </div>
                <div className="col-12">
                    <FormRow label="Nombres" name="nombre" type="text" value={formData.nombre} onChange={handleChange} />
                </div>
                <div className="col-12">
                    <FormRow label="Apellidos" name="apellido" type="text" value={formData.apellido} onChange={handleChange} />
                </div>
                <div className="col-12">
                    <FormRow label="Correo Electrónico" name="correo" type="email" value={formData.correo} onChange={handleChange} />
                </div>
                <div className="col-12">
                    <FormRow label="Contraseña" name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} />
                </div>
                <div className="col-12">
                    <FormRow label="Teléfono" name="telefono" type="text" value={formData.telefono} onChange={handleChange} />
                </div>
            </div>

            <h5 className="text-primary mb-4 mt-4 border-bottom pb-2">Dirección (Tabla USUARIO)</h5>
            <div className="row">
                <div className="col-12">
                    <FormRow label="Región" name="region" type="text" value={formData.region} onChange={handleChange} />
                </div>
                <div className="col-12">
                    <FormRow label="Comuna" name="comuna" type="text" value={formData.comuna} onChange={handleChange} />
                </div>
                <div className="col-12">
                    <FormRow label="Dirección / Calle" name="direccion" type="text" value={formData.direccion} onChange={handleChange} />
                </div>
            </div>
        </>
    );
};