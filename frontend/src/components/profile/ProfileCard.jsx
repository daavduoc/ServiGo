import React from 'react';
import { PhotoUpload } from '../ui/PhotoUpload';

export const ProfileCard = ({ 
  fotoPreviewUrl, 
  esEmpresa, 
  uploadingPhoto, 
  isEditing, 
  onPhotoSelect 
}) => {
  return (
    <div className="card shadow-sm border-0 p-4 text-center h-100">
      <PhotoUpload
        key={fotoPreviewUrl || 'sin-foto-perfil'}
        label={esEmpresa ? 'Logo Corporativo' : 'Fotografía de Perfil'}
        variant={esEmpresa ? 'empresa' : 'person'}
        onImageSelect={onPhotoSelect}
        dropzoneTitle={
          uploadingPhoto 
            ? 'Subiendo imagen...' 
            : (fotoPreviewUrl ? 'Clic o arrastrar para cambiar' : 'Clic o arrastrar para subir')
        }
        initialPreview={fotoPreviewUrl}
        disabled={!isEditing || uploadingPhoto} 
      />
      
      {uploadingPhoto && (
        <div className="mt-2 text-success small fw-bold">
          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          Actualizando en la base de datos...
        </div>
      )}
      
      <div className="mt-4">
        <span className="badge bg-success text-white px-3 py-2 text-capitalize fw-bold rounded-pill">
          <i className={`bi ${esEmpresa ? 'bi-building' : 'bi-person-badge'} me-2`}></i>
          Perfil: {esEmpresa ? 'Persona Jurídica (Empresa)' : 'Persona Natural'}
        </span>
      </div>
    </div>
  );
};