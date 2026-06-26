const PANEL_PREFIXES = [
  '/admin',
  '/prestador',
  '/dashboard-prestador',
  '/dashboard-cliente',
  '/perfil',
  '/mis-reservas',
  '/notificaciones',
  '/soporte',
];

export const isPanelRoute = (pathname) =>
  PANEL_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export const isFullBleedPublicRoute = (pathname) => {
  if (pathname === '/' || pathname === '/buscar' || pathname === '/politicas') return true;
  if (pathname.startsWith('/servicio-detalle')) return true;
  if (pathname.startsWith('/unete')) return true;
  if (pathname === '/registro' || pathname.startsWith('/registro/')) return true;
  return false;
};
