// Definición de rutas (Apuntando a tu Spring Boot en 8080)
const API_URL_AUTH = 'http://localhost:8080/auth';
const API_URL_USUARIOS = 'http://localhost:8080/usuarios';
const API_URL_CLOUDINARY = 'http://localhost:8080/cloudinary';

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


export const normalizarCorreo = (correo) => {
    if (correo == null) return '';
    return String(correo).trim().toLowerCase();
};

const prepararDatosRegistro = (userData) => {
    if (!userData) return userData;
    return {
        ...userData,
        correo: normalizarCorreo(userData.correo),
    };
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

/** Sube imagen vía Spring → Cloudinary; devuelve la URL segura. */
export const subirFotoCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL_CLOUDINARY}/upload`, {
            method: 'POST',
            headers: getAuthHeaders(true),
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
    'fechaNacimiento', 'direccion', 'comuna', 'region', 'latitud', 'longitud', 'tipoUsuario',
    'tipoPrestador', 'idCategoria', 'idEmpresa', 'direccionLocal',
    'razonSocial', 'nombreFantasia', 'giroComercial', 'rutEmpresa', 'especialidad',
];

export const subirFotoRegistro = async (idUsuario, file) => {
    if (!idUsuario || !file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetchRegistroPublico(
        `${API_URL_USUARIOS}/registro/${idUsuario}/foto`,
        { method: 'POST', body: formData }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'No se pudo subir la foto de perfil');
    }
};

export const subirCertificacionesRegistro = async (idPrestador, files) => {
    if (!idPrestador || !files?.length) return [];

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await fetchRegistroPublico(
        `${API_URL_USUARIOS}/registro/prestador/${idPrestador}/certificaciones`,
        { method: 'POST', body: formData }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'No se pudieron subir los certificados');
    }

    return response.json();
};

const appendRegistroFields = (formData, userData) => {
    CAMPOS_REGISTRO_FORM.forEach((key) => {
        const value = userData[key];
        if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
        }
    });
};

/** Peticiones de registro sin JWT (evita 403 si hay sesión admin/cliente abierta). */
const fetchRegistroPublico = async (url, options = {}) => {
    const headers = { ...(options.headers || {}) };
    delete headers.Authorization;
    delete headers.authorization;

    return fetch(url, {
        ...options,
        headers,
        credentials: 'omit',
    });
};

export const vincularFotoRegistro = async (correo, fotoUrl) => {
    const response = await fetchRegistroPublico(`${API_URL_USUARIOS}/registro/vincular-foto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: normalizarCorreo(correo), fotoUrl }),
    });

    if (!response.ok) {
        throw new Error(await parseApiError(response, 'No se pudo guardar la foto en el perfil'));
    }
};

/** Registro multipart: crea usuario y sube la foto en el servidor (recomendado). */
export const registrarUsuarioConFoto = async (userData, file) => {
    try {
        const datos = prepararDatosRegistro(userData);
        const formData = new FormData();
        appendRegistroFields(formData, datos);
        formData.append('file', file);

        const response = await fetchRegistroPublico(`${API_URL_USUARIOS}/registro-con-foto`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(
                await parseApiError(response, `Error al registrar en el servidor (${response.status})`)
            );
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
            body: JSON.stringify({
                ...credentials,
                correo: normalizarCorreo(credentials.correo),
            }),
        });

        if (!response.ok) {
            throw new Error(await parseApiError(response, 'Credenciales incorrectas'));
        }

        return await response.json();
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};

// Verificar correo tras registro (código SMTP de 6 dígitos)
export const verificarCorreo = async ({ correo, codigo }) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/verificar-correo`, {
            method: 'POST',
            headers: getAuthHeaders(false),
            body: JSON.stringify({ correo: normalizarCorreo(correo), codigo }),
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

export const reenviarCodigoVerificacion = async ({ correo }) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/reenviar-codigo-verificacion`, {
            method: 'POST',
            headers: getAuthHeaders(false),
            body: JSON.stringify({ correo: normalizarCorreo(correo) }),
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

// Recuperación de contraseña
export const recoverPassword = async (emailData) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/recuperar-password`, {
            method: 'POST',
            headers: getAuthHeaders(false),
            body: JSON.stringify({
                ...emailData,
                correo: normalizarCorreo(emailData.correo),
            }),
        });

        if (!response.ok) {
            throw new Error(await parseApiError(response, 'Error al solicitar recuperación'));
        }

        return await response.text();
    } catch (error) {
        console.error("Error en recoverPassword:", error);
        throw error;
    }
};

export const cambiarPasswordRecuperacion = async ({ correo, codigo, nuevaContrasena }) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/cambiar-password`, {
            method: 'POST',
            headers: getAuthHeaders(false),
            body: JSON.stringify({
                correo: normalizarCorreo(correo),
                codigo,
                nuevaContrasena,
            }),
        });

        if (!response.ok) {
            throw new Error(await parseApiError(response, 'No se pudo actualizar la contraseña'));
        }

        return await response.text();
    } catch (error) {
        console.error('Error en cambiarPasswordRecuperacion:', error);
        throw error;
    }
};

// Registrar usuario (Recibe el objeto con la URL de la foto ya lista)
export const registrarUsuario = async (dataUsuario) => {
    try {
        const datos = prepararDatosRegistro(dataUsuario);
        const { fotoUrl, ...resto } = datos;
        const response = await fetchRegistroPublico(`${API_URL_USUARIOS}/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...resto, fotoUrl }),
        });

        if (!response.ok) {
            throw new Error(
                await parseApiError(response, `Error al registrar en el servidor (${response.status})`)
            );
        }

        const usuario = await response.json();

        if (fotoUrl) {
            await vincularFotoRegistro(datos.correo, fotoUrl);
        }

        return usuario;
    } catch (error) {
        console.error("Error en registrarUsuario:", error);
        throw error;
    }
};