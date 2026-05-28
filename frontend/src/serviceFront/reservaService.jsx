import {
  API_URL_RESERVAS,
  getAuthHeaders,
  isNetworkError,
  networkErrorMessage,
  parseApiError,
} from './apiConfig';

const fetchAutenticado = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión no válida. Inicia sesión nuevamente.');
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(false),
        ...options.headers,
      },
    });
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(networkErrorMessage());
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al procesar la solicitud'));
  }

  return response.json();
};

/** @returns {{ proximas: Array, historial: Array }} */
export const getMisReservasCliente = async () => {
  return fetchAutenticado(`${API_URL_RESERVAS}/cliente/mis-reservas`, { method: 'GET' });
};

export const cancelarReservaCliente = async (idReserva) => {
  return fetchAutenticado(`${API_URL_RESERVAS}/cliente/${idReserva}/cancelar`, {
    method: 'PUT',
    body: JSON.stringify({}),
  });
};

export const eliminarReservaCliente = async (idReserva) => {
  return fetchAutenticado(`${API_URL_RESERVAS}/cliente/${idReserva}/eliminar`, {
    method: 'DELETE',
  });
};

export const crearReservaCliente = async ({ idPrestador, idServicio, fecha, hora }) => {
  const payload = { idPrestador, fecha, hora };
  if (idServicio != null) {
    payload.idServicio = idServicio;
  }
  return fetchAutenticado(`${API_URL_RESERVAS}/cliente/agendar`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
