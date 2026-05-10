import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';
import { SeccionDetallesPrestador } from '../../sections/SeccionDetallesPrestador';

// importaciones modulares
import { authValidations } from '../../../utils/authValidations'; // Reglas de validación
import { registrarUsuario } from '../../../serviceFront/authService';

export const ProviderRegisterView = () => {
    // Centraliza todos los campos necesarios para el backend
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '',
        tipo_prestador: 'particular', descripcion: '', experiencia: '',
        direccion_local: '', nombre_comercial: '', id_rol: 2,
        latitud: '', longitud: ''
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Captura entradas y normaliza direcciones a MAYÚSCULAS
    const handleChange = (e) => {
        let { name, value } = e.target;
        const camposMayusculas = ['region', 'comuna', 'direccion', 'direccion_local'];
        if (camposMayusculas.includes(name)) value = value.toUpperCase();

        setFormData({ ...formData, [name]: value });
        // Limpia errores mientras el usuario escribe
        if (error) setError(null);
    };

    // MAPA: Recibe lat/lng automáticamente desde el componente MapSection
    const handleMapCoords = (coords) => {
        setFormData(prev => ({ ...prev, latitud: coords.lat, longitud: coords.lng }));
        if (error) setError(null);
    };

    // Valida y procesa el registro
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorValidacion = authValidations(formData);
        if (errorValidacion) return setError(errorValidacion);

        setIsLoading(true);
        const dataParaBackend = { ...formData, tipoUsuario: "PRESTADOR" };

        try {
            // parte modular 
            await registrarUsuario(dataParaBackend);

            alert("¡Registro de Prestador exitoso!");

        } catch (err) {
            // mensaje de error si no hay servidor
            setError(err.message || "Servidor no disponible");
        } finally {
            setIsLoading(false);
        }
    };

    // Construye la dirección completa para que el mapa busque la ubicación
    const direccionParaMapa = `${formData.direccion_local}, ${formData.comuna}, ${formData.region}, Chile`;

    return (
        <CardContainer titulo="Registro de Prestador">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
                    {/* Componentes modulares que comparten el estado */}
                    <SeccionUsuarioBase handleChange={handleChange} formData={formData} />
                    <hr className="my-4" />
                    <SeccionDetallesPrestador handleChange={handleChange} formData={formData} />
                    <hr className="my-4" />

                    {/* El mapa es el que rellena latitud y longitud automáticamente */}
                    <div className="col-12 mb-3">
                        <MapSection label="Ubicación del Local" fullAddress={direccionParaMapa} onCoordsChange={handleMapCoords} />
                    </div>

                    <div className="col-12 mb-3"><PhotoUpload label="Foto de Perfil / Logo" /></div>

                    {error && <div className="alert alert-danger mt-3 text-center fw-bold">{error}</div>}

                    <FormActions
                        onCancel={() => window.history.back()}
                        submitLabel={isLoading ? "Registrando..." : "Registrar Prestador"}
                        submitDisabled={isLoading}
                    />
                </form>
            </div>
        </CardContainer>
    );
};