import React, { useState } from 'react';
// Importamos los componentes de la interfaz
import { CardContainer, FormSelect, FormActions, FormRow, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../section/SeccionUsuarioBase';

export const ProviderRegisterView = () => {
    // 1. campos del prestador de servicio
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '',
        tipo_prestador: 'particular', descripcion: '', experiencia: '',
        direccion_local: '', nombre_comercial: '', id_rol: 2
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 2. datos de direccion a mayusculas
    const handleChange = (e) => {
        let { name, value } = e.target;
        const camposMayusculas = ['region', 'comuna', 'direccion', 'direccion_local'];
        if (camposMayusculas.includes(name)) value = value.toUpperCase();

        setFormData({ ...formData, [name]: value });
        if (error) setError(null); // Limpia el error al escribir
    };

    // 3. reglas y campos obligatorios
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Lista de campos que no pueden estar vacíos
        const camposBase = ['rut', 'nombre', 'apellido', 'correo', 'contrasena', 'region', 'comuna', 'direccion', 'descripcion'];
        const hayVacios = camposBase.some(f => !formData[f]);

        // Validación extra si es empresa
        const faltaEmpresa = formData.tipo_prestador === 'empresa' && !formData.nombre_comercial;

        if (hayVacios || faltaEmpresa) {
            setError("Rellene todos los campos");
            return;
        }

        if (!formData.correo.includes('@')) {
            setError("El correo debe incluir @");
            return;
        }

        if (formData.contrasena.length < 6) {
            setError("La contraseña debe tener al menos 6 dígitos");
            return;
        }

        setIsLoading(true);
        console.log("Registro exitoso:", formData);
    };

    return (
        <CardContainer titulo="Registro de Prestador ServiGO">
            <form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">

                {/* SECCIÓN 1: DATOS PERSONALES GENERALES */}
                <h5 className="text-primary mb-3 border-bottom pb-2">Datos Personales</h5>
                <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                <hr className="my-4" />

                {/* SECCIÓN 2: DATOS DEL SERVICIO */}
                <h5 className="text-primary mb-3 border-bottom pb-2">Perfil de Servicio</h5>
                <div className="row">
                    <div className="col-md-6">
                        <FormSelect
                            label="Tipo"
                            name="tipo_prestador"
                            value={formData.tipo_prestador}
                            options={[{ label: "Persona Particular", value: "particular" }, { label: "Empresa", value: "empresa" }]}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <FormRow label="Experiencia" name="experiencia" value={formData.experiencia} onChange={handleChange} />
                    </div>
                </div>

                {/* CAMPO DINÁMICO: SOLO SE MUESTRA SI ES EMPRESA */}
                {formData.tipo_prestador === 'empresa' && (
                    <div className="bg-light p-3 rounded mb-3 border">
                        <FormRow label="Nombre Empresa" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleChange} />
                    </div>
                )}

                <FormRow label="Descripción de Servicio" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                <FormRow label="Dirección Local" name="direccion_local" value={formData.direccion_local} onChange={handleChange} />

                <hr className="my-4" />

                {/* SECCIÓN 3: UBICACIÓN Y ARCHIVOS (Aquí usamos los componentes del Warning) */}
                <h5 className="text-primary mb-3 border-bottom pb-2">Ubicación y Validación</h5>
                <div className="mb-4">
                    <MapSection label="Zona de Cobertura" />
                </div>
                <div className="mb-4">
                    <PhotoUpload label="Foto de Perfil o Logo" />
                </div>

                {/* MENSAJE DE ERROR EN ROJO */}
                {error && (
                    <div className="alert alert-danger mt-3 text-center fw-bold">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </div>
                )}

                <FormActions
                    onCancel={() => window.history.back()}
                    submitLabel={isLoading ? "Procesando..." : "Finalizar Registro"}
                    submitDisabled={isLoading}
                />
            </form>
        </CardContainer>
    );
};