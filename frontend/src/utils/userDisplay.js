/** Nombre visible a partir del usuario en sesión o del perfil API */
export const getDisplayName = (user) => {
  if (!user) return 'Usuario';
  const nombre = user.nombre?.trim() || '';
  const apellido = user.apellido?.trim() || '';
  if (nombre && apellido) return `${nombre} ${apellido}`;
  if (nombre) return nombre;
  return user.correo || 'Usuario';
};

export const normalizeRol = (rol) => String(rol || '').trim().toUpperCase();

export const isAdminUser = (user) => normalizeRol(user?.rol) === 'ADMIN';

export const isPrestadorUser = (user) => normalizeRol(user?.rol) === 'PRESTADOR';

/** Ruta principal tras iniciar sesión según el rol */
export const getDashboardPathForRol = (rol) => {
  switch (normalizeRol(rol)) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'PRESTADOR':
      return '/dashboard-prestador';
    case 'CLIENTE':
    default:
      return '/dashboard-cliente';
  }
};

/** Etiqueta legible del rol */
export const getRolLabel = (rol) => {
  if (!rol) return 'Usuario';
  switch (normalizeRol(rol)) {
    case 'CLIENTE':
      return 'Cliente';
    case 'PRESTADOR':
      return 'Prestador';
    case 'ADMIN':
      return 'Admin';
    default:
      return rol;
  }
};
