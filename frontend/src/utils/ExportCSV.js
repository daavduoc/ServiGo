export const exportTableToCSV = (data, filename = 'reporte.csv') => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Obtener las columnas del primer objeto
  const columns = Object.keys(data[0]);

  // Crear header
  const header = columns.join(',');

  // Crear filas
  const rows = data.map(obj =>
    columns.map(col => {
      const value = obj[col];
      // Escapar comillas y envolver en comillas si contiene comas
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  // Combinar
  const csv = [header, ...rows].join('\n');

  // Descargar
  downloadFile(csv, `${filename}.csv`, 'text/csv');
};

export const downloadFile = (content, filename, mimeType) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const generarReporteCSV = (stats, periodo) => {
  const data = [
    {
      'Período': `${periodo.inicio} - ${periodo.fin}`,
      'Usuarios Nuevos': stats.totalUsuariosNuevos || 0,
      'Prestadores Nuevos': stats.totalPrestadoresNuevos || 0,
      'Solicitudes Total': stats.totalSolicitudes || 0,
      'Solicitudes Completadas': stats.solicitudesCompletadas || 0,
      'Ingresos': stats.ingresosTotales || 0,
      'Comisión': stats.comisionTotales || 0,
      'Calificación Promedio': (stats.calificacionPromedio || 0).toFixed(2)
    }
  ];

  exportTableToCSV(data, `reporte_${periodo.inicio}_${periodo.fin}`);
};
