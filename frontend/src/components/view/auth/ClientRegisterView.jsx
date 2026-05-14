import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';

// IMPORTANTE: Asegúrate de importar la función subirFotoCloudinary
import { authValidations } from '../../../utils/authValidations';
import { registrarUsuario, subirFotoCloudinary } from '../../../serviceFront/authService';

export const ClientRegisterView = () => {
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
        idRol: 1,
        latitud: '',
        longitud: '',
        fotoPerfil: null // Archivo físico de la foto
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
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorValidacion = authValidations(formData);
        if (errorValidacion) return setError(errorValidacion);

        setIsLoading(true);
        setError(null);

        try {
            let urlFotoCloudinary = null;

            // PASO 1: Si hay foto, la subimos PRIMERO a Cloudinary
            if (formData.fotoPerfil) {
                // Llamamos a tu función que sube el FormData solo con la foto
                urlFotoCloudinary = await subirFotoCloudinary(formData.fotoPerfil);
            }

            // PASO 2: Armamos el JSON con los textos y la URL que nos devolvió Cloudinary
            const dataParaBackend = {
                rut: formData.rut,
                nombre: formData.nombre,
                apellido: formData.apellido,
                correo: formData.correo,
                contrasena: formData.contrasena,
                telefono: formData.telefono,
                direccion: formData.direccion,
                comuna: formData.comuna,
                region: formData.region,
                idRol: formData.idRol,
                latitud: formData.latitud,
                longitud: formData.longitud,
                tipoUsuario: "CLIENTE",
                // Le pasamos la URL como texto al backend
                fotoUrl: urlFotoCloudinary
            };

            // Llamamos a tu función de registro que envía el JSON
            await registrarUsuario(dataParaBackend);

            alert("¡Registro de Cliente exitoso!");
            window.location.href = "/login";

        } catch (err) {
            setError(err.message || "Error al registrar en el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    const direccionParaMapa = `${formData.direccion}, ${formData.comuna}, ${formData.region}, Chile`;

    return (
        <CardContainer titulo="Registro de Cliente">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
                    <SeccionUsuarioBase handleChange={handleChange} formData={formData} />
                    <hr className="my-4" />
                    <div className="col-12 mb-3">
                        <MapSection
                            label="Verificación de Geolocalización"
                            fullAddress={direccionParaMapa}
                            onCoordsChange={handleMapCoords}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <PhotoUpload
                            label="Foto de Perfil"
                            onImageSelect={handleImageChange}
                        />
                    </div>
                    {error && <div className="alert alert-danger mt-3 text-center fw-bold">{error}</div>}
                    <FormActions
                        onCancel={() => window.history.back()}
                        submitLabel={isLoading ? "Enviando..." : "Registrar Cliente"}
                        submitDisabled={isLoading}
                    />
                </form>
            </div>
        </CardContainer>
    );
};