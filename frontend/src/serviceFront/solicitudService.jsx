import {
  API_URL_SOLICITUDES,
  getAuthHeaders,
  isNetworkError,
  networkErrorMessage,
  parseApiError,
} from './apiConfig';

export const getMisTrabajosPrestador = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión no válida. Inicia sesión nuevamente.');
  }

  let response;
  try {
    response = await fetch(`${API_URL_SOLICITUDES}/prestador/mis-trabajos`, {
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
    throw new Error(await parseApiError(response, 'Error al cargar trabajos'));
  }

  return response.json();
};
