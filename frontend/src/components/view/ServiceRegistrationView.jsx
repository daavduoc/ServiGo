// vista para registrar servicios
import React, { useState } from 'react';
import { ServiceForm } from '../sections/ServiceForm';

export const ServiceRegistrationView = () => {

    // El estado incluye los campos geográficos mapeados con tu BD
    const estadoInicial = {
        nombre: '',
        idEspecialidad: '',
        direccion: '',
        comuna: '',
        region: '',
        latitud: -33.4489,  // Santiago Centro por defecto
        longitud: -70.6693,
        fechas: [''],
        horarios: [''],
        descripcion: ''
    };

    const [formState, setFormState] = useState(estadoInicial);

    // Concatenación dinámica para tu MapSection
    const obtenerFullAddress = () => {
        const { direccion, comuna, region } = formState;
        // Formato limpio que asimila bien Nominatim OpenStreetMap
        return `${direccion}, ${comuna}, ${region}, Chile`;
    };

    const handleInputChange = (e, tipoArray = null, index = null) => {
        const { name, value } = e.target;

        if (tipoArray) {
            const nuevoArray = [...formState[tipoArray]];
            nuevoArray[index] = value;
            setFormState({ ...formState, [tipoArray]: nuevoArray });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };

    // Callback crucial: Extrae las coordenadas calculadas por tu componente MapSection
    const handleCoordsChange = ({ lat, lng }) => {
        setFormState(prevState => ({
            ...prevState,
            latitud: lat,
            longitud: lng
        }));
    };

    const handleAddFecha = () => {
        setFormState({ ...formState, fechas: [...formState.fechas, ''] });
    };

    const handleAddHora = () => {
        setFormState({ ...formState, horarios: [...formState.horarios, ''] });
    };

    const handleLimpiar = () => {
        setFormState(estadoInicial);
    };

    const handleGuardar = () => {
        // payload final mapeando camelCase a snake_case para Spring Boot / MySQL
        const payloadSQL = {
            id_especialidad: parseInt(formState.idEspecialidad),
            nombre: formState.nombre,
            descripcion: formState.descripcion,
            direccion: formState.direccion,
            comuna: formState.comuna,
            region: formState.region,
            latitud: formState.latitud,
            longitud: formState.longitud,
            modalidad: 'domicilio',
            estado: 'activo'
        };

        console.log("Payload listo para enviar a la BD en snake_case:", payloadSQL);
        // Aquí ejecutas tu petición fetch/axios
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <ServiceForm
                        formState={formState}
                        fullAddress={obtenerFullAddress()}
                        onInputChange={handleInputChange}
                        onCoordsChange={handleCoordsChange}
                        onAddFecha={handleAddFecha}
                        onAddHora={handleAddHora}
                        onLimpiar={handleLimpiar}
                        onGuardar={handleGuardar}
                    />
                </div>
            </div>
        </div>
    );
};