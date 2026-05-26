// validaciones para el Registro de Usuario comun Cliente y prestador de servicio

export const authValidations = (formData) => {
    const camposRequeridos = ['rut', 'nombre', 'apellido', 'correo', 'contrasena', 'telefono'];
    const faltanDatos = camposRequeridos.some(campo => !formData[campo] || String(formData[campo]).trim() === '');

    // regla todos los campos deben ser rellenados
    if (faltanDatos) return "Rellene todos los campos obligatorios.";

    //regla de rut con guion
    if (!String(formData.rut).includes('-')) return "El RUT debe incluir guion (ej: 12345678-9)";

    // uso de @ en correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(formData.correo)) return "Ingresa un correo electrónico válido.";

    if (formData.contrasena.length < 8 || formData.contrasena.length > 20) return "La contraseña debe tener entre 8 y 20 caracteres.";

    // reglas de contraseña
    const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!regexContrasena.test(formData.contrasena)) return "La contraseña debe incluir al menos una mayúscula, una minúscula y un número.";

    // Lógica para el mapa automático
    if (!formData.latitud || !formData.longitud) {
        return "Por favor, completa tu Región, Comuna y Dirección, y espera un segundo a que el mapa te ubique automáticamente.";
    }

    // Validación de edad mínima 18 años (solo aplica si hay fecha de nacimiento)
    if (formData.fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(formData.fechaNacimiento + 'T00:00:00');
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mesDiff = hoy.getMonth() - nacimiento.getMonth();
        if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        if (edad < 18) return "Debes tener al menos 18 años para registrarte como prestador.";
    }

    return null;
};