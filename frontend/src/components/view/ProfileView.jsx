import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, uploadProfilePhoto, updateUserProfile } from '../../serviceFront/userService';
import { ClientProfileCard } from '../profile/ClientProfileCard';
import { ClientProfileDetails } from '../profile/ClientProfileDetails';
import { ProfileModals } from '../profile/ProfileModals';

export const ProfileView = () => {
  const { user, isAuthenticated, updateUserData } = useAuth();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    rut: '',
    urlFotoCloud: '',
  });
  const [savedSnapshot, setSavedSnapshot] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [fotoError, setFotoError] = useState(false);

  const [modals, setModals] = useState({ password: false, notifications: false, delete: false });
  const toggleModal = (type, value) => setModals((prev) => ({ ...prev, [type]: value }));

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyProfile();
        const fotoUrl = data.urlFotoCloud || '';
        const loaded = {
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          correo: data.correo || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          comuna: data.comuna || '',
          region: data.region || '',
          rut: data.rut || '',
          urlFotoCloud: fotoUrl,
        };
        setFotoError(false);
        setProfileData(loaded);
        setSavedSnapshot(loaded);
        updateUserData({ ...data, urlFotoCloud: fotoUrl });
      } catch (err) {
        setError(err.message || 'Error al cargar el perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && localStorage.getItem('token')) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.idUsuario) return;

    setUploadingPhoto(true);
    setError(null);
    setSuccessMessage('');

    try {
      const result = await uploadProfilePhoto(user.idUsuario, file);
      const nuevaUrl = result.urlFotoCloud || '';
      setFotoError(false);
      setProfileData((prev) => {
        const next = { ...prev, urlFotoCloud: nuevaUrl };
        setSavedSnapshot(next);
        return next;
      });
      updateUserData({ urlFotoCloud: nuevaUrl });
      setSuccessMessage('Foto de perfil actualizada');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'No se pudo subir la foto');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!user?.idUsuario) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      const payload = {
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        telefono: profileData.telefono,
        direccion: profileData.direccion,
        comuna: profileData.comuna,
        region: profileData.region,
      };

      await updateUserProfile(user.idUsuario, payload);
      updateUserData(payload);
      setSavedSnapshot(profileData);
      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (savedSnapshot) {
      setProfileData(savedSnapshot);
    }
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="container mt-5 mb-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 position-relative client-panel-content">
      <div className="row">
        <div className="col-md-4 mb-4">
          <ClientProfileCard
            profileData={profileData}
            fotoError={fotoError}
            setFotoError={setFotoError}
            fileInputRef={fileInputRef}
            handlePhotoSelect={handlePhotoSelect}
            uploadingPhoto={uploadingPhoto}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
        <div className="col-md-8">
          <ClientProfileDetails
            isEditing={isEditing}
            profileData={profileData}
            setProfileData={setProfileData}
            error={error}
            setError={setError}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
            handleSave={handleSave}
            handleCancel={handleCancel}
            toggleModal={toggleModal}
            uploadingPhoto={uploadingPhoto}
            isSaving={isSaving}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>
      <ProfileModals modals={modals} toggleModal={toggleModal} />
    </div>
  );
};
