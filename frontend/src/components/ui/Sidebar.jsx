import React from 'react';
import { PanelSidebar } from './PanelSidebar';

const CLIENT_NAV_ITEMS = [
  { to: '/dashboard-cliente', icon: 'bi-grid-1x2', label: 'Mi Resumen' },
  { to: '/perfil', icon: 'bi-pencil-square', label: 'Actualizar mis Datos' },
  { to: '/mis-reservas', icon: 'bi-calendar-check', label: 'Mis Horas y Reservas' },
  { to: '/buscar', icon: 'bi-search', label: 'Buscar Especialistas' },
  { to: '/soporte', icon: 'bi-headset', label: 'Centro de Ayuda y Soporte' },
];

export const Sidebar = ({ usuario }) => (
  <PanelSidebar usuario={usuario} navItems={CLIENT_NAV_ITEMS} minHeight="100vh" />
);
