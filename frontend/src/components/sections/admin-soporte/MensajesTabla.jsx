import React from 'react';
import AdminTable from '../../ui/AdminTable';

const formatFechaArray = (arr) => {
  if (!arr || !Array.isArray(arr)) return '—';
  try {
    const [y, m, d, h = 0, min = 0] = arr;
    return new Date(y, m - 1, d, h, min).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

const formatFecha = (value) => {
  if (!value) return '—';
  if (Array.isArray(value)) return formatFechaArray(value);
  try {
    return new Date(value).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

const rolLabel = (rol) => {
  if (!rol) return '—';
  const map = { CLIENTE: 'Cliente', PRESTADOR: 'Prestador' };
  return map[rol] || rol;
};

const tipoLabel = (tipo) => {
  const map = {
    cita: 'Cita',
    reconocimiento: 'Reconocimiento',
    otro: 'Otro',
  };
  return map[tipo] || tipo || '—';
};

const estadoLabel = (estado) => {
  const map = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    resuelto: 'Resuelto',
  };
  return map[estado] || estado || '—';
};

const columns = [
  { key: 'nombreRemitente', label: 'Remitente' },
  { key: 'rolRemitente', label: 'Rol' },
  { key: 'tipoProblema', label: 'Tipo' },
  { key: 'asunto', label: 'Asunto' },
  { key: 'estado', label: 'Estado' },
  { key: 'fechaCreacion', label: 'Fecha' },
];

const MensajesTabla = ({ mensajes, onVerDetalle }) => {
  const tableData = mensajes.map((m) => ({
    ...m,
    id: m.idMensaje,
    rolRemitente: rolLabel(m.rolRemitente),
    tipoProblema: tipoLabel(m.tipoProblema),
    estado: estadoLabel(m.estado),
    fechaCreacion: formatFecha(m.fechaCreacion),
  }));

  return (
    <AdminTable
      columns={columns}
      data={tableData}
      editLabel="Ver detalle"
      onEdit={onVerDetalle}
    />
  );
};

export default MensajesTabla;
