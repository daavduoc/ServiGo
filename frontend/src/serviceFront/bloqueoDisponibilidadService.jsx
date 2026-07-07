import { API_BASE_URL, getAuthHeaders, parseApiError } from './apiConfig';

const API_URL_BLOQUEOS = `${API_BASE_URL}/bloqueos-disponibilidad`;

const requireToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesion vencida. Inicia sesion nuevamente.');
  }
};

export const listarBloqueosPorServicio = async (idServicio) => {
  requireToken();

  const response = await fetch(`${API_URL_BLOQUEOS}/servicio/${idServicio}`, {
    method: 'GET',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al cargar los bloqueos de disponibilidad'));
  }

  return response.json();
};

export const crearBloqueoDisponibilidad = async (idServicio, bloqueoData) => {
  requireToken();

  const response = await fetch(`${API_URL_BLOQUEOS}/servicio/${idServicio}`, {
    method: 'POST',
    headers: getAuthHeaders(false),
    body: JSON.stringify(bloqueoData),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al crear el bloqueo de disponibilidad'));
  }

  return response.json();
};

export const actualizarBloqueoDisponibilidad = async (idBloqueo, bloqueoData) => {
  requireToken();

  const response = await fetch(`${API_URL_BLOQUEOS}/${idBloqueo}`, {
    method: 'PUT',
    headers: getAuthHeaders(false),
    body: JSON.stringify(bloqueoData),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al actualizar el bloqueo de disponibilidad'));
  }

  return response.json();
};

export const eliminarBloqueoDisponibilidad = async (idBloqueo) => {
  requireToken();

  const response = await fetch(`${API_URL_BLOQUEOS}/${idBloqueo}`, {
    method: 'DELETE',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al eliminar el bloqueo de disponibilidad'));
  }

  return true;
};
