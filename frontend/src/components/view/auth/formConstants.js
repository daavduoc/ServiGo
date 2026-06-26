export const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
  'Coquimbo', 'Valparaíso', 'Metropolitana', "O'Higgins",
  'Maule', 'Ñuble', 'Biobío', 'La Araucanía',
  'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];

export const ESPECIALIDADES_POR_TIPO = {
  tecnico: ['Gasfitería', 'Electricista'],
  profesional: ['Kinesiología', 'Psicología', 'Profesor Particular'],
};

export const GIROS = [
  'Servicios técnicos', 'Construcción',
  'Salud y bienestar', 'Educación', 'Comercio', 'Otro',
];

export const TIPO_REGISTRO = [
  {
    value: 'particular',
    title: 'Prestador a domicilio',
    subtitle: 'Persona Natural',
    icon: 'bi-person',
  },
  {
    value: 'empresa',
    title: 'Prestador establecido',
    subtitle: 'Empresa o Local',
    icon: 'bi-building',
  },
];

export const CATEGORIA_MAP = {
  tecnico: 1,
  profesional: 2,
};
