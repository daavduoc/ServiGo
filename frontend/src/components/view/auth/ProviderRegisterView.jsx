import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';

// Ya NO importamos SeccionDetallesPrestador

import { authValidations } from '../../../utils/authValidations';
// Importamos subirFotoCloudinary para los dos pasos
import { registrarUsuario, subirFotoCloudinary } from '../../../serviceFront/authService';

export const ProviderRegisterView = () => {
    // 1. Estado limpio: Sin experiencia, descripción, ni direccionLocal
    const [formData, setFormData] = useState({
        rut: '',
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        telefono: '',
        direccion: '',
        comuna: '',
        region: '',
        tipoPrestador: 'particular',
        idRol: 2,
        latitud: '',
        longitud: '',
        fotoPerfil: null
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target;
        const camposMayusculas = ['region', 'comuna', 'direccion'];
        if (camposMayusculas.includes(name)) value = value.toUpperCase();

        setFormData({ ...formData, [name]: value });
        if (error) setError(null);
    };

    const handleImageChange = (archivo) => {
        setFormData(prev => ({ ...prev, fotoPerfil: archivo }));
    };

    const handleMapCoords = (coords) => {
        setFormData(prev => ({ ...prev, latitud: coords.lat, longitud: coords.lng }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorValidacion = authValidations(formData);
        if (errorValidacion) return setError(errorValidacion);

        setIsLoading(true);
        setError(null);

        try {
            let urlFotoCloudinary = null;

            // PASO 1: Subir foto a Cloudinary si existe
            if (formData.fotoPerfil) {
                urlFotoCloudinary = await subirFotoCloudinary(formData.fotoPerfil);
            }

            // PASO 2: Armar JSON limpio para el DTO
            const dataParaBackend = {
                rut: formData.rut,
                nombre: formData.nombre,
                // Si es empresa, el apellido va vacío
                apellido: formData.tipoPrestador === 'empresa' ? '' : formData.apellido,
                correo: formData.correo,
                contrasena: formData.contrasena,
                telefono: formData.telefono,
                direccion: formData.direccion,
                comuna: formData.comuna,
                region: formData.region,
                tipoPrestador: formData.tipoPrestador.toUpperCase(),
                idRol: formData.idRol,
                latitud: formData.latitud,
                longitud: formData.longitud,
                tipoUsuario: "PRESTADOR",
                fotoUrl: urlFotoCloudinary // URL obtenida de Cloudinary
            };

            await registrarUsuario(dataParaBackend);

            alert("¡Registro de Prestador exitoso!");
            window.location.href = "/login";

        } catch (err) {
            setError(err.message || "Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    // Usamos la dirección general para el mapa, ya que quitamos direccionLocal
    const direccionParaMapa = `${formData.direccion}, ${formData.comuna}, ${formData.region}, Chile`;

    return (
        <CardContainer titulo="Registro de Prestador">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">

                    {/* Selector de Tipo de Prestador */}
                    <div className="mb-4 p-3 border rounded bg-light">
                        <label className="form-label fw-bold text-primary">¿Cómo deseas registrarte?</label>
                        <select
                            className="form-select shadow-sm"
                            name="tipoPrestador"
                            value={formData.tipoPrestador}
                            onChange={handleChange}
                        >
                            <option value="particular">Persona Natural (Particular)</option>
                            <option value="empresa">Persona Jurídica (Empresa)</option>
                        </select>
                        <small className="text-muted d-block mt-1">
                            Esto adaptará los campos del formulario automáticamente.
                        </small>
                    </div>

                    {/* Datos Base y Dirección */}
                    <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                    <hr className="my-4" />

                    {/* Mapa y Foto */}
                    <div className="col-12 mb-3">
                        <MapSection label="Verificación de Geolocalización" fullAddress={direccionParaMapa} onCoordsChange={handleMapCoords} />
                    </div>

                    <div className="col-12 mb-3">
                        <PhotoUpload
                            label={formData.tipoPrestador === 'empresa' ? "Logo de la Empresa" : "Foto de Perfil"}
                            onImageSelect={handleImageChange}
                        />
                    </div>

                    {error && <div className="alert alert-danger mt-3 text-center fw-bold">{error}</div>}

                    <FormActions
                        onCancel={() => window.history.back()}
                        submitLabel={isLoading ? "Procesando..." : "Finalizar Registro"}
                        submitDisabled={isLoading}
                    />
                </form>
            </div>
        </CardContainer>
    );
};