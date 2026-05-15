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
    { key: 'tablaAfectada', label: 'Tabla' },
    { key: 'registroId', label: 'ID Registro' },
    { key: 'fechaHora', label: 'Fecha/Hora' }
  ];

  if (loading) return <p>Cargando auditoría...</p>;

  return (
    <div className="admin-auditoria">
      <h1>Historial de Auditoría</h1>

      <div className="filtros-auditoria">
        <div className="filtro-group">
          <label>Acción:</label>
          <select 
            value={filtroAccion}
            onChange={(e) => {
              setFiltroAccion(e.target.value);
              setPage(0);
            }}
          >
            {acciones.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Tabla:</label>
          <select 
            value={filtroTabla}
            onChange={(e) => {
              setFiltroTabla(e.target.value);
              setPage(0);
            }}
          >
            {tablas.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={auditorias.map(a => ({
          ...a,
          nombreAdmin: a.nombreAdmin || 'Sistema',
          fechaHora: new Date(a.fechaHora).toLocaleString('es-CL')
        }))}
        onEdit={(item) => setDetalleModal(item)}
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
                  <p className="detail-label">Fecha/Hora</p>
                  <p className="detail-value">
                    {new Date(detalleModal.fechaHora).toLocaleString('es-CL')}
                  </p>
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
