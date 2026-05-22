// Definición de rutas (Apuntando a tu Spring Boot en 8080)
const API_URL_AUTH = 'http://localhost:8080/auth';
const API_URL_USUARIOS = 'http://localhost:8080/usuarios';
const API_URL_CLOUDINARY = 'http://localhost:8080/cloudinary';

// Cabeceras para usar ÚNICAMENTE en rutas privadas que requieran Token JWT
const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {};

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

const parseApiError = async (response, fallback) => {
    const text = await response.text().catch(() => '');
    try {
        const data = JSON.parse(text);
        if (data?.error) return data.error;
        if (typeof data === 'object' && data !== null) {
            const first = Object.values(data)[0];
            if (first) return String(first);
        }
    } catch {
        // respuesta plana
    }
    return text || fallback;
};

const extraerUrlCloudinary = (data) => {
    if (!data) return null;
    if (typeof data === 'string') return data;
    return data.secure_url || data.secureUrl || data.url || null;
};

/** Sube imagen vía Spring → Cloudinary */
export const subirFotoCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL_CLOUDINARY}/upload`, {
            method: 'POST',
            headers: getAuthHeaders(true), // Usa multipart/form-data automático
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen a la nube');
        }

        const data = await response.json();
        const url = extraerUrlCloudinary(data);
        if (!url) {
            throw new Error('Cloudinary no devolvió la URL de la imagen');
        }
        return url;
    } catch (error) {
        console.error('Error en subirFotoCloudinary:', error);
        throw error;
    }
};

const CAMPOS_REGISTRO_FORM = [
    'rut', 'nombre', 'apellido', 'correo', 'contrasena', 'telefono',
    'direccion', 'comuna', 'region', 'latitud', 'longitud', 'tipoUsuario',
    'tipoPrestador', 'idCategoria', 'idEmpresa', 'direccionLocal', 'fotoUrl'
];

const appendRegistroFields = (formData, userData) => {
    CAMPOS_REGISTRO_FORM.forEach((key) => {
        const value = userData[key];
        if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
        }
    });
};

/** Sincronizado con VincularFotoRegistroDTO */
export const vincularFotoRegistro = async (correo, fotoUrl) => {
    const response = await fetch(`${API_URL_USUARIOS}/registro/vincular-foto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, fotoUrl }), // Genera exactamente VincularFotoRegistroDTO
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'No se pudo guardar la foto en el perfil');
    }
};

/** Registro multipart con Foto */
export const registrarUsuarioConFoto = async (userData, file) => {
    try {
        const formData = new FormData();
        appendRegistroFields(formData, userData);
        if (file) {
            formData.append('file', file);
        }

        const response = await fetch(`${API_URL_USUARIOS}/registro-con-foto`, {
            method: 'POST',
            body: formData, // El navegador gestiona el Content-Type automáticamente
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al registrar en el servidor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en registrarUsuarioConFoto:', error);
        throw error;
    }
};

/** Iniciar sesión - Sincronizado Estricto con LoginRequestDTO */
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                correo: credentials.correo,
                contrasena: credentials.contrasena
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Credenciales incorrectas');
        }

        return await response.json(); // Retorna LoginResponseDTO
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};

/** Verificar correo - Sincronizado con ValidarCodigoDTO */
export const verificarCorreo = async ({ correo, codigo }) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/verificar-correo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, codigo }),
        });

        if (!response.ok) {
            throw new Error(await parseApiError(response, 'Código de verificación inválido'));
        }

        return await response.text();
    } catch (error) {
        console.error('Error en verificarCorreo:', error);
        throw error;
    }
};

/** Reenviar código */
export const reenviarCodigoVerificacion = async ({ correo }) => {
    try {
        // Nota: Si tu backend espera un DTO o un parámetro simple, se envía como JSON estructurado
        const response = await fetch(`${API_URL_AUTH}/reenviar-codigo-verificacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo }),
        });

        if (!response.ok) {
            throw new Error(await parseApiError(response, 'No se pudo reenviar el código'));
        }

        return await response.text();
    } catch (error) {
        console.error('Error en reenviarCodigoVerificacion:', error);
        throw error;
    }
};

/** Recuperación de contraseña - Sincronizado con RecuperarPasswordDTO */
export const recoverPassword = async (emailData) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/recuperar-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: emailData.correo })
        });

        if (!response.ok) {
            throw new Error('Error al solicitar recuperación');
        }

        return await response.text();
    } catch (error) {
        console.error("Error en recoverPassword:", error);
        throw error;
    }
};

/** Registrar usuario - Sincronizado con RegistroUsuarioDTO */
export const registrarUsuario = async (dataUsuario) => {
    try {
        const response = await fetch(`${API_URL_USUARIOS}/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataUsuario), // Mapea directo las propiedades de RegistroUsuarioDTO
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al registrar en el servidor");
        }

        const usuario = await response.json();

        if (dataUsuario.fotoUrl) {
            await vincularFotoRegistro(dataUsuario.correo, dataUsuario.fotoUrl);
        }

        return usuario; // Retorna UsuarioResponseDTO
    } catch (error) {
        console.error("Error en registrarUsuario:", error);
        throw error;
    }
};