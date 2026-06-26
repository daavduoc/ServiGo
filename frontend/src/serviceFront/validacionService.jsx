import { API_BASE_URL, getAuthHeaders, parseApiError } from './apiConfig';

const API_URL_BIOMETRICA = `${API_BASE_URL}/fotos-biometricas-registro`;
const API_URL_VALIDACIONES = `${API_BASE_URL}/validaciones-biometricas`;
const API_URL_RESERVAS = `${API_BASE_URL}/reservas`;
const API_URL_SOLICITUDES = `${API_BASE_URL}/solicitudes`;

// Verificar si el usuario tiene foto biométrica registrada
export const verificarFotoBiometrica = async (idUsuario) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const response = await fetch(`${API_URL_BIOMETRICA}/existe/${idUsuario}`, {
    method: 'GET',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al verificar la foto biométrica del usuario.'));
  }

  return response.json();
};

export const obtenerFotoBiometricaRegistro = async (idUsuario) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const response = await fetch(`${API_URL_BIOMETRICA}/acceso/${idUsuario}`, {
    method: 'GET',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'No se pudo obtener la foto biométrica de registro.'));
  }

  return response.json();
};

// Enviar foto capturada para comparación facial
export const compararRostro = async (idUsuario, fotoBlob, tipoValidacion, idSolicitud) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const formData = new FormData();
  if (idSolicitud === undefined || idSolicitud === null) {
    throw new Error('Falta idSolicitud para validar biometría');
  }

  formData.append('idUsuario', idUsuario);
  formData.append('tipoValidacion', tipoValidacion);
  formData.append('idSolicitud', idSolicitud);
  formData.append('fotoCapturada', fotoBlob, 'foto_capturada.jpg');

  const response = await fetch(`${API_URL_VALIDACIONES}/comparar`, {
    method: 'POST',
    headers: getAuthHeaders(true), // Content-Type se maneja automáticamente al enviar FormData
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'La comparación facial no se pudo realizar o ha fallado.'));
  }

  return response.json();
};

// Obtener el detalle de una reserva específica
export const getReservaDetalle = async (idReserva) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const response = await fetch(`${API_URL_RESERVAS}/${idReserva}`, {
    method: 'GET',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al obtener los detalles de la reserva.'));
  }

  return response.json();
};

// Obtener el detalle de una solicitud específica
export const getSolicitudDetalle = async (idSolicitud) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const response = await fetch(`${API_URL_SOLICITUDES}/${idSolicitud}`, {
    method: 'GET',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al obtener los detalles de la solicitud.'));
  }

  return response.json();
};