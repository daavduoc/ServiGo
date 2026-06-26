import React from 'react';

const ReportesAcciones = ({ onExport, periodo }) => {
  return (
    <div className="reportes-actions">
      <div className="periodo-info">
        <i className="bi bi-calendar3 me-2" aria-hidden="true" />
        <strong>Período:</strong> {periodo.inicio} <i className="bi bi-arrow-right mx-1" /> {periodo.fin}
      </div>
      <button
        type="button"
        className="btn btn-success rounded-pill px-4 fw-semibold"
        onClick={onExport}
      >
        <i className="bi bi-download me-2" aria-hidden="true" />
        Descargar CSV
      </button>
    </div>
  );
};

export default ReportesAcciones;
