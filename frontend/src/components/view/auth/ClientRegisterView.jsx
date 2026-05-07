import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';

export const ClientRegisterView = () => {
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '', id_rol: 1,
        latitud: '', longitud: ''
        // lat y lng datos incvisibles
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

    //para recibir las coordenadas desde el mapa
    const handleMapCoords = (coords) => {
        setFormData(prev => ({
            ...prev,
            latitud: coords.lat,
            longitud: coords.lng
        }));
        if (error) setError(null);
        // Limpiamos errores si sincronizan el mapa
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Excluye temporalmente latitud y longitud de la validación inicial de texto
        const camposTexto = ['rut', 'nombre', 'apellido', 'correo', 'contrasena', 'telefono', 'direccion', 'comuna', 'region'];
        const tieneVacios = camposTexto.some(campo => !formData[campo]);

        if (tieneVacios) return setError("Rellene todos los campos de texto para seguir con el registro");
        if (!formData.rut.includes('-')) return setError("El RUT debe incluir guion (ej: 12345678-9)");

        // Validamos que hayan presionado el botón del mapa
        if (!formData.latitud || !formData.longitud) {
            return setError("Por favor, haz clic en 'Sincronizar Mapa' para verificar tu ubicación");
        }

        setIsLoading(true);
        const dataParaBackend = { ...formData, tipoUsuario: "CLIENTE" };

        try {
            const response = await fetch('http://localhost:8080/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataParaBackend)
            });
            if (response.ok) alert("¡Registro de Cliente exitoso!");
            else setError("Error al conectar con el servidor");
        } catch (err) {
            setError("Servidor no disponible");
        } finally {
            setIsLoading(false);
        }
    };


    // Se agregan comas y la palabra "Chile" para que la búsqueda sea exacta
    const direccionParaMapa = `${formData.direccion}, ${formData.comuna}, ${formData.region}, Chile`;

    return (
        <CardContainer titulo="Registro de Cliente">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
                    <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                    <hr className="my-4" />

                    {/* dirección y la función al MapSection */}
                    <div className="col-12 mb-3">
                        <MapSection
                            label="Verificación de Geolocalización"
                            fullAddress={direccionParaMapa}
                            onCoordsChange={handleMapCoords}
                        />
                    </div>

                    <div className="col-12 mb-3"><PhotoUpload label="Foto de Perfil" /></div>

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