import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';

// importaciones modulares
import { authValidations } from '../../../utils/authValidations';
import { registrarUsuario } from '../../../serviceFront/authService';

export const ClientRegisterView = () => {
    // campos de registro
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '', id_rol: 1,
        latitud: '', longitud: ''
    });

    // Maneja mensajes de error de validación o servidor
    const [error, setError] = useState(null);
    // Controla el estado visual del botón de envío
    const [isLoading, setIsLoading] = useState(false);

    // actualiza los cambios generados en los campos de texto
    const handleChange = (e) => {
        let { name, value } = e.target;

        // Filtro para campos de ubicación
        const camposMayusculas = ['region', 'comuna', 'direccion'];
        if (camposMayusculas.includes(name)) value = value.toUpperCase();

        setFormData({ ...formData, [name]: value });

        // Si el usuario empieza a escribir, se asume que intenta corregir un error previo.
        if (error) setError(null);
    };

    // MapSection logra geolocalizar la dirección escrita por el usuario.
    const handleMapCoords = (coords) => {
        setFormData(prev => ({ ...prev, latitud: coords.lat, longitud: coords.lng }));
        if (error) setError(null);
    };

    // Envio de formulario (handleSubmit): Procesa el registro final.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // invoca authValidation
        const errorValidacion = authValidations(formData);
        if (errorValidacion) return setError(errorValidacion);

        // Desactiva botones para evitar envíos duplicados.
        setIsLoading(true);

        // Agregamos el discriminador para el DTO de Spring Boot.
        const dataParaBackend = { ...formData, tipoUsuario: "CLIENTE" };

        try {

            await registrarUsuario(dataParaBackend);

            alert("¡Registro de Cliente exitoso!");
            // opcional: generar una redirección: navigate('/login') pendiente

        } catch (err) {
            // manejo de error devueltos por el servicio o caídas de red
            setError(err.message || "Servidor no disponible");
        } finally {
            setIsLoading(false);
        }
    };

    // Une los campos de direccion en un string legible
    const direccionParaMapa = `${formData.direccion}, ${formData.comuna}, ${formData.region}, Chile`;

    return (
        <CardContainer titulo="Registro de Cliente">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">

                    {/* sección 1: Campos comunes (Modularizado para reutilización) */}
                    <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                    <hr className="my-4" />

                    {/* sección 2: Mapa. Escucha cambios en direccionParaMapa y devuelve coordenadas */}
                    <div className="col-12 mb-3">
                        <MapSection
                            label="Verificación de Geolocalización"
                            fullAddress={direccionParaMapa}
                            onCoordsChange={handleMapCoords}
                        />
                    </div>

                    {/* sección 3: Carga de imagen de perfil */}
                    <div className="col-12 mb-3"><PhotoUpload label="Foto de Perfil" /></div>

                    {/* alerta: Solo se muestra si el estado 'error' contiene un mensaje */}
                    {error && <div className="alert alert-danger mt-3 text-center fw-bold">{error}</div>}

                    {/* accion: Botones de enviar y cancelar con lógica de bloqueo por carga */}
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