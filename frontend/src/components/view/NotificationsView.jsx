import React from 'react';

export const NotificationsView = () => {
  return (
    <div className="container py-5 mt-4" style={{ minHeight: '60vh' }}>
      <h2 className="fw-bold text-dark mb-4">
        <i className="bi bi-bell text-success me-2"></i>
        Historial de Notificaciones
      </h2>
      
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
        <div className="text-muted mb-3">
          <i className="bi bi-inbox fs-1"></i>
        </div>
        <h5 className="fw-medium">Tu bandeja está lista</h5>
        <p className="text-muted small">Aquí construiremos la lista completa con todo el historial de tus alertas y mensajes de ServiGo.</p>
      </div>
    </div>
  );
};