// componente para el formulario completo del perfil del prestador de servicio
import React from 'react';
import { ProfileCard }    from '../../profile/ProfileCard';
import { ProfileDetails } from '../../profile/ProfileDetails';
import { ButtonCustom }   from '../../ui/ButtonCustom';

// Inicio seccion de formulario completo del perfil
export const PerfilFormulario = ({
  formData,
  setFormData,
  fotoPreviewUrl,
  esEmpresa,
  isEditing,
  isSaving,
  uploadingPhoto,
  onPhotoSelect,
  onCancel,
}) => (
  <form>
    {/* Inicio seccion de layout foto y datos */}
    <div className="row g-4">
      <div className="col-md-4">
        {/* Inicio seccion de foto de perfil */}
        <ProfileCard
          fotoPreviewUrl={fotoPreviewUrl}
          esEmpresa={esEmpresa}
          uploadingPhoto={uploadingPhoto}
          isEditing={isEditing}
          onPhotoSelect={onPhotoSelect}
        />
        {/* Fin seccion de foto de perfil */}
      </div>

      <div className="col-md-8">
        {/* Inicio seccion de campos de datos */}
        <ProfileDetails
          profileData={formData}
          setProfileData={setFormData}
          isEditing={isEditing}
          esEmpresa={esEmpresa}
        />
        {/* Fin seccion de campos de datos */}
      </div>
    </div>
    {/* Fin seccion de layout foto y datos */}

    {/* Inicio seccion de botones de acción en modo edición, simbolos && sirven para condicionar la renderización */}
    {isEditing && (
      <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
        <ButtonCustom
          texto="Cancelar"
          color="outline-secondary"
          onClick={onCancel}
          disabled={isSaving || uploadingPhoto}
        />
        <button
          type="submit"
          className="btn btn-success fw-bold px-4"
          disabled={isSaving || uploadingPhoto}
        >
          {isSaving ? 'Guardando...' : 'Confirmar y guardar'}
        </button>
      </div>
    )}
    {/* Fin seccion de botones de acción en modo edición */}
  </form>
);
// Fin seccion de formulario completo del perfil