import React, { useState } from 'react';
import { CardContainer, FormSelect, FormActions, FormRow, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../section/SeccionUsuarioBase';

export const ProviderRegisterView = () => {
    // 1. Campos específicos para Prestador
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '',
        tipo_prestador: 'particular', descripcion: '', experiencia: '',
        direccion_local: '', nombre_comercial: '', id_rol: 2
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Manejo de cambios y Mayúsculas
    const handleChange = (e) => {
        let { name, value } = e.target;
        const camposMayusculas = ['region', 'comuna', 'direccion', 'direccion_local'];
        if (camposMayusculas.includes(name)) value = value.toUpperCase();

        setFormData({ ...formData, [name]: value });
        if (error) setError(null);
    };

    // 3. Envío al Backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDACIÓN: Campos base obligatorios
        const camposBase = ['rut', 'nombre', 'apellido', 'correo', 'contrasena', 'region', 'comuna', 'direccion', 'descripcion'];
        const hayVacios = camposBase.some(f => !formData[f]);
        if (hayVacios) return setError("Rellene los campos obligatorios");

        // VALIDACIÓN: Correo y Contraseña
        if (!formData.correo.includes('@')) return setError("Correo inválido");
        if (formData.contrasena.length < 6) return setError("La contraseña debe tener al menos 6 dígitos");

        setIsLoading(true);

        // ADAPTADOR: Enviamos solo lo que el Backend (RegistroUsuarioDTO) acepta hoy
        const dataParaBackend = {
            rut: formData.rut,
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.correo,
            contrasena: formData.contrasena,
            telefono: formData.telefono,
            tipoUsuario: "PRESTADOR", // Identificador para el Service de Java
            tipoPrestador: formData.tipo_prestador // punto ajustado al nombre del DTO
        };

        try {
            const response = await fetch('http://localhost:8080/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataParaBackend)
            });

            if (response.ok) {
                alert("¡Prestador registrado con éxito!");
            } else {
                setError("Error al procesar el registro en el servidor");
            }
        } catch (err) {
            setError("Error de red: Verifique si el Backend está encendido");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CardContainer titulo="Registro de Prestador">
            <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">

                {/* Sección Datos Personales */}
                <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                <hr className="my-4" />
                <h5 className="text-primary mb-3">Información del Servicio</h5>

                <div className="row">
                    <div className="col-md-6">
                        <FormSelect
                            label="Tipo de Prestador" name="tipo_prestador" value={formData.tipo_prestador}
                            options={[{ label: "Particular", value: "particular" }, { label: "Empresa", value: "empresa" }]}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <FormRow label="Años de Experiencia" name="experiencia" value={formData.experiencia} onChange={handleChange} />
                    </div>
                </div>

                {/* Mostrar nombre de empresa solo si corresponde */}
                {formData.tipo_prestador === 'empresa' && (
                    <FormRow label="Nombre de Fantasía" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleChange} />
                )}

                <FormRow label="Descripción Breve" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                <FormRow label="Dirección Comercial" name="direccion_local" value={formData.direccion_local} onChange={handleChange} />

                <hr className="my-4" />
                <MapSection label="Zona de Cobertura" />
                <PhotoUpload label="Foto/Logo" />

                {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}

                <FormActions
                    onCancel={() => window.history.back()}
                    submitLabel={isLoading ? "Registrando..." : "Finalizar Registro"}
                    submitDisabled={isLoading}
                />
            </form>
        </CardContainer>
    );
};