import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateUserProfile, uploadProfilePhoto } from '../../serviceFront/userService';
import { CardContainer } from '../ui/CardContainer';
import { ButtonCustom } from '../ui/ButtonCustom';
import { ProviderNavTabs } from '../ui/ProviderNavTabs';
import { ProfileCard } from '../profile/ProfileCard';
import { ProfileDetails } from '../profile/ProfileDetails';

const mapPerfilToForm = (datos) => ({
  rut: datos.rut || '',
  nombre: datos.nombre || '',
  apellido: datos.apellido || '',
  correo: datos.correo || '',
  telefono: datos.telefono || '',
  region: datos.region || '',
  comuna: datos.comuna || '',
  direccion: datos.direccionLocal || datos.direccion || '',
  tipoPrestador: (datos.tipoPrestador || 'particular').toLowerCase(),
});

export const ProviderProfileView = () => {
  const { user, updateUserData } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [userId, setUserId] = useState(user?.idUsuario ?? null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState(user?.urlFotoCloud ?? null);
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
    tipoPrestador: 'particular',
  });
  const [savedSnapshot, setSavedSnapshot] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        setError(null);
        const datos = await getMyProfile();

        if (datos) {
          const mapped = mapPerfilToForm(datos);
          setUserId(datos.idUsuario);
          setFormData(mapped);
          setSavedSnapshot(mapped);

          const urlFoto = datos.urlFotoCloud || user?.urlFotoCloud || null;
          setFotoPreviewUrl(urlFoto);
          updateUserData({ ...datos, urlFotoCloud: urlFoto });
        }
      } catch (err) {
        setError(err.message || 'No se pudieron recuperar los datos del perfil.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.idUsuario) {
      cargarPerfil();
    } else {
      setLoading(false);
    }
  }, [user?.idUsuario]);

  const handlePhotoSelect = async (archivo) => {
    if (!archivo || !userId) return;
    setUploadingPhoto(true);
    setError(null);
    const vistaPreviaLocal = URL.createObjectURL(archivo);
    setFotoPreviewUrl(vistaPreviaLocal);

    try {
      const resultadoFoto = await uploadProfilePhoto(userId, archivo);
      const nuevaUrl = resultadoFoto?.urlFotoCloud || vistaPreviaLocal;
      setFotoPreviewUrl(nuevaUrl);
      updateUserData({ urlFotoCloud: nuevaUrl });

      setSuccessMessage('Fotografía actualizada con éxito.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Error al subir la imagen. Inténtalo nuevamente.');
      setFotoPreviewUrl(user?.urlFotoCloud || null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelEdit = () => {
    if (savedSnapshot) {
      setFormData(savedSnapshot);
    }
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    setError(null);

    try {
      const esEmpresa = formData.tipoPrestador === 'empresa';
      const payload = {
        rut: formData.rut,
        nombre: formData.nombre,
        apellido: esEmpresa ? '' : formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono,
        region: formData.region,
        comuna: formData.comuna,
        direccion: formData.direccion,
      };

      await updateUserProfile(userId, payload);
      updateUserData(payload);
      setSavedSnapshot(formData);
      setSuccessMessage('Datos actualizados con éxito.');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al actualizar los datos.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status" />
        <p className="text-muted mt-2">Cargando perfil...</p>
      </div>
    );
  }

  const esEmpresa = formData.tipoPrestador === 'empresa';

  return (
    <CardContainer maxwidth="1000px">
      <div className="d-flex justify-content-between align-items-start align-items-md-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-person-vcard-fill text-success me-2" />
            {isEditing ? 'Modificar mis datos' : 'Mi cuenta de prestador'}
          </h2>
        </div>
        <ProviderNavTabs active="perfil" />
      </div>

      {!isEditing && (
        <div className="text-end mb-4">
          <button
            type="button"
            className="btn btn-success fw-bold px-4 py-2 shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
          >
            <i className="bi bi-pencil-square me-2" />
            Modificar mis datos
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger text-center fw-bold shadow-sm">{error}</div>}
      {successMessage && (
        <div className="alert alert-success text-center fw-bold shadow-sm">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-md-4">
            <ProfileCard
              fotoPreviewUrl={fotoPreviewUrl}
              esEmpresa={esEmpresa}
              uploadingPhoto={uploadingPhoto}
              isEditing={isEditing}
              onPhotoSelect={handlePhotoSelect}
            />
          </div>

          <div className="col-md-8">
            <ProfileDetails
              profileData={formData}
              setProfileData={setFormData}
              isEditing={isEditing}
              esEmpresa={esEmpresa}
            />
          </div>
        </div>

        {isEditing && (
          <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
            <ButtonCustom
              texto="Cancelar"
              color="outline-secondary"
              onClick={handleCancelEdit}
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
      </form>
    </CardContainer>
  );
};
