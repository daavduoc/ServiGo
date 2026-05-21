/** Nombre visible a partir del usuario en sesión o del perfil API */
export const getDisplayName = (user) => {
  if (!user) return 'Usuario';
  const nombre = user.nombre?.trim() || '';
  const apellido = user.apellido?.trim() || '';
  if (nombre && apellido) return `${nombre} ${apellido}`;
  if (nombre) return nombre;
  return user.correo || 'Usuario';
};

/** Etiqueta legible del rol */
export const getRolLabel = (rol) => {
  if (!rol) return 'Usuario';
  switch (String(rol).toUpperCase()) {
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
