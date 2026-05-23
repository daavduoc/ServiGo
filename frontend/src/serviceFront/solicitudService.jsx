const API_URL_SOLICITUDES = 'http://localhost:8080/solicitudes';

export const getMisTrabajosPrestador = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Sesión no válida. Inicia sesión nuevamente.');
  }

  let response;
  try {
    response = await fetch(`${API_URL_SOLICITUDES}/prestador/mis-trabajos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:8080'
      );
    }
    throw error;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.error || 'Error al obtener trabajos');
  }

  return response.json();
};
