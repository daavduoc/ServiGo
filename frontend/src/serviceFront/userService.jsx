import {
  API_BASE_URL,
  API_URL_USUARIOS,
  getAuthHeaders,
  isNetworkError,
  networkErrorMessage,
  parseApiError,
} from './apiConfig';

const API_URL_FOTOS = `${API_BASE_URL}/fotos-perfil`;

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
      headers: getAuthHeaders(false),
    });
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(networkErrorMessage());
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al obtener perfil'));
  }

  return response.json();
};

// POST: subir o actualizar foto de perfil (multipart → backend → Cloudinary + BD)
export const uploadProfilePhoto = async (userId, file) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión no válida. Inicia sesión nuevamente.');
  }

  const formData = new FormData();
  formData.append('file', file);

  let response;
  try {
    response = await fetch(`${API_URL_FOTOS}/upload/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData,
    });
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(networkErrorMessage());
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al subir la foto de perfil'));
  }

  return response.json();
};

// PUT: actualizar datos del usuario autenticado
export const updateUserProfile = async (userId, userData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión no válida. Inicia sesión nuevamente.');
  }

  let response;
  try {
    response = await fetch(`${API_URL_USUARIOS}/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(false),
      body: JSON.stringify(userData),
    });
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(networkErrorMessage());
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al actualizar perfil'));
  }

  return response.json();
};
