import React, { useEffect, useState } from 'react';
import AdminTable from '../ui/AdminTable';
import FilterPanel from '../ui/FilterPanel';
import MensajeDetalleModal from '../sections/admin-soporte/MensajeDetalleModal';
import { listarMensajesSoporteAdmin } from '../../serviceFront/adminService';

const mapMensajeParaTabla = (mensaje) => ({
  ...mensaje,
  id: mensaje.idMensaje,
  rolRemitente: (() => {
    const map = { CLIENTE: 'Cliente', PRESTADOR: 'Prestador' };
    return map[mensaje.rolRemitente] || mensaje.rolRemitente || '—';
  })(),
  tipoProblema: (() => {
    const map = { cita: 'Cita', reconocimiento: 'Reconocimiento', otro: 'Otro' };
    return map[mensaje.tipoProblema] || mensaje.tipoProblema || '—';
  })(),
  estado: (() => {
    const map = { pendiente: 'Pendiente', en_proceso: 'En proceso', resuelto: 'Resuelto' };
    return map[mensaje.estado] || mensaje.estado || '—';
  })(),
  fechaCreacion: (() => {
    if (!mensaje.fechaCreacion) return '—';
    if (Array.isArray(mensaje.fechaCreacion)) {
      try {
        const [y, m, d, h = 0, min = 0] = mensaje.fechaCreacion;
        return new Date(y, m - 1, d, h, min).toLocaleDateString('es-CL', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        });
      } catch { return '—'; }
    }
    try {
      return new Date(mensaje.fechaCreacion).toLocaleDateString('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return '—'; }
  })(),
});

const AdminSoporteView = () => {
  const [mensajes, setMensajes] = useState([]);
  const [mensajesFiltrados, setMensajesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMensaje, setModalMensaje] = useState(null);

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarMensajesSoporteAdmin();
      const arr = Array.isArray(data) ? data.map(mapMensajeParaTabla) : [];
      setMensajes(arr);
      setMensajesFiltrados(arr);
    } catch (err) {
      console.error('Error cargando mensajes de soporte:', err);
      setError(err.message || 'No se pudo cargar los mensajes de soporte');
      setMensajes([]);
      setMensajesFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'nombreRemitente', label: 'Remitente' },
    { key: 'rolRemitente', label: 'Rol' },
    { key: 'tipoProblema', label: 'Tipo' },
    { key: 'asunto', label: 'Asunto' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaCreacion', label: 'Fecha' },
  ];

  const handleFilterApply = (filters) => {
    let filtered = mensajes;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((m) =>
          String(m[key] ?? '').toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });
    setMensajesFiltrados(filtered);
  };

  const handleFilterClear = () => {
    setMensajesFiltrados(mensajes);
  };

  if (loading) {
    return (
      <div className="admin-soporte text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando mensajes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-soporte">
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-headset" aria-hidden="true" />
        Soporte y Centro de Ayuda
      </h2>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      {!error && mensajes.length === 0 && (
        <div className="alert alert-info">No hay mensajes de soporte en el sistema.</div>
      )}

      <FilterPanel
        columns={columns}
        onApplyFilter={handleFilterApply}
        onClearFilter={handleFilterClear}
      />

      <AdminTable
        columns={columns}
        data={mensajesFiltrados}
        editLabel="Ver detalle"
        onEdit={(msg) => setModalMensaje(msg)}
      />

      {modalMensaje && (
        <MensajeDetalleModal
          mensaje={modalMensaje}
          onClose={() => setModalMensaje(null)}
          onActionComplete={cargarMensajes}
        />
      )}
    </div>
  );
};

export default AdminSoporteView;
