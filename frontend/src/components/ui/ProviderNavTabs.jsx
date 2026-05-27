// Componente de navegación para el prestador de servicios
import React from 'react';
import { Link } from 'react-router-dom';

const TABS = [
  { key: 'resumen', to: '/dashboard-prestador', label: 'Mi Resumen' },
  { key: 'solicitudes', to: '/prestador/solicitudes', label: 'Nuevas Solicitudes' },
  { key: 'gestionar', to: '/prestador/gestionar-servicios', label: 'Gestionar Servicios' }, // <-- LÍNEA NUEVA
  { key: 'servicios', to: '/prestador/mis-servicios', label: 'Mis Trabajos' },
  { key: 'perfil', to: '/prestador/perfil', label: 'Mi Perfil' },
];

export const ProviderNavTabs = ({ active }) => (
  <div className="btn-group flex-wrap">
    {TABS.map((tab) => (
      <Link
        key={tab.key}
        to={tab.to}
        className={`btn btn-sm ${active === tab.key ? 'btn-success active' : 'btn-outline-success'}`}
      >
        {tab.label}
      </Link>
    ))}
  </div>
);