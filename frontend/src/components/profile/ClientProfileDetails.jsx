import React from 'react';

export const ClientProfileDetails = ({
  isEditing,
  profileData,
  setProfileData,
  error,
  setError,
  successMessage,
  setSuccessMessage,
  handleSave,
  handleCancel,
  toggleModal,
  uploadingPhoto,
  isSaving,
  fileInputRef,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <>
      <div className="card shadow-sm border-0 p-4">
        <h4 className="mb-4 profile-panel-title">
          <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-vcard'}`} aria-hidden="true" />
          {isEditing ? 'Actualizar mis Datos' : 'Mis Datos Personales'}
        </h4>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Cerrar" />
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage('')}
              aria-label="Cerrar"
            />
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmitForm}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={profileData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  value={profileData.apellido}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Correo</label>
                <input type="email" className="form-control" value={profileData.correo} disabled />
                <small className="text-muted">El correo no puede ser modificado</small>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefono"
                  value={profileData.telefono}
                  onChange={handleInputChange}
                  placeholder="Ej: +56912345678"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Dirección</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                value={profileData.direccion}
                onChange={handleInputChange}
                placeholder="Ej: Calle Principal 123"
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Comuna</label>
                <input
                  type="text"
                  className="form-control"
                  name="comuna"
                  value={profileData.comuna}
                  onChange={handleInputChange}
                  placeholder="Ej: Puente Alto"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Región</label>
                <input
                  type="text"
                  className="form-control"
                  name="region"
                  value={profileData.region}
                  onChange={handleInputChange}
                  placeholder="Ej: Metropolitana"
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success flex-grow-1 fw-bold" disabled={isSaving}>
                <i className="bi bi-check-lg me-1" aria-hidden="true" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                className="btn btn-secondary flex-grow-1 fw-bold"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <i className="bi bi-x-lg me-1" aria-hidden="true" /> Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="row mb-4">
              <div className="col-md-6">
                <h5 className="text-muted mb-2">Nombre Completo</h5>
                <p className="fs-5 fw-bold">
                  {profileData.nombre} {profileData.apellido}
                </p>
              </div>
              <div className="col-md-6">
                <h5 className="text-muted mb-2">Teléfono</h5>
                <p className="fs-5 fw-bold">{profileData.telefono || 'No especificado'}</p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <h5 className="text-muted mb-2">Correo</h5>
                <p className="fs-5">{profileData.correo}</p>
              </div>
              <div className="col-md-6">
                <h5 className="text-muted mb-2">RUT</h5>
                <p className="fs-5">{profileData.rut}</p>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-muted mb-2">Dirección</h5>
              <p className="fs-5">{profileData.direccion || 'No especificada'}</p>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <h5 className="text-muted mb-2">Comuna</h5>
                <p className="fs-5">{profileData.comuna || 'No especificada'}</p>
              </div>
              <div className="col-md-6">
                <h5 className="text-muted mb-2">Región</h5>
                <p className="fs-5">{profileData.region || 'No especificada'}</p>
              </div>
            </div>

            <div className="bg-light p-4 rounded-3 border-start border-success border-4">
              <p className="text-muted mb-0">
                <i className="bi bi-lightbulb text-success me-2" aria-hidden="true" />
                Haz clic en <strong>&quot;Editar Perfil&quot;</strong> para actualizar tu información de contacto y
                dirección.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="card shadow-sm border-0 p-4 mt-4">
        <h5 className="mb-3 profile-settings-title">
          <i className="bi bi-gear" aria-hidden="true" />
          Configuración de Cuenta
        </h5>
        <div className="list-group list-group-flush">
          <button
            type="button"
            onClick={() => toggleModal('password', true)}
            className="list-group-item list-group-item-action profile-settings-item"
          >
            <i className="bi bi-lock profile-settings-item__icon" aria-hidden="true" />
            <span className="profile-settings-item__label">Cambiar Contraseña</span>
            <i className="bi bi-chevron-right profile-settings-item__chevron" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => toggleModal('notifications', true)}
            className="list-group-item list-group-item-action profile-settings-item"
          >
            <i className="bi bi-bell profile-settings-item__icon" aria-hidden="true" />
            <span className="profile-settings-item__label">Preferencias de Notificaciones</span>
            <i className="bi bi-chevron-right profile-settings-item__chevron" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="list-group-item list-group-item-action profile-settings-item"
            disabled={uploadingPhoto}
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="bi bi-camera profile-settings-item__icon" aria-hidden="true" />
            <span className="profile-settings-item__label">Cambiar Foto de Perfil</span>
            <i className="bi bi-chevron-right profile-settings-item__chevron" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => toggleModal('delete', true)}
            className="list-group-item list-group-item-action profile-settings-item profile-settings-item--danger text-danger fw-medium"
          >
            <i className="bi bi-trash profile-settings-item__icon" aria-hidden="true" />
            <span className="profile-settings-item__label">Eliminar Cuenta</span>
            <i className="bi bi-chevron-right profile-settings-item__chevron" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
};
