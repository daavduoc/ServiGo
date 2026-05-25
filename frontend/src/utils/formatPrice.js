export const formatearPrecio = (precio) => {
  if (precio == null || precio <= 0) return 'Consultar precio';
  return `$${Number(precio).toLocaleString('es-CL')}`;
};
