//  rutas de conección al backend
// Base para login y recuperación
const API_URL_AUTH = process.env.REACT_APP_API_URL || 'http://localhost:8080/auth';
// Base para el registro de usuarios
const API_URL_USUARIOS = 'http://localhost:8080/usuarios';

// iniciar sesion
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        // Si la contraseña está mal, Java enviará un mensaje de error 
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Credenciales incorrectas o error en el servidor');
        }

        // Si está bien, devolvemos los datos del usuario
        return await response.json();
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};

// recuperacion de contraseña
export const recoverPassword = async (emailData) => {
    try {
        const response = await fetch(`${API_URL_AUTH}/recuperar-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            throw new Error('Error al solicitar recuperación de contraseña');
        }

        return await response.text();
    } catch (error) {
        console.error("Error en recoverPassword:", error);
        throw error;
    }
};

// registrar nuevo usuario
export const registrarUsuario = async (dataUsuario) => {
    try {
        // Ojo aquí: se esta usando API_URL_USUARIOS en lugar de AUTH (en caso de error de conexion de usuario ver esto)
        const response = await fetch(`${API_URL_USUARIOS}/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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