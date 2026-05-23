import { API_BASE_URL } from './apiConfig';

const API_URL_PRESTADORES = `${API_BASE_URL}/prestadores`;

const parseApiError = async (response, fallback) => {
  if (response.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
  }

  const body = await response.json().catch(() => ({}));
  const message = body.message || body.error;

  if (message) {
    if (response.status === 404 || String(message).includes('NOT_FOUND')) {
      return 'Este especialista no está disponible o no fue encontrado.';
    }
    return message;
  }

  return fallback;
};

export const buscarPrestadoresPublicos = async ({ categoria, query } = {}) => {
  const params = new URLSearchParams();
  if (categoria && categoria !== 'Todos') {
    params.set('categoria', categoria);
  }
  if (query?.trim()) {
    params.set('query', query.trim());
  }

  const qs = params.toString();
  const url = `${API_URL_PRESTADORES}/publicos${qs ? `?${qs}` : ''}`;

  let response;
  try {
    response = await fetch(url, { method: 'GET' });
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080'
      );
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al buscar prestadores'));
  }

  return response.json();
};

export const obtenerPrestadorPublico = async (idPrestador) => {
  if (!idPrestador || idPrestador === 'undefined' || idPrestador === 'null') {
    throw new Error('Identificador de especialista no válido.');
  }

  const url = `${API_URL_PRESTADORES}/publicos/${idPrestador}`;

  let response;
  try {
    response = await fetch(url, { method: 'GET' });
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080'
      );
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al cargar el perfil del especialista'));
  }

  return response.json();
};
