//metricas rápidas del las tarjetas de Ganancias y Trabajos Pendientes que ve el prestador en su vista inicial
import React from 'react';

// Inicio seccion de métricas rápidas del panel
export const MetricasPanel = ({ ganancias, trabajosPendientes }) => (
  <div className="row mb-4 g-3">
    <div className="col-md-6">
      <div className="card shadow-sm border-0 bg-success text-white p-3">
        <h5 className="card-title">
          <i className="bi bi-wallet2 me-2" aria-hidden="true" />
          Ganancias del Mes
        </h5>
        <h2 className="fw-bold">${ganancias.toLocaleString('es-CL')}</h2>
      </div>
    </div>
    <div className="col-md-6">
      <div className="card shadow-sm border-0 bg-success text-white p-3">
        <h5 className="card-title">
          <i className="bi bi-tools me-2" aria-hidden="true" />
          Trabajos Pendientes
        </h5>
        <h2 className="fw-bold">{trabajosPendientes}</h2>
      </div>
    </div>
  </div>
);
// Fin seccion de métricas rápidas del panel