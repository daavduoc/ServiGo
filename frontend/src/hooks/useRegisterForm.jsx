import { useState } from 'react';

export const useRegisterForm = (rolAsignado) => {
    const [formData, setFormData] = useState({
        // Campos base (Tabla USUARIO)
        rut: '', nombre: '', apellido: '', correo: '', contrasena: '',
        telefono: '', direccion: '', comuna: '', region: '', id_rol: rolAsignado,
        // Campos Prestador/Empresa
        tipo_prestador: rolAsignado === 2 ? 'particular' : '',
        descripcion: '', experiencia: '', direccion_local: '', nombre_comercial: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // MÓDULO DE NORMALIZACIÓN: Transforma a MAYÚSCULAS campos específicos
    const normalizarDato = (name, value) => {
        const camposMayusculas = ['region', 'comuna', 'direccion', 'direccion_local'];
        return camposMayusculas.includes(name) ? value.toUpperCase() : value;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (error) setError(null);

        const valorProcesado = normalizarDato(name, value);

        setFormData(prev => ({
            ...prev,
            [name]: valorProcesado
        }));
    };

    const validarFormulario = () => {
        const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
        if (!rutRegex.test(formData.rut)) {
            setError("RUT inválido. Formato: 12345678-9 (sin puntos)");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            setError("Correo electrónico no válido.");
            return false;
        }
        return true;
    };

    const registerUser = async () => {
        if (!validarFormulario()) return;
        setIsLoading(true);
        try {
            console.log("Enviando a DB:", formData);
            await new Promise(res => setTimeout(res, 1500));
        } catch (err) {
            setError("Error de servidor.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, handleChange, registerUser, isLoading, error };
};