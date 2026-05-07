import React from 'react';
import { useForm } from '../../hooks/useForm';
import { registerUserInDB } from '../../serviceFront/userService';

// Importamos los componentes desdee la UI
import { 
    CardContainer, 
    FormRow, 
    FormSelect, 
    FormActions, 
    PhotoUpload, 
    MapSection 
} from '../ui';
// fin de las importaciondes desde la UI

export const RegisterView = () => {
    // coneccion con el hook con todos los campos necesarios para las tablas SQL
    const { formData, handleChange } = useForm({
        tipo: '', 
        tipo_persona: '',
        nombre: '', rut: '', mail: '', fono: '', direccion: '',
        nombre_comercial: '', 
        descripcion: '', experiencia: '', direccion_local: ''
    });
    // fin de la coneccion con el hook

    // Opciones para los Selects clientes prestadores y tipo de persona individual o empresa
    const opcionesTipo = [
        { label: "Quiero contratar servicios (Cliente)", value: "cliente" },
        { label: "Quiero ofrecer servicios (Prestador)", value: "prestador" }
    ];

    const opcionesPersona = [
        { label: "Particular", value: "individual" },
        { label: "Empresa", value: "empresa" }
    ];
    // fin de las opciones para los Selects

    // Envío de datos a BD
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos listos para enviar al Backend/SQL:", formData);
        await registerUserInDB(formData);
        alert("¡Registro enviado! Revisa la consola.");
    };
 
    return (
        <CardContainer titulo="Registro ServiGO">
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-white">
                
                {/*CLASIFICACIÓN de usaurios */}
                <h5 className="text-primary mb-3">¿Que es lo que quieres?</h5>
                
                {/* cliente/prestador */}
                <FormSelect 
                    label="¿Como te registraras?" 
                    name="tipo" 
                    options={opcionesTipo} 
                    onChange={handleChange} 
                />
                
                {/* particular / empresa */}
                <FormSelect 
                    label="¿Particular o Empresa?" 
                    name="tipo_persona" 
                    options={opcionesPersona} 
                    onChange={handleChange} 
                />
                
                <hr className="my-4" />

                {/* DATOS PERSONALES (Común para todoslos usuarios)  */}
                <h5 className="text-primary mb-3">Datos de Identificación</h5>
                
                <FormRow label="Nombre Completo" name="nombre" placeholder="Ej: Juan Pérez" onChange={handleChange} />
                <FormRow label="RUT" name="rut" placeholder="12.345.678-9" onChange={handleChange} />
                <FormRow label="Correo" name="mail" tipo="email" placeholder="correo@ejemplo.com" onChange={handleChange} />
                <FormRow label="Fono" name="fono" placeholder="+56 9 1234 5678" onChange={handleChange} />
                <FormRow label="Dirección" name="direccion" placeholder="Calle Falsa 123" onChange={handleChange} />

                {/*/DATOS DE EMPRESA (Aparece solo si elige "empresa") */}
                {formData.tipo_persona === 'empresa' && (
                    <div className="bg-light p-3 rounded mb-3 border">
                        <h6 className="text-secondary">Información de la Empresa</h6>
                        <FormRow label="Nombre Comercial" name="nombre_comercial" placeholder="Nombre de tu negocio" onChange={handleChange} />
                    </div>
                )}

                {/* DATOS DE PRESTADOR de servicios(Aparece solo si elige "prestador") */}
                {formData.tipo === 'prestador' && (
                    <div className="bg-light p-3 rounded mb-3 border">
                        <h6 className="text-secondary">Perfil Profesional (Para validación)</h6>
                        <FormRow label="Años de Experiencia" name="experiencia" placeholder="Ej: 5 años" onChange={handleChange} />
                        <FormRow label="Descripción" name="descripcion" placeholder="¿Qué servicios ofreces?" onChange={handleChange} />
                        <FormRow label="Dirección del Local" name="direccion_local" placeholder="(Opcional) Si atiendes en un lugar físico" onChange={handleChange} />
                        <p className="small text-danger mt-2 mb-0">
                            * Nota: Tu cuenta pasará a estado de revisión por un administrador antes de ser publicada.
                        </p>
                    </div>
                )}

                <hr className="my-4" />

                {/*  MAPA */}
                <MapSection label="Tu ubicación en el mapa" />
                
                {/* Aquí está el componente de la foto intacto */}
                <PhotoUpload />

                {/* terminos y condiciones y botones*/}
                <div className="my-4 border-top pt-3">
                    <input type="checkbox" id="check" required className="me-2" />
                    <label htmlFor="check" className="small text-muted">Acepto los términos, condiciones y el tratamiento de datos de ServiGO.</label>
                </div>

                <FormActions onCancel={() => window.history.back()} />
            </form>
        </CardContainer>
    );
};