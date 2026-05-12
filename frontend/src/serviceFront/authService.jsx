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


export const subirFotoCloudinary = async (file) => {
    try {
        const formData = new FormData();
        //
        formData.append('file', file);

        const response = await fetch(`${API_URL_CLOUDINARY}/upload`, {
            method: 'POST',
            // Usamos getAuthHeaders(true) porque enviamos FormData
            headers: getAuthHeaders(true),
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error al subir la imagen a la nube");
        }

        const data = await response.json();
        // Tu controlador devuelve un Map, accedemos a la URL de Cloudinary
        return data.url;
    } catch (error) {
        console.error("Error en subirFotoCloudinary:", error);
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
        const response = await fetch(`${API_URL_USUARIOS}/registro`, {
            method: 'POST',
            headers: getAuthHeaders(false), // Ya enviamos JSON con la URL de la foto
            body: JSON.stringify(dataUsuario)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al registrar en el servidor");
        }

        return true;
    } catch (error) {
        console.error("Error en registrarUsuario:", error);
        throw error;
    }
};