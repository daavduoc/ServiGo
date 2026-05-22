import React, { useState } from 'react';
import ReporteDatePicker from '../ui/ReporteDatePicker';
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

      const inicio = new Date(fechaInicio).toISOString();
      const fin = new Date(fechaFin).toISOString();

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
    if (!reporte) return;
    generarReporteCSV(reporte, periodo);
  };

  return (
    <div className="admin-reportes">
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-bar-chart-line" aria-hidden="true" />
        Generador de Reportes
      </h2>

      <div className="reportes-section">
        <h2>Seleccionar Período</h2>
        <ReporteDatePicker onApply={handleGenerarReporte} />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && <p>Generando reporte...</p>}

      {reporte && (
        <div className="reportes-results">
          <h2>Resultados del Período: {periodo.inicio} - {periodo.fin}</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Usuarios Nuevos</h3>
              <p className="stat-value">{reporte.totalUsuariosNuevos || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Prestadores Nuevos</h3>
              <p className="stat-value">{reporte.totalPrestadoresNuevos || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Total Solicitudes</h3>
              <p className="stat-value">{reporte.totalSolicitudes || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Solicitudes Completadas</h3>
              <p className="stat-value">{reporte.solicitudesCompletadas || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Ingresos Totales</h3>
              <p className="stat-value">💰 ${reporte.ingresosTotales || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Comisión</h3>
              <p className="stat-value">💰 ${reporte.comisionTotales || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Calificación Promedio</h3>
              <p className="stat-value">⭐ {(reporte.calificacionPromedio || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="reportes-actions">
            <button type="button" className="btn btn-success rounded-pill px-4 fw-semibold" onClick={handleExportarCSV}>
              <i className="bi bi-download me-2" aria-hidden="true" />
              Descargar CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportesView;
