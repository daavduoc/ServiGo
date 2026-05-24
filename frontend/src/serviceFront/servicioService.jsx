// Servicio modular para la gestión de servicios del prestador de servicio y fotos de verificación
import { API_BASE_URL } from './apiConfig';

const API_URL_SERVICIOS = `${API_BASE_URL}/servicios`;
const API_URL_FOTOS = `${API_BASE_URL}/fotos-perfil`;

// Guarda el nuevo servicio con sus detalles en la base de datos
export const crearNuevoServicio = async (servicioData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }
  // el mdoulo incluye titulo, descripcion, categoria, precio, ubicacion, disponibilidad, y urlFotoVerificacion
  const response = await fetch(API_URL_SERVICIOS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(servicioData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Error al guardar el servicio en el servidor');
  }

  return response.json();
};

//Sube la foto de verificación al Backend para su almacenamiento en Cloudinary
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
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('No se pudo subir la foto de verificación al servidor');
  }

  return response.json();
};