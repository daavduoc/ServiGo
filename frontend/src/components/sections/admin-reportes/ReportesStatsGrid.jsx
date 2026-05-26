import React from 'react';

const StatCard = ({ label, value, icon, prefix = '', suffix = '', isNull = false }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <i className={`bi ${icon}`} aria-hidden="true" />
      <span className="stat-label">{label}</span>
    </div>
    <p className="stat-value">
      {isNull ? (
        <span className="nd-badge" title="No disponible: el backend no proporciona este dato aún">
          N/D
        </span>
      ) : (
        <>
          {prefix}
          {value}
          {suffix}
        </>
      )}
    </p>
  </div>
);

const ReportesStatsGrid = ({ reporte }) => {
  return (
    <div className="reportes-results">
      <h2 className="reportes-section-title">
        <i className="bi bi-clipboard-data me-2" aria-hidden="true" />
        Resultados del Período
      </h2>

      {/* Contrataciones de Servicio */}
      <div className="reportes-category">
        <h3 className="category-title">
          <i className="bi bi-cart-check me-2" />
          Contrataciones de Servicio
        </h3>
        <div className="stats-grid">
          <StatCard label="Total Contrataciones" value={reporte.totalSolicitudes || 0} icon="bi-cart-fill" />
          <StatCard label="Aprobadas" value={reporte.solicitudesAprobadas || 0} icon="bi-check-circle-fill" />
          <StatCard label="Rechazadas" value={reporte.solicitudesRechazadas || 0} icon="bi-x-circle-fill" />
          <StatCard label="Canceladas" value={reporte.solicitudesCanceladas || 0} icon="bi-dash-circle-fill" />
        </div>
      </div>

      {/* Validación de Prestadores */}
      <div className="reportes-category">
        <h3 className="category-title">
          <i className="bi bi-person-check me-2" />
          Validación de Prestadores
        </h3>
        <div className="stats-grid">
          <StatCard
            label="Prestadores Validados"
            value={reporte.prestadoresValidados || 0}
            icon="bi-patch-check-fill"
            isNull={reporte.prestadoresValidados == null}
          />
          <StatCard
            label="Prestadores Pendientes"
            value={reporte.prestadoresPendientes || 0}
            icon="bi-hourglass-split"
            isNull={reporte.prestadoresPendientes == null}
          />
          <StatCard
            label="Prestadores Rechazados"
            value={reporte.prestadoresRechazados || 0}
            icon="bi-person-x-fill"
            isNull={reporte.prestadoresRechazados == null}
          />
        </div>
      </div>

      {/* Reservas */}
      <div className="reportes-category">
        <h3 className="category-title">
          <i className="bi bi-calendar-check me-2" />
          Reservas
        </h3>
        <div className="stats-grid">
          <StatCard label="Total Reservas" value={reporte.totalReservas || 0} icon="bi-calendar-event-fill" />
          <StatCard label="Finalizadas" value={reporte.reservasFinalizadas || 0} icon="bi-check-lg" />
          <StatCard label="Canceladas" value={reporte.reservasCanceladas || 0} icon="bi-calendar-x-fill" />
        </div>
      </div>

      {/* Usuarios */}
      <div className="reportes-category">
        <h3 className="category-title">
          <i className="bi bi-people me-2" />
          Usuarios Nuevos
        </h3>
        <div className="stats-grid">
          <StatCard label="Usuarios Nuevos" value={reporte.nuevosUsuarios || 0} icon="bi-person-plus-fill" />
          <StatCard
            label="Prestadores Nuevos"
            value={reporte.nuevosPrestadores || 0}
            icon="bi-person-badge-fill"
            isNull={reporte.nuevosPrestadores == null}
          />
          <StatCard
            label="Clientes Nuevos"
            value={reporte.nuevosClientes || 0}
            icon="bi-person-fill"
            isNull={reporte.nuevosClientes == null}
          />
        </div>
      </div>

      {/* Reseñas e Ingresos */}
      <div className="reportes-category">
        <h3 className="category-title">
          <i className="bi bi-stars me-2" />
          Reseñas e Ingresos
        </h3>
        <div className="stats-grid">
          <StatCard
            label="Calificación Promedio"
            value={(reporte['promedioCalificacionesReseñas'] || 0).toFixed(2)}
            icon="bi-star-fill"
            suffix=" / 5"
          />
          <StatCard
            label="Total Reseñas"
            value={reporte['totalReseñas'] || 0}
            icon="bi-chat-left-text-fill"
          />
          <StatCard
            label="Ingreso Estimado"
            value={reporte.ingresoEstimado || 0}
            icon="bi-currency-dollar"
            prefix="$"
            isNull={reporte.ingresoEstimado == null}
          />
          <StatCard
            label="Especialidad Más Usada"
            value={reporte.especialidadMasUtilizada || '-'}
            icon="bi-award-fill"
            isNull={reporte.especialidadMasUtilizada == null}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportesStatsGrid;
