import React from 'react';
import { FormRow } from '../../../components/ui';


export const SeccionUsuarioBase = ({ handleChange, formData }) => {
    return (
        <>
            <FormRow
                label="RUT (Sin puntos y con guión)"
                name="rut"
                placeholder="12345678-9"
                value={formData.rut}
                onChange={handleChange}
            />

            <FormRow
                label="Nombre"
                name="nombre"
                placeholder="Ej: Juan"
                value={formData.nombre}
                onChange={handleChange}
            />
            <FormRow
                label="Apellido"
                name="apellido"
                placeholder="Ej: Pérez"
                value={formData.apellido}
                onChange={handleChange}
            />
            <FormRow
                label="Correo"
                name="correo"
                tipo="email"
                placeholder="juan@ejemplo.com"
                value={formData.correo}
                onChange={handleChange}
            />
            <FormRow
                label="Contraseña"
                name="contrasena"
                tipo="password"
                value={formData.contrasena}
                onChange={handleChange}
            />
            <FormRow
                label="Teléfono"
                name="telefono"
                placeholder="+56 9..."
                value={formData.telefono}
                onChange={handleChange}
            />

            {/* los campos de direccion se veran en mayusculas automáticamente al escribir */}
            <FormRow
                label="Región"
                name="region"
                value={formData.region}
                onChange={handleChange}
            />
            <FormRow
                label="Comuna"
                name="comuna"
                value={formData.comuna}
                onChange={handleChange}
            />
            <FormRow
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
            />
        </>
    );
};