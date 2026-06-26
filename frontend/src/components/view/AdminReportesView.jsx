import React, { useState } from 'react';
import ReportesFiltros from '../sections/admin-reportes/ReportesFiltros';
import ReportesStatsGrid from '../sections/admin-reportes/ReportesStatsGrid';
import ReportesAcciones from '../sections/admin-reportes/ReportesAcciones';
import { generarReportePeriodo } from '../../serviceFront/adminService';
import { generarReporteCSV } from '../../utils/ExportCSV';

const AdminReportesView = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState(null);

  const handleGenerarReporte = async (fechaInicio, fechaFin) => {
    try {
      setLoading(true);
      setError(null);
      const inicio = `${fechaInicio}T00:00:00`;
      const fin = `${fechaFin}T23:59:59`;
      const data = await generarReportePeriodo(inicio, fin);
      setReporte(data);
      setPeriodo({ inicio: fechaInicio, fin: fechaFin });
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportarCSV = () => {
    if (!reporte || !periodo) return;
    generarReporteCSV(reporte, periodo);
  };

  return (
    <div className="admin-reportes">
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-bar-chart-line" aria-hidden="true" />
        Generador de Reportes
      </h2>
      <ReportesFiltros onApply={handleGenerarReporte} loading={loading} error={error} />
      {reporte && (
        <>
          <ReportesStatsGrid reporte={reporte} />
          <ReportesAcciones onExport={handleExportarCSV} periodo={periodo} />
        </>
      )}
    </div>
  );
};

export default AdminReportesView;
