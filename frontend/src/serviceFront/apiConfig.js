export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_URL_AUTH = `${API_BASE_URL}/auth`;
export const API_URL_USUARIOS = `${API_BASE_URL}/usuarios`;
export const API_URL_CLOUDINARY = `${API_BASE_URL}/cloudinary`;
export const API_URL_SOLICITUDES = `${API_BASE_URL}/solicitudes`;
export const API_URL_RESERVAS = `${API_BASE_URL}/reservas`;

export const isNetworkError = (error) =>
  error instanceof TypeError && error.message === 'Failed to fetch';

export const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const parseApiError = async (response, fallback) => {
  const body = await response.json().catch(() => ({}));
  return body.message || body.error || fallback;
};

export const networkErrorMessage = () =>
  `No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en ${API_BASE_URL}`;
