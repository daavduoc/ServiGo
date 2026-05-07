import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';
import { SeccionDetallesPrestador } from '../../sections/SeccionDetallesPrestador'; // Importamos el nuevo

// campos
export const ProviderRegisterView = () => {
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '',
        tipo_prestador: 'particular', descripcion: '', experiencia: '',
        direccion_local: '', nombre_comercial: '', id_rol: 2,
        latitud: '', longitud: ''
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target;
        const camposMayusculas = ['region', 'comuna', 'direccion', 'direccion_local'];
        if (camposMayusculas.includes(name)) value = value.toUpperCase();
        setFormData({ ...formData, [name]: value });
        if (error) setError(null);
    };

    const handleMapCoords = (coords) => {
        setFormData(prev => ({ ...prev, latitud: coords.lat, longitud: coords.lng }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.latitud) return setError("Por favor, espera a que el mapa ubique tu dirección");

        setIsLoading(true);

        setIsLoading(false);
    };

    const direccionParaMapa = `${formData.direccion_local}, ${formData.comuna}, ${formData.region}, Chile`;

    return (
        <CardContainer titulo="Registro de Prestador">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
                    {/* PARTE 1: Datos de Usuario */}
                    <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                    <hr className="my-4" />

                    {/* PARTE 2: Datos Específicos del Prestador (Modularizado) */}
                    <SeccionDetallesPrestador handleChange={handleChange} formData={formData} />

                    <hr className="my-4" />

                    {/* PARTE 3: Mapa y foto */}
                    <div className="col-12 mb-3">
                        <MapSection label="Ubicación del Local" fullAddress={direccionParaMapa} onCoordsChange={handleMapCoords} />
                    </div>
                    <div className="col-12 mb-3"><PhotoUpload label="Foto de Perfil / Logo" /></div>

                    {error && <div className="alert alert-danger mt-3 text-center fw-bold">{error}</div>}
                    <FormActions onCancel={() => window.history.back()} submitLabel={isLoading ? "Registrando..." : "Registrar Prestador"} submitDisabled={isLoading} />
                </form>
            </div>
        </CardContainer>
    );
};