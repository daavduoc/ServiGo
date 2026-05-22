const API_BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

// ========================
// HELPER - Función para requests
// ========================
const fetchRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: getAuthHeader(),
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en request:', error);
    throw error;
  }
};

// ========================
// DASHBOARD
// ========================
export const obtenerEstadisticas = async () => {
  return fetchRequest(`${API_BASE_URL}/admin/dashboard`, {
    method: 'GET'
  });
};

// ========================
// USUARIOS (CONTROL ADMIN)
// ========================
export const bloquearUsuario = async (id, motivo) => {
  return fetchRequest(`${API_BASE_URL}/admin/control-usuarios/${id}/bloquear`, {
    method: 'PUT',
    body: JSON.stringify({ motivo })
  });
};

export const desbloquearUsuario = async (id) => {
  return fetchRequest(`${API_BASE_URL}/admin/control-usuarios/${id}/desbloquear`, {
    method: 'PUT',
    body: JSON.stringify({})
  });
};

export const desactivarUsuario = async (id, motivo) => {
  return fetchRequest(`${API_BASE_URL}/admin/control-usuarios/${id}/desactivar`, {
    method: 'PUT',
    body: JSON.stringify({ motivo })
  });
};

// ========================
// PRESTADORES (VALIDACIÓN ADMIN)
// ========================
export const listarPrestadoresValidacion = async () => {
  return fetchRequest(`${API_BASE_URL}/admin/validacion/prestadores`, {
    method: 'GET'
  });
};

export const obtenerCertificacionesPrestador = async (id) => {
  return fetchRequest(`${API_BASE_URL}/admin/validacion/prestadores/${id}/certificaciones`, {
    method: 'GET'
  });
};

export const aprobarPrestador = async (id) => {
  return fetchRequest(`${API_BASE_URL}/admin/validacion/prestadores/${id}/aprobar`, {
    method: 'PUT',
    body: JSON.stringify({})
  });
};

export const rechazarPrestador = async (id, motivo) => {
  return fetchRequest(`${API_BASE_URL}/admin/validacion/prestadores/${id}/rechazar`, {
    method: 'PUT',
    body: JSON.stringify({ motivo })
  });
};

// ========================
// REPORTES
// ========================
export const generarReportePeriodo = async (fechaInicio, fechaFin) => {
  const params = new URLSearchParams({ fechaInicio, fechaFin });
  return fetchRequest(`${API_BASE_URL}/admin/reportes/periodo?${params}`, {
    method: 'GET'
  });
};

// ========================
// AUDITORÍA
// ========================
export const obtenerAuditoria = async (page = 0, size = 10, accion = '', tabla = '') => {
  let url = `${API_BASE_URL}/admin/auditoria?page=${page}&size=${size}`;
  if (accion) url += `&accion=${accion}`;
  if (tabla) url += `&tabla=${tabla}`;

  return fetchRequest(url, {
    method: 'GET'
  });
};