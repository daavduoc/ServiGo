export const BLOQUES_HORARIOS = ['09:00', '11:00', '14:30', '16:30'];

export const getFechaHoyStrings = () => {
  const hoy = new Date();
  const fechaHoyString = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  const horaActualString = `${String(hoy.getHours()).padStart(2, '0')}:${String(hoy.getMinutes()).padStart(2, '0')}`;
  return { fechaHoyString, horaActualString };
};

export const validarSeleccionHorario = (fecha, hora, fechaHoyString, horaActualString) => {
  if (!fecha || !hora) {
    return 'Por favor, selecciona una fecha y una hora para continuar.';
  }
  if (fecha === fechaHoyString && hora < horaActualString) {
    return 'El horario seleccionado ya ha pasado. Por favor, elige un bloque posterior.';
  }
  return null;
};
