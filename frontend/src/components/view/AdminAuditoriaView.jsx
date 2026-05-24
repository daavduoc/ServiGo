import React, { useState, useEffect } from 'react';
import AdminTable from '../ui/AdminTable';
import { obtenerAuditoria } from '../../serviceFront/adminService';

const AdminAuditoriaView = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAccion, setFiltroAccion] = useState('');
  const [filtroTabla, setFiltroTabla] = useState('');
  const [detalleModal, setDetalleModal] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    cargarAuditoria();
  }, [page, filtroAccion, filtroTabla]);

  const cargarAuditoria = async () => {
    try {
      setLoading(true);
      const data = await obtenerAuditoria(page, 10, filtroAccion, filtroTabla);
      setAuditorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const acciones = [
    { value: '', label: 'Todas' },
    { value: 'BLOQUEAR', label: 'Bloquear' },
    { value: 'DESBLOQUEAR', label: 'Desbloquear' },
    { value: 'DESACTIVAR', label: 'Desactivar' },
    { value: 'APROBAR', label: 'Aprobar' },
    { value: 'RECHAZAR', label: 'Rechazar' }
  ];

  const tablas = [
    { value: '', label: 'Todas' },
    { value: 'USUARIO', label: 'Usuario' },
    { value: 'PRESTADOR', label: 'Prestador' },
    { value: 'SOLICITUD_SERVICIO', label: 'Solicitud' }
  ];

  const columns = [
    { key: 'nombreAdmin', label: 'Admin' },
    { key: 'accion', label: 'Acción' },
    { key: 'email', label: 'Email' },
    { key: 'tablaAfectada', label: 'Tabla' },
    { key: 'registroId', label: 'ID Registro' },
    { key: 'fechaHora', label: 'Fecha/Hora' }
  ];

  const formatearFecha = (fechaHora) => {
    if (!fechaHora) return '-';
    try {
      let fecha;
      
      // Si es un array [año, mes, día, hora, minuto, segundo]
      if (Array.isArray(fechaHora)) {
        const [year, month, day, hour, minute, second] = fechaHora;
        fecha = new Date(year, month - 1, day, hour, minute, second);
      }
      // Si es un string ISO 8601
      else if (typeof fechaHora === 'string') {
        fecha = new Date(fechaHora);
      }
      // Si es un número (timestamp)
      else if (typeof fechaHora === 'number') {
        fecha = new Date(fechaHora);
      }
      
      // Validar que la fecha sea válida
      if (isNaN(fecha.getTime())) {
        return '-';
      }
      
      return fecha.toLocaleString('es-CL');
    } catch (error) {
      console.error('Error al formatear fecha:', error, fechaHora);
      return '-';
    }
  };

  return (
    <div className="admin-auditoria">
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-journal-text" aria-hidden="true" />
        Historial de Auditoría
      </h2>

      <div className="card shadow-sm border-0 p-3 mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label small fw-semibold text-muted mb-1">Acción</label>
            <select
              className="form-select form-select-sm"
              value={filtroAccion}
              onChange={(e) => {
                setFiltroAccion(e.target.value);
                setPage(0);
              }}
            >
              {acciones.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold text-muted mb-1">Tabla</label>
            <select
              className="form-select form-select-sm"
              value={filtroTabla}
              onChange={(e) => {
                setFiltroTabla(e.target.value);
                setPage(0);
              }}
            >
              {tablas.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={auditorias.map(a => ({
          ...a,
          nombreAdmin: a.nombreAdmin || 'Sistema',
          email: a.email || a.correo || '-',
          fechaHora: formatearFecha(a.fechaHora)
        }))}
        onEdit={(item) => setDetalleModal(item)}
        actionLabel="Ver Detalles"
      />

      {detalleModal && (
        <div className="modal-overlay" onClick={() => setDetalleModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de Cambio</h2>
              <button 
                className="modal-close" 
                onClick={() => setDetalleModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <p className="detail-label">Admin</p>
                  <p className="detail-value">{detalleModal.nombreAdmin || 'Sistema'}</p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Acción</p>
                  <p className="detail-value">{detalleModal.accion}</p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Tabla Afectada</p>
                  <p className="detail-value">{detalleModal.tablaAfectada}</p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">ID Registro</p>
                  <p className="detail-value">{detalleModal.registroId}</p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Valor Anterior</p>
                  <p className="detail-value">{detalleModal.valorAnterior || '-'}</p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Valor Nuevo</p>
                  <p className="detail-value">{detalleModal.valorNuevo || '-'}</p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Detalles</p>
                  <p className="detail-value">{detalleModal.detalles || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditoriaView;
