
const API_URL_USUARIOS = 'http://localhost:8080/usuarios';
const API_URL_FOTOS = 'http://localhost:8080/fotos-perfil';

const isNetworkError = (error) =>
  error instanceof TypeError && error.message === 'Failed to fetch';

// GET: obtener perfil completo del usuario autenticado
export const getMyProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión no válida. Inicia sesión nuevamente.');
  }

  let response;
  try {
    response = await fetch(`${API_URL_USUARIOS}/me/perfil`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(
        'No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:8080'
      );
    }
    throw error;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.error || 'Error al obtener perfil');
  }

  return response.json();
};

// POST: subir o actualizar foto de perfil (multipart → backend → Cloudinary + BD)
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