import React from 'react';

export const ClientProfileCard = ({
  profileData,
  fotoError,
  setFotoError,
  fileInputRef,
  handlePhotoSelect,
  uploadingPhoto,
  isEditing,
  setIsEditing,
}) => {
  return (
    <div className="card shadow-sm border-0 p-4 text-center">
      <div className="rounded-circle overflow-hidden d-inline-flex justify-content-center align-items-center mb-3 mx-auto bg-secondary bg-opacity-25 profile-avatar-container">
        {profileData.urlFotoCloud && !fotoError ? (
          <img
            src={profileData.urlFotoCloud}
            alt={`Foto de ${profileData.nombre}`}
            className="w-100 h-100 profile-avatar-img"
            onError={() => setFotoError(true)}
          />
        ) : (
          <i className="bi bi-person-circle profile-avatar-placeholder" aria-label="Sin foto" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="d-none"
        onChange={handlePhotoSelect}
      />

      <button
        type="button"
        className="btn btn-outline-success btn-sm mb-3"
        disabled={uploadingPhoto}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadingPhoto ? (
          'Subiendo foto...'
        ) : (
          <>
            <i className="bi bi-camera me-1" aria-hidden="true" /> Cambiar foto
          </>
        )}
      </button>

      <h3 className="fw-semibold mb-0">
        {profileData.nombre} {profileData.apellido}
      </h3>
      <p className="text-muted mb-2">{profileData.correo}</p>
      <p className="text-muted small">RUT: {profileData.rut}</p>

      <hr />

      <div className="text-start">
        <p className="mb-2">
          <strong>Teléfono:</strong> {profileData.telefono || 'No especificado'}
        </p>
        <p className="mb-2">
          <strong>Dirección:</strong> {profileData.direccion || 'No especificada'}
        </p>
        <p className="mb-2">
          <strong>Comuna:</strong> {profileData.comuna || 'No especificada'}
        </p>
        <p className="mb-0">
          <strong>Región:</strong> {profileData.region || 'No especificada'}
        </p>
      </div>

      <hr />

      {!isEditing && (
        <button
          type="button"
          className="btn btn-success w-100 shadow-sm text-white fw-medium"
          onClick={() => setIsEditing(true)}
        >
          <i className="bi bi-pencil-square me-1" aria-hidden="true" />
          Editar Perfil
        </button>
      )}
    </div>
  );
};
