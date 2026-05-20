// Definición de rutas (Apuntando a tu Spring Boot en 8080)
const API_URL_AUTH = 'http://localhost:8080/auth';
const API_URL_USUARIOS = 'http://localhost:8080/usuarios';
const API_URL_CLOUDINARY = 'http://localhost:8080/cloudinary'; // Nueva ruta para fotos

// Cabeceras para usar en Spring Boot 
const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {};

    // Si enviamos fotos (FormData), el navegador pone el Content-Type solo con el boundary.
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};


const extraerUrlCloudinary = (data) => {
    if (!data) return null;
    if (typeof data === 'string') return data;
    return data.secure_url || data.secureUrl || data.url || null;
};

export const subirFotoCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL_CLOUDINARY}/upload`, {
            method: 'POST',
            headers: getAuthHeaders(true),
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error al subir la imagen a la nube");
        }

        const data = await response.json();
        const url = extraerUrlCloudinary(data);
        if (!url) {
            throw new Error('Cloudinary no devolvió la URL de la imagen');
        }
        return url;
    } catch (error) {
        console.error("Error en subirFotoCloudinary:", error);
        throw error;
    }
};

const CAMPOS_REGISTRO_FORM = [
    'rut', 'nombre', 'apellido', 'correo', 'contrasena', 'telefono',
    'direccion', 'comuna', 'region', 'latitud', 'longitud', 'tipoUsuario',
    'tipoPrestador', 'idCategoria', 'idEmpresa', 'direccionLocal',
];

const appendRegistroFields = (formData, userData) => {
    CAMPOS_REGISTRO_FORM.forEach((key) => {
        const value = userData[key];
        if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
        }
    });
};

export const vincularFotoRegistro = async (correo, fotoUrl) => {
    const response = await fetch(`${API_URL_USUARIOS}/registro/vincular-foto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, fotoUrl }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'No se pudo guardar la foto en el perfil');
    }
};

/** Registro multipart: crea usuario y sube la foto en el servidor (recomendado). */
export const registrarUsuarioConFoto = async (userData, file) => {
    try {
        const formData = new FormData();
        appendRegistroFields(formData, userData);
        formData.append('file', file);

        const response = await fetch(`${API_URL_USUARIOS}/registro-con-foto`, {
            method: 'POST',
            body: formData,
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

// Iniciar sesión
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/login`, {
            method: 'POST',
            headers: getAuthHeaders(false),
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Credenciales incorrectas');
        }

        return await response.json();
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};

// Recuperación de contraseña
export const recoverPassword = async (emailData) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/recuperar-password`, {
            method: 'POST',
            headers: getAuthHeaders(false),
            body: JSON.stringify(emailData)
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

// Registrar usuario (Recibe el objeto con la URL de la foto ya lista)
export const registrarUsuario = async (dataUsuario) => {
    try {
        const { fotoUrl, ...resto } = dataUsuario;
        const response = await fetch(`${API_URL_USUARIOS}/registro`, {
            method: 'POST',
            headers: getAuthHeaders(false),
            body: JSON.stringify({ ...resto, fotoUrl }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al registrar en el servidor");
        }

        const usuario = await response.json();

        if (fotoUrl) {
            await vincularFotoRegistro(dataUsuario.correo, fotoUrl);
        }

        return usuario;
    } catch (error) {
        console.error("Error en registrarUsuario:", error);
        throw error;
    }
};