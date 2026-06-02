export const BLOQUES_HORARIOS = ['09:00', '11:00', '14:30', '16:30'];

const pad2 = (n) => String(n).padStart(2, '0');

export const DIAS_SEMANA_BACKEND = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
];

export const ETIQUETAS_DIA_CORTA = {
  LUNES: 'Lun',
  MARTES: 'Mar',
  MIERCOLES: 'Mié',
  JUEVES: 'Jue',
  VIERNES: 'Vie',
  SABADO: 'Sáb',
  DOMINGO: 'Dom',
};

export const NOMBRES_DIA = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
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

export const getFechaHoyStrings = () => {
  const hoy = new Date();
  const fechaHoyString = toFechaIso(hoy);
  const horaActualString = `${pad2(hoy.getHours())}:${pad2(hoy.getMinutes())}`;
  return { fechaHoyString, horaActualString };
};

/** Límites: mínimo 2 días desde hoy, máximo fin del mes siguiente. */
export const getLimitesAgenda = () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const min = new Date(hoy);
  min.setDate(min.getDate() + 2);

  const max = new Date(hoy.getFullYear(), hoy.getMonth() + 2, 0);

  return {
    fechaMinString: toFechaIso(min),
    fechaMaxString: toFechaIso(max),
    fechaMinDate: min,
    fechaMaxDate: max,
  };
};

export const parseFechaIso = (fechaIso) => {
  const [y, m, d] = fechaIso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const toFechaIso = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const getInicioSemana = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

export const addDias = (date, dias) => {
  const d = new Date(date);
  d.setDate(d.getDate() + dias);
  return d;
};

export const getDiaSemanaBackend = (date) => DIAS_SEMANA_BACKEND[date.getDay()];

export const esFechaAgendable = (fechaIso, fechaMinString, fechaMaxString) =>
  Boolean(fechaIso) && fechaIso >= fechaMinString && fechaIso <= fechaMaxString;

export const fechaCoincideDisponibilidad = (fechaIso, disponibilidades) => {
  if (!disponibilidades?.length) return true;
  const dia = getDiaSemanaBackend(parseFechaIso(fechaIso));

  const excluida = disponibilidades.some(
    (d) => d.excluido && d.fecha === fechaIso
  );
  if (excluida) return false;

  const tieneRecurrente = disponibilidades.some(
    (d) => !d.excluido && d.diaSemana === dia && d.fecha == null
  );

  const tieneEspecifica = disponibilidades.some(
    (d) => !d.excluido && d.fecha === fechaIso
  );

  return tieneRecurrente || tieneEspecifica;
};

export const filtrarDisponibilidades = (disponibilidades, idServicio) => {
  if (!disponibilidades?.length) return [];
  if (idServicio == null) return disponibilidades;
  const conServicio = disponibilidades.filter((d) => d.idServicio != null && Number(d.idServicio) === Number(idServicio));
  const sinServicio = disponibilidades.filter((d) => d.idServicio == null);
  if (conServicio.length > 0) return conServicio;
  return sinServicio.length > 0 ? sinServicio : [];
};

export const esFechaReservable = (fechaIso, fechaMinString, fechaMaxString, disponibilidades) =>
  esFechaAgendable(fechaIso, fechaMinString, fechaMaxString) &&
  fechaCoincideDisponibilidad(fechaIso, disponibilidades);

export const formatFechaCitaLegible = (fechaIso) => {
  if (!fechaIso) return '';
  const date = parseFechaIso(fechaIso);
  const mes = MESES_ES[date.getMonth()] || '';
  return `${date.getDate()} de ${mes} de ${date.getFullYear()}`;
};

export const formatFechaChip = (fechaIso) => {
  if (!fechaIso) return '';
  const date = parseFechaIso(fechaIso);
  const dia = NOMBRES_DIA[getDiaSemanaBackend(date)] || '';
  const mes = MESES_ES[date.getMonth()] || '';
  return `${dia.slice(0, 3)} ${date.getDate()} ${mes}`;
};

export const formatFechaHorarioTitulo = (fechaIso) => {
  if (!fechaIso) return '';
  const date = parseFechaIso(fechaIso);
  const dia = NOMBRES_DIA[getDiaSemanaBackend(date)] || '';
  const mes = MESES_ES[date.getMonth()] || '';
  return `${dia} ${date.getDate()} de ${mes}`;
};

export const formatRangoSemana = (inicio, fin) => {
  const mesIni = MESES_ES[inicio.getMonth()];
  const mesFin = MESES_ES[fin.getMonth()];
  if (inicio.getMonth() === fin.getMonth()) {
    return `${inicio.getDate()} al ${fin.getDate()} de ${mesIni}`;
  }
  return `${inicio.getDate()} de ${mesIni} al ${fin.getDate()} de ${mesFin}`;
};

export const generarHorariosEnRango = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return [];
  const [hIni, mIni] = horaInicio.split(':').map(Number);
  const [hFin, mFin] = horaFin.split(':').map(Number);
  let current = hIni * 60 + (mIni || 0);
  const end = hFin * 60 + (mFin || 0);
  const slots = [];
  
  // Genera horas cada 60 minutos sin pasarse de la hora final
  while (current <= end) {
    const hh = Math.floor(current / 60);
    const mm = current % 60;
    slots.push(`${pad2(hh)}:${pad2(mm)}`);
    current += 60;
  }
  return slots;
};

export const horariosParaFecha = (fechaIso, disponibilidades) => {
  if (!fechaIso) return [];
  if (!disponibilidades?.length) return [];

  const excluida = disponibilidades.some(
    (d) => d.excluido && d.fecha === fechaIso
  );
  if (excluida) return [];

  const dia = getDiaSemanaBackend(parseFechaIso(fechaIso));

  const reglas = disponibilidades.filter(
    (d) => !d.excluido && (
      (d.fecha == null && d.diaSemana === dia) ||
      (d.fecha === fechaIso)
    )
  );

  if (!reglas.length) return [];

  const slots = new Set();
  reglas.forEach((regla) => {
    generarHorariosEnRango(regla.horaInicio, regla.horaFin).forEach((h) => slots.add(h));
  });
  return [...slots].sort();
};

export const listarProximasFechas = (
  fechaMinString,
  fechaMaxString,
  disponibilidades,
  excluirSemanaInicio
) => {
  const fechas = [];
  let cursor = parseFechaIso(fechaMinString);
  const max = parseFechaIso(fechaMaxString);
  const finSemanaExcluida = excluirSemanaInicio ? addDias(excluirSemanaInicio, 6) : null;

  while (cursor <= max) {
    const iso = toFechaIso(cursor);
    const enSemanaActual =
      finSemanaExcluida &&
      cursor >= excluirSemanaInicio &&
      cursor <= finSemanaExcluida;

    if (!enSemanaActual && esFechaReservable(iso, fechaMinString, fechaMaxString, disponibilidades)) {
      fechas.push(iso);
    }
    cursor = addDias(cursor, 1);
  }
  return fechas;
};

export const etiquetaDiaRecurrente = (diaSemana) =>
  NOMBRES_DIA[diaSemana] || diaSemana;

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
    return 'La fecha debe estar entre hoy + 2 días y el fin del mes siguiente.';
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