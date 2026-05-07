import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../section/SeccionUsuarioBase';

export const ClientRegisterView = () => {
    // 1. Campos del formulario (Estado local)
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '', id_rol: 1
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Manejo de cambios y Mayúsculas en direcciones
    const handleChange = (e) => {
        let { name, value } = e.target;
        const camposMayusculas = ['region', 'comuna', 'direccion'];
        if (camposMayusculas.includes(name)) value = value.toUpperCase();

        setFormData({ ...formData, [name]: value });
        if (error) setError(null);
    };

    // 3. Envío al Backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDACIÓN: Campos obligatorios
        const vacios = Object.values(formData).some(val => val === "");
        if (vacios) {
            setError("Rellene los campos obligatorios");
            return;
        }
        // VALIDACIÓN: Correo y Contraseña
        if (!formData.correo.includes('@')) return setError("El correo debe incluir @");
        if (formData.contrasena.length < 6) return setError("La contraseña debe tener al menos 6 dígitos");

        setIsLoading(true);

        // ADAPTADOR: Ajustamos los nombres de los campos para el Backend (RegistroUsuarioDTO)
        const dataParaBackend = {
            rut: formData.rut,
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.correo,
            contrasena: formData.contrasena,
            telefono: formData.telefono,
            tipoUsuario: "CLIENTE" // Texto que espera el Backend
        };

        try {
            const response = await fetch('http://localhost:8080/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataParaBackend)
            });

            if (response.ok) {
                alert("¡Cliente registrado con éxito!");
                // Aquí se redirigira a login: window.location.href = '/login';
            } else {
                setError("Error en el servidor al registrar");
            }
        } catch (err) {
            setError("No hay conexión con el servidor (Spring Boot)");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CardContainer titulo="Registro de Cliente">
            <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
                {/* Campos personales (Nombre, RUT, etc) */}
                <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                <hr />
                <MapSection label="Mi Ubicación" />
                <PhotoUpload label="Foto de Perfil" />

                {/* Mensaje de error rojo */}
                {error && <div className="alert alert-danger mt-3 text-center fw-bold">{error}</div>}

                <FormActions
                    onCancel={() => window.history.back()}
                    submitLabel={isLoading ? "Enviando..." : "Finalizar Registro"}
                    submitDisabled={isLoading}
                />
            </form>
        </CardContainer>
    );
};