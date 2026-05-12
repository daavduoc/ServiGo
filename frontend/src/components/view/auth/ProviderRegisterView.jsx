import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';

import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';
import { SeccionDetallesPrestador } from '../../sections/SeccionDetallesPrestador';

// importaciones modulares
import { authValidations } from '../../../utils/authValidations';
import { registrarUsuario } from '../../../serviceFront/authService';

export const ProviderRegisterView = () => {
    // 1. Centralizamos el estado con los campos que pide el reporte técnico
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
        tipo_prestador: 'particular', // Valor por defecto
        id_categoria: '',
        descripcion: '',
        experiencia: '',
        direccion_local: '',
        id_rol: 2,
        latitud: '',
        longitud: '',
        foto_perfil: null // Para guardar el archivo de imagen
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Captura entradas y normaliza direcciones
    const handleChange = (e) => {
        let { name, value } = e.target;
        const camposMayusculas = ['region', 'comuna', 'direccion', 'direccion_local'];
        if (camposMayusculas.includes(name)) value = value.toUpperCase();

        setFormData({ ...formData, [name]: value });
        if (error) setError(null);
    };

    // Captura la foto desde el componente PhotoUpload
    const handleImageChange = (archivo) => {
        setFormData(prev => ({ ...prev, foto_perfil: archivo }));
    };

    // Captura coordenadas del mapa
    const handleMapCoords = (coords) => {
        setFormData(prev => ({ ...prev, latitud: coords.lat, longitud: coords.lng }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones (debes asegurar que authValidations acepte el nuevo esquema)
        const errorValidacion = authValidations(formData);
        if (errorValidacion) return setError(errorValidacion);

        setIsLoading(true);

        // 2. IMPORTANTE: Usamos FormData para enviar textos + archivos
        const data = new FormData();
        data.append('rut', formData.rut);
        data.append('nombre', formData.nombre);
        // Si es empresa, mandamos apellido vacío como pide el backend
        data.append('apellido', formData.tipo_prestador === 'empresa' ? '' : formData.apellido);
        data.append('correo', formData.correo);
        data.append('contrasena', formData.contrasena);
        data.append('telefono', formData.telefono);
        data.append('direccion', formData.direccion);
        data.append('comuna', formData.comuna);
        data.append('region', formData.region);
        data.append('tipoPrestador', formData.tipo_prestador.toUpperCase());
        data.append('idCategoria', formData.id_categoria);
        data.append('descripcion', formData.descripcion);
        data.append('experiencia', formData.experiencia);
        data.append('direccionLocal', formData.direccion_local);
        data.append('idRol', formData.id_rol);
        data.append('latitud', formData.latitud);
        data.append('longitud', formData.longitud);
        data.append('tipoUsuario', "PRESTADOR");

        if (formData.foto_perfil) {
            data.append('foto_perfil', formData.foto_perfil);
        }

        try {
            await registrarUsuario(data);
            alert("¡Registro de Prestador exitoso!");
            window.location.href = "/login"; // Redirigir al éxito
        } catch (err) {
            setError(err.message || "Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    const direccionParaMapa = `${formData.direccion_local}, ${formData.comuna}, ${formData.region}, Chile`;

    return (
        <CardContainer titulo="Registro de Prestador">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">

                    {/* --- PASO 1: TIPO DE PRESTADOR (Movido al inicio) --- */}
                    <div className="mb-4 p-3 border rounded bg-light">
                        <label className="form-label fw-bold text-primary">¿Cómo deseas registrarte?</label>
                        <select
                            className="form-select shadow-sm"
                            name="tipo_prestador"
                            value={formData.tipo_prestador}
                            onChange={handleChange}
                        >
                            <option value="particular">Persona Natural (Particular)</option>
                            <option value="empresa">Persona Jurídica (Empresa)</option>
                        </select>
                        <small className="text-muted d-block mt-1">
                            Esto adaptará los campos del formulario automáticamente.
                        </small>
                    </div>

                    {/* --- PASO 2: DATOS BASE (Nombre/Apellido condicional) --- */}
                    <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                    <hr className="my-4" />

                    {/* --- PASO 3: DETALLES (Categoría, Descrip, etc) --- */}
                    <SeccionDetallesPrestador handleChange={handleChange} formData={formData} />

                    <hr className="my-4" />

                    {/* --- PASO 4: MAPA Y FOTO --- */}
                    <div className="col-12 mb-3">
                        <MapSection label="Ubicación del Local/Servicio" fullAddress={direccionParaMapa} onCoordsChange={handleMapCoords} />
                    </div>

                    <div className="col-12 mb-3">
                        <PhotoUpload
                            label="Foto de Perfil o Logo de Empresa"
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