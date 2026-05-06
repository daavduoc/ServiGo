import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../section/SeccionUsuarioBase';

export const ClientRegisterView = () => {
    // 1. Formulario inicial
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '', id_rol: 1
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Hace que los campos de direccion se almacenen en mayusculas
    const handleChange = (e) => {
        let { name, value } = e.target;

        // Regla de mayúsculas para direcciones
        const camposMayusculas = ['region', 'comuna', 'direccion'];
        if (camposMayusculas.includes(name)) {
            value = value.toUpperCase();
        }

        setFormData({ ...formData, [name]: value });
        // Limpia el error rojo al escribir correctamente
        if (error) setError(null);
    };

    // 3.Validaciones necesarias para el registroe exitoso
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Revisar si hay campos vacíos
        const vacios = Object.values(formData).some(val => val === "");
        if (vacios) {
            setError("Rellene los todos los campos");
            return;
        }

        // Regla del correo (@)
        if (!formData.correo.includes('@')) {
            setError("El correo debe ser válido (incluir @)");
            return;
        }

        // Regla de contraseña (6 dígitos)
        if (formData.contrasena.length < 6) {
            setError("La contraseña debe tener al menos 6 dígitos");
            return;
        }

        setIsLoading(true);
        // Aquí iría el envío a la base de datos
        console.log("Enviando cliente:", formData);
    };

    return (
        <CardContainer titulo="Registro de Cliente">
            <form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">

                {/* campos personales y direccion*/}
                <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                <hr />
                <MapSection label="Mi Ubicación" />
                <PhotoUpload label="Foto de Perfil" />

                {/* en caso de error de registro dara mensaje en rojo */}
                {error && (
                    <div className="alert alert-danger mt-3 text-center fw-bold">
                        {error}
                    </div>
                )}

                <FormActions
                    submitLabel={isLoading ? "Cargando..." : "Finalizar Registro"}
                    submitDisabled={isLoading}
                />
            </form>
        </CardContainer>
    );
};