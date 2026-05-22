import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEstadisticas } from '../../serviceFront/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await obtenerEstadisticas();
      setStats(data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-dashboard"><p>Cargando...</p></div>;
  if (error) return <div className="admin-dashboard"><p className="error">{error}</p></div>;
  if (!stats) return null;

  return (
    <div className="admin-dashboard">
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-grid-1x2" aria-hidden="true" />
        Dashboard de Administración
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Usuarios Totales</h3>
          <p className="stat-value">{stats.totalUsuarios}</p>
          <p className="stat-desc">Registrados en el sistema</p>
        </div>

        <div className="stat-card">
          <h3>Usuarios Activos</h3>
          <p className="stat-value">{stats.usuariosActivos}</p>
          <p className="stat-desc">Con acceso habilitado</p>
        </div>

        <div className="stat-card">
          <h3>Usuarios Bloqueados</h3>
          <p className="stat-value">{stats.usuariosBloqueados}</p>
          <p className="stat-desc">Restringidos en el sistema</p>
        </div>

        <div className="stat-card">
          <h3>Prestadores Validados</h3>
          <p className="stat-value">{stats.prestadoresValidados}</p>
          <p className="stat-desc">Verificados por admin</p>
        </div>

        <Link
          to="/admin/prestadores"
          className="stat-card text-decoration-none stat-card--link"
          style={{ display: 'block', color: 'inherit' }}
        >
          <h3>Prestadores pendientes</h3>
          <p className="stat-value">{stats.prestadoresPendientes}</p>
          <p className="stat-desc mb-0">
            {stats.prestadoresPendientes > 0
              ? 'Ir a validar solicitudes →'
              : 'Sin solicitudes por revisar'}
          </p>
        </Link>

        <div className="stat-card">
          <h3>Solicitudes Completadas</h3>
          <p className="stat-value">{stats.solicitudesCompletadas}</p>
          <p className="stat-desc">Servicios finalizados</p>
        </div>
      </div>

      <div className="stats-section">
        <h2>Resumen General</h2>
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <p className="label">Calificación Promedio</p>
            <p className="value">⭐ {(stats.calificacionPromedio || 0).toFixed(2)}</p>
          </div>
          <div className="breakdown-item">
            <p className="label">Ingresos Totales</p>
            <p className="value">💰 ${stats.ingresosTotales || 0}</p>
          </div>
          <div className="breakdown-item">
            <p className="label">Reportes Activos</p>
            <p className="value">🚨 {stats.reportesActivos || 0}</p>
          </div>
        </div>
      </div>

      <button type="button" className="btn btn-success rounded-pill px-4 fw-semibold" onClick={cargarEstadisticas}>
        <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
        Refrescar
      </button>
    </div>
  );
};

export default AdminDashboard;