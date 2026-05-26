export const BLOQUES_HORARIOS = ['09:00', '11:00', '14:30', '16:30'];

const pad2 = (n) => String(n).padStart(2, '0');

export const getFechaHoyStrings = () => {
  const hoy = new Date();
  const fechaHoyString = `${hoy.getFullYear()}-${pad2(hoy.getMonth() + 1)}-${pad2(hoy.getDate())}`;
  const horaActualString = `${pad2(hoy.getHours())}:${pad2(hoy.getMinutes())}`;
  return { fechaHoyString, horaActualString };
};

/** Límites de agenda: mínimo 2 días desde hoy, máximo fin de mes calendario. */
export const getLimitesAgenda = () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const min = new Date(hoy);
  min.setDate(min.getDate() + 2);

  const lastDay = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();

  return {
    fechaMinString: `${min.getFullYear()}-${pad2(min.getMonth() + 1)}-${pad2(min.getDate())}`,
    fechaMaxString: `${hoy.getFullYear()}-${pad2(hoy.getMonth() + 1)}-${pad2(lastDay)}`,
  };
};

export const isHoraPasada = (fechaIso, hora, fechaHoyString, horaActualString) => {
  if (!fechaIso || !hora) return false;
  if (fechaIso === fechaHoyString && hora < horaActualString) return true;
  return false;
};

export const validarReglaAgenda = (fecha, hora, fechaHoyString, horaActualString) => {
  if (!fecha || !hora) {
    return 'Por favor, selecciona una fecha y una hora para continuar.';
  }
  const { fechaMinString, fechaMaxString } = getLimitesAgenda();
  if (fecha < fechaMinString || fecha > fechaMaxString) {
    return 'La fecha debe estar entre hoy + 2 días y el fin del mes actual.';
  }
  if (isHoraPasada(fecha, hora, fechaHoyString, horaActualString)) {
    return 'El horario seleccionado ya ha pasado. Elige una hora futura.';
  }
  return null;
};

export const validarSeleccionHorario = (fecha, hora, fechaHoyString, horaActualString) => {
  if (!fecha || !hora) {
    return 'Por favor, selecciona una fecha y una hora para continuar.';
  }
  return validarReglaAgenda(fecha, hora, fechaHoyString, horaActualString);
};

const MESES_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const formatFechaCitaLegible = (fechaIso) => {
  if (!fechaIso) return '';
  const [y, m, d] = fechaIso.split('-').map(Number);
  if (!y || !m || !d) return fechaIso;
  const mes = MESES_ES[m - 1] || '';
  return `${d} de ${mes} de ${y}`;
};

/** Mensajes orientados al cliente según estado de la reserva. */
export const mensajeEstadoReserva = (estado) => {
  const e = (estado || '').toLowerCase();
  if (e.includes('pendiente')) {
    return 'Esperando confirmación del especialista.';
  }
  if (e.includes('confirm')) {
    return 'El especialista confirmó tu cita.';
  }
  if (e.includes('finaliz')) {
    return 'Atención completada. ¡Gracias por usar ServiGo!';
  }
  if (e.includes('cancel')) {
    return 'Esta cita fue cancelada.';
  }
  if (e.includes('rechaz')) {
    return 'El especialista no pudo aceptar esta solicitud.';
  }
  return null;
};
