export const exportTableToCSV = (data, filename = 'reporte.csv') => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const columns = Object.keys(data[0]);
  const header = columns.join(',');
  const rows = data.map(obj =>
    columns.map(col => {
      const value = obj[col];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  const csv = ['\ufeff' + header, ...rows].join('\n');
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

export const generarReporteCSV = (reporte, periodo) => {
  const data = [
    {
      'Período': `${periodo.inicio} - ${periodo.fin}`,
      'Fecha Inicio': reporte.fechaInicio || periodo.inicio,
      'Fecha Fin': reporte.fechaFin || periodo.fin,
      'Total Contrataciones': reporte.totalSolicitudes || 0,
      'Contrataciones Aprobadas': reporte.solicitudesAprobadas || 0,
      'Contrataciones Rechazadas': reporte.solicitudesRechazadas || 0,
      'Contrataciones Canceladas': reporte.solicitudesCanceladas || 0,
      'Total Reservas': reporte.totalReservas || 0,
      'Reservas Finalizadas': reporte.reservasFinalizadas || 0,
      'Reservas Canceladas': reporte.reservasCanceladas || 0,
      'Nuevos Usuarios': reporte.nuevosUsuarios || 0,
      'Nuevos Prestadores': reporte.nuevosPrestadores || 0,
      'Nuevos Clientes': reporte.nuevosClientes || 0,
      'Ingreso Estimado': reporte.ingresoEstimado || 0,
      'Calificación Promedio': (reporte['promedioCalificacionesReseñas'] || 0).toFixed(2),
      'Total Reseñas': reporte['totalReseñas'] || 0,
      'Especialidad Más Usada': reporte.especialidadMasUtilizada || '',
      'Prestadores Validados': reporte.prestadoresValidados || 0,
      'Prestadores Pendientes': reporte.prestadoresPendientes || 0,
      'Prestadores Rechazados': reporte.prestadoresRechazados || 0
    }
  ];

  exportTableToCSV(data, `reporte_${periodo.inicio}_${periodo.fin}`);
};
