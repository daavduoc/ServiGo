// Componente de barra lateral para el prestador de servicios
import React from 'react';
import { PanelSidebar } from './PanelSidebar';

const PROVIDER_NAV_ITEMS = [
  { to: '/dashboard-prestador', icon: 'bi-grid-1x2', label: 'Mi Resumen' },
  { to: '/prestador/solicitudes', icon: 'bi-inbox', label: 'Nuevas Solicitudes' },
  { to: '/prestador/ingresar-servicio', icon: 'bi-plus-circle', label: 'Ingrese su servicio' },
  { to: '/prestador/gestionar-servicios', icon: 'bi-briefcase', label: 'Gestionar Servicios' }, // <-- LÍNEA NUEVA
  { to: '/prestador/mis-servicios', icon: 'bi-calendar-check', label: 'Mis Trabajos' },
  { to: '/prestador/perfil', icon: 'bi-person-vcard', label: 'Mi Perfil Profesional' },
  { to: '/prestador/soporte', icon: 'bi-headset', label: 'Centro de Ayuda' },
];

export const ProviderSidebar = ({ usuario }) => (
  <PanelSidebar
    usuario={usuario}
    navItems={PROVIDER_NAV_ITEMS}
    minHeight="100%"
    badgeClassName="bg-success text-white"
  />
);