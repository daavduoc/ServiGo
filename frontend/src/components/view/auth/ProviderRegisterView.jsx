import React, { useState } from 'react';
import { CardContainer, FormSelect, FormActions, FormRow, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';

export const ProviderRegisterView = () => {
    const [formData, setFormData] = useState({
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '',
        tipo_prestador: 'particular', descripcion: '', experiencia: '',
        direccion_local: '', nombre_comercial: '', id_rol: 2
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const camposAValidar = ['rut', 'nombre', 'apellido', 'correo', 'contrasena', 'region', 'comuna', 'direccion', 'descripcion'];
        if (formData.tipo_prestador === 'empresa') camposAValidar.push('nombre_comercial');

        const tieneVacios = camposAValidar.some(f => !formData[f]);
        if (tieneVacios) return setError("Rellene todos los campos para seguir con el registro");
        if (!formData.rut.includes('-')) return setError("El RUT debe incluir guion");

        setIsLoading(true);
        const dataParaBackend = { ...formData, tipoUsuario: "PRESTADOR", tipoPrestador: formData.tipo_prestador };

        try {
            const response = await fetch('http://localhost:8080/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataParaBackend)
            });
            if (response.ok) alert("¡Registro de Prestador exitoso!");
            else setError("Error en el servidor");
        } catch (err) {
            setError("No se pudo conectar con el Backend");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CardContainer titulo="Registro de Prestador">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
                    <SeccionUsuarioBase handleChange={handleChange} formData={formData} />

                    <hr className="my-4" />
                    <h5 className="text-primary mb-4 border-bottom pb-2">Datos del Servicio</h5>

                    <div className="col-12">
                        <FormSelect
                            label="Tipo de Prestador" name="tipo_prestador" value={formData.tipo_prestador}
                            options={[{ label: "Particular", value: "particular" }, { label: "Empresa", value: "empresa" }]}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <FormRow label="Años de Experiencia" name="experiencia" value={formData.experiencia} onChange={handleChange} />
                    </div>

                    {formData.tipo_prestador === 'empresa' && (
                        <div className="col-12">
                            <FormRow label="Nombre Comercial (Empresa)" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleChange} />
                        </div>
                    )}

                    <div className="col-12">
                        <FormRow label="Descripción de servicios" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                    </div>

                    <div className="col-12">
                        <FormRow label="Dirección del Local" name="direccion_local" value={formData.direccion_local} onChange={handleChange} />
                    </div>

                    <hr className="my-4" />
                    <div className="col-12 mb-3"><MapSection label="Mapa de Geolocalización" /></div>
                    <div className="col-12 mb-3"><PhotoUpload label="Foto de Perfil / Logo" /></div>

                    {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}

                    <FormActions
                        onCancel={() => window.history.back()}
                        submitLabel={isLoading ? "Registrando..." : "Registrar Prestador"}
                        submitDisabled={isLoading}
                    />
                </form>
            </div>
        </CardContainer>
    );
};