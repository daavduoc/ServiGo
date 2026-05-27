import { API_BASE_URL, getAuthHeaders, parseApiError } from './apiConfig';

const API_URL_SERVICIOS = `${API_BASE_URL}/servicios`;
const API_URL_FOTOS = `${API_BASE_URL}/fotos-perfil`;

export const crearNuevoServicio = async (servicioData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const response = await fetch(API_URL_SERVICIOS, {
    method: 'POST',
    headers: getAuthHeaders(false),
    body: JSON.stringify(servicioData),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, 'Error al guardar el servicio en el servidor'));
  }

  return response.json();
};

export const subirFotoVerificacionServicio = async (userId, fileBase64) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const partes = fileBase64.split(',');
  const byteString = atob(partes[1]);
  const mimeString = partes[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  const file = new File([blob], 'foto_verificacion.jpg', { type: mimeString });

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL_FOTOS}/upload/${userId}`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: formData,
  });

  if (!response.ok) {
    throw new Error('No se pudo subir la foto de verificación al servidor');
  }

  return response.json();
};

// Función para obtener todos los servicios (sin autenticación de momento)

export const getTodosLosServicios = async () => {
  const response = await fetch(API_URL_SERVICIOS, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los servicios desde el servidor');
  }

  return response.json();
};

export const actualizarServicioCompleto = async (idServicio, servicioData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const response = await fetch(`${API_URL_SERVICIOS}/${idServicio}`, {
    method: 'PUT',
    headers: getAuthHeaders(false),
    body: JSON.stringify(servicioData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el servicio en el servidor');
  }

  return response.json();
};

export const eliminarServicio = async (idServicio) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

  const response = await fetch(`${API_URL_SERVICIOS}/${idServicio}`, {
    method: 'DELETE',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el servicio');
  }

  return true;
};