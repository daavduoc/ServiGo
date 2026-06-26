// encavezado del perfil del prestador de servicio (nombre, foto, etc)
import React from 'react';
import { ProviderNavTabs } from '../../ui/ProviderNavTabs';

// Inicio seccion de cabecera del perfil del prestador
export const PerfilCabecera = ({ isEditing, onStartEdit }) => (
  <div className="d-flex justify-content-between align-items-start align-items-md-center border-bottom pb-3 mb-4 flex-wrap gap-3">
    <div>
      <h2 className="fw-bold text-dark mb-1">
        <i className="bi bi-person-vcard-fill text-success me-2" aria-hidden="true" />
        {isEditing ? 'Modificar mis datos' : 'Mi cuenta de prestador'}
      </h2>
    </div>

    <div className="d-flex align-items-center gap-3 flex-wrap">
      <ProviderNavTabs active="perfil" />
      {!isEditing && (
        <button
          type="button"
          className="btn btn-success fw-bold px-4 py-2 shadow-sm"
          onClick={onStartEdit}
        >
          <i className="bi bi-pencil-square me-2" aria-hidden="true" />
          Modificar mis datos
        </button>
      )}
    </div>
  </div>
);
// Fin seccion de cabecera del perfil del prestador