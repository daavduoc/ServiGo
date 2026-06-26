import React from 'react';
import ReporteDatePicker from '../../ui/ReporteDatePicker';

const ReportesFiltros = ({ onApply, loading, error }) => {
  return (
    <div className="reportes-section">
      <h2 className="reportes-section-title">
        <i className="bi bi-calendar-range me-2" aria-hidden="true" />
        Seleccionar Período
      </h2>
      <ReporteDatePicker onApply={onApply} />
      {error && (
        <div className="alert alert-danger mt-3 mb-0">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {error}
        </div>
      )}
      {loading && (
        <div className="reportes-loading mt-3">
          <div className="spinner-border spinner-border-sm text-success me-2" role="status" />
          <span>Generando reporte, por favor espere...</span>
        </div>
      )}
    </div>
  );
};

export default ReportesFiltros;
