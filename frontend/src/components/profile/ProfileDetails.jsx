import React from 'react';

export const ProfileDetails = ({ profileData, setProfileData, isEditing, esEmpresa }) => {
  if (!profileData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (setProfileData) {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 h-100">
      <h5 className="text-success fw-bold mb-4 text-uppercase border-bottom pb-2">
        <i className="bi bi-card-heading me-2"></i>Credenciales e Identidad
      </h5>
      
      <div className="row g-4 mb-4">
        
        {/* RUT */}
        <div className="col-12">
          <label className="form-label text-muted small fw-bold text-uppercase">RUT Registrado</label>
          <input 
            type="text" 
            name="rut" 
            className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold border-0' : ''}`} 
            value={profileData?.rut || ''} 
            onChange={handleChange}
            disabled={!isEditing} 
            required
          />
        </div>

        {/* NOMBRE O RAZÓN SOCIAL */}
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold text-uppercase">
            {esEmpresa ? 'Razón Social / Empresa' : 'Nombres'}
          </label>
          <input
            type="text"
            name="nombre"
            className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold border-0' : ''}`}
            value={profileData?.nombre || ''}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        {/* APELLIDO */}
        {!esEmpresa && (
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold text-uppercase">Apellidos</label>
            <input
              type="text"
              name="apellido"
              className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold border-0' : ''}`}
              value={profileData?.apellido || ''}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>
        )}

        {/* CORREO */}
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold text-uppercase">Correo de Contacto</label>
          <input
            type="email"
            name="correo"
            className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold border-0' : ''}`}
            value={profileData?.correo || ''}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        {/* TELÉFONO */}
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold text-uppercase">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold border-0' : ''}`}
            value={profileData?.telefono || ''}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
      </div>

      <h5 className="text-success fw-bold mb-4 mt-2 text-uppercase border-bottom pb-2">
        <i className="bi bi-geo-alt me-2"></i>Ubicación de Operaciones
      </h5>
      
      <div className="row g-4">
        {/* REGIÓN */}
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold text-uppercase">Región</label>
          <input
            type="text"
            name="region"
            className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold border-0' : ''}`}
            value={profileData?.region || ''}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
        
        {/* COMUNA */}
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold text-uppercase">Comuna</label>
          <input
            type="text"
            name="comuna"
            className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold border-0' : ''}`}
            value={profileData?.comuna || ''}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
        
        {/* DIRECCIÓN */}
        <div className="col-12">
          <label className="form-label text-muted small fw-bold text-uppercase">Dirección Exacta</label>
          <input
            type="text"
            name="direccion"
            className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold border-0' : ''}`}
            value={profileData?.direccion || ''}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
      </div>
    </div>
  );
};