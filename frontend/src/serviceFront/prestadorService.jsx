import {
  API_BASE_URL,
  isNetworkError,
  networkErrorMessage,
  parseApiError as parseApiErrorBase,
} from './apiConfig';

const API_URL_PRESTADORES = `${API_BASE_URL}/prestadores`;

const parsePrestadorError = async (response, fallback) => {
  const message = await parseApiErrorBase(response, fallback);
  if (response.status === 404 || String(message).includes('NOT_FOUND')) {
    return 'Este especialista no está disponible o no fue encontrado.';
  }
  return message;
};

const fetchPublico = async (url, fallbackError) => {
  let response;
  try {
    response = await fetch(url, { method: 'GET' });
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(networkErrorMessage());
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(await parsePrestadorError(response, fallbackError));
  }

  return response.json();
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
  return fetchPublico(url, 'Error al buscar prestadores');
};

export const obtenerPrestadorPublico = async (idPrestador) => {
  if (!idPrestador || idPrestador === 'undefined' || idPrestador === 'null') {
    throw new Error('Identificador de especialista no válido.');
  }

  const url = `${API_URL_PRESTADORES}/publicos/${idPrestador}`;
  return fetchPublico(url, 'Error al cargar el perfil del especialista');
};
