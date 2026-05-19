
const API_URL = 'http://localhost:8080/api';
const API_URL_USUARIOS = 'http://localhost:8080/usuarios';
const API_URL_FOTOS = 'http://localhost:8080/fotos-perfil';

export const registerUserInDB = async (userData) => {
    try {
        // direccionamiento decimos a dónde ir.
        const response = await fetch(`${API_URL}/registro`, {
            // POST de los datos nuevos.
            method: 'POST',

            // identifica como se formatean los datos que enviamos, en este caso JSON.
            headers: {
                'Content-Type': 'application/json'
            },

            //el objeto se convierte de JavaScript (userData) a un texto plano (JSON) para que el backend pueda entenderlo.
            body: JSON.stringify(userData)
        });

        // mensaje de error si NO SE ENVIARON los datos correctamente al backend
        if (!response.ok) {
            throw new Error('Error al registrar en el servidor');
        }

        // mensaje generico solicitud de respuesta, el backend responde con un mensaje de éxito o error que se muestra en la consola del navegador.
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        return data;

    } catch (error) {
        console.error("Falló la conexión con el Backend:", error);
        throw error; // mensage de error si no se CONECTA cpon backend
    }
};

// GET: obtener perfil completo del usuario autenticado
export const getMyProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL_USUARIOS}/me/perfil`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener perfil');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        throw error;
    }
};

// POST: subir o actualizar foto de perfil (Cloudinary + BD)
export const uploadProfilePhoto = async (userId, file) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL_FOTOS}/upload/${userId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al subir la foto de perfil');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir foto de perfil:', error);
        throw error;
    }
};

// PUT: actualizar datos del usuario autenticado
export const updateUserProfile = async (userId, userData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL_USUARIOS}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar perfil');
        }

        const data = await response.json();
        console.log("Perfil actualizado:", data);
        return data;
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        throw error;
    }
};