// archivo: src/utils/dateUtils.js

// calcula la fecha minima (hoy + 2 dias)
export const obtenerFechaMinimaNativa = () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 2); 
  
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  
  return `${anio}-${mes}-${dia}`;
};

// transforma a formato latino
export const transformarFechaALatino = (fechaNativa) => {
  if (!fechaNativa) return '';
  const [anio, mes, dia] = fechaNativa.split('-');
  return `${dia}-${mes}-${anio}`; 
};