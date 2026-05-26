import { API_BASE_URL, getAuthHeaders, parseApiError } from './apiConfig';

const getAuthHeader = () => getAuthHeaders(false);

export const enviarMensajeSoporte = async ({ tipoProblema, asunto, descripcion }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/soporte/mensajes`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ tipoProblema, asunto, descripcion }),
    });

    if (!response.ok) {
      const message = await parseApiError(response, 'Error al enviar el reporte');
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en enviarMensajeSoporte:', error);
    throw error;
  }
};

export const obtenerMisMensajes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/soporte/mis-mensajes`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const message = await parseApiError(response, 'Error al obtener mensajes');
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerMisMensajes:', error);
    throw error;
  }
};
