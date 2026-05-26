import {
  API_URL_SOLICITUDES,
  getAuthHeaders,
  isNetworkError,
  networkErrorMessage,
  parseApiError,
} from './apiConfig';

export const esSolicitudPendiente = (item) => {
  const estado = (item?.estado || '').toLowerCase();
  const direccion = (item?.direccionAtencion || '').toLowerCase();
  return estado.includes('pendiente') || direccion.includes('por confirmar');
};

export const separarTrabajosPrestador = (items) => {
  const lista = Array.isArray(items) ? items : [];
  const pendientes = [];
  const confirmados = [];
  lista.forEach((t) => {
    if (esSolicitudPendiente(t)) {
      pendientes.push(t);
    } else {
      confirmados.push(t);
    }
  });
  return { pendientes, confirmados };
};

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

export const getNuevasSolicitudesPrestador = async () => {
  return fetchAutenticado(`${API_URL_SOLICITUDES}/prestador/nuevas`, { method: 'GET' });
};

export const getMisTrabajosPrestador = async () => {
  return fetchAutenticado(`${API_URL_SOLICITUDES}/prestador/mis-trabajos`, { method: 'GET' });
};

export const aceptarSolicitudPrestador = async (idSolicitud, direccionAtencion) => {
  const body = {};
  if (direccionAtencion != null && String(direccionAtencion).trim() !== '') {
    body.direccionAtencion = String(direccionAtencion).trim();
  }
  return fetchAutenticado(`${API_URL_SOLICITUDES}/prestador/${idSolicitud}/aceptar`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const rechazarSolicitudPrestador = async (idSolicitud) => {
  return fetchAutenticado(`${API_URL_SOLICITUDES}/prestador/${idSolicitud}/rechazar`, {
    method: 'PUT',
    body: JSON.stringify({}),
  });
};
