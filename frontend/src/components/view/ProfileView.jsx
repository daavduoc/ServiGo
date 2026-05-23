import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, uploadProfilePhoto } from '../../serviceFront/userService';
import { ProfileCard } from '../profile/ProfileCard';
import { ProfileDetails } from '../profile/ProfileDetails';
import { ProfileModals } from '../profile/ProfileModals';

export const ProfileView = () => {
  const { user, isAuthenticated, updateUserData } = useAuth();
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    nombre: '', apellido: '', correo: '', telefono: '', direccion: '', comuna: '', region: '', rut: '', urlFotoCloud: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [fotoError, setFotoError] = useState(false);

  // Unificamos el manejo de modales en un solo objeto de estado
  const [modals, setModals] = useState({ password: false, notifications: false, delete: false });
  const toggleModal = (type, value) => setModals(prev => ({ ...prev, [type]: value }));

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyProfile();
        const fotoUrl = data.urlFotoCloud || '';
        setFotoError(false);
        setProfileData({
          nombre: data.nombre || '', apellido: data.apellido || '', correo: data.correo || '',
          telefono: data.telefono || '', direccion: data.direccion || '', comuna: data.comuna || '',
          region: data.region || '', rut: data.rut || '', urlFotoCloud: fotoUrl,
        });
        updateUserData({ ...data, urlFotoCloud: fotoUrl });
      } catch (err) {
        setError('Error al cargar el perfil');
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
      setProfileData(prev => ({ ...prev, urlFotoCloud: nuevaUrl }));
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

  const handleSave = () => {
    try {
      setError(null);
      setSuccessMessage('');
      updateUserData(profileData); 
      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '', apellido: user.apellido || '', correo: user.correo || '',
        telefono: user.telefono || '', direccion: user.direccion || '', comuna: user.comuna || '',
        region: user.region || '', rut: user.rut || '', urlFotoCloud: user.urlFotoCloud || ''
      });
    }
    setIsEditing(false);
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
          <ProfileCard 
            profileData={profileData} fotoError={fotoError} setFotoError={setFotoError}
            fileInputRef={fileInputRef} handlePhotoSelect={handlePhotoSelect}
            uploadingPhoto={uploadingPhoto} isEditing={isEditing} setIsEditing={setIsEditing}
          />
        </div>
        <div className="col-md-8">
          <ProfileDetails 
            isEditing={isEditing} profileData={profileData} setProfileData={setProfileData}
            error={error} setError={setError} successMessage={successMessage} setSuccessMessage={setSuccessMessage}
            handleSave={handleSave} handleCancel={handleCancel} toggleModal={toggleModal}
          />
        </div>
      </div>
      <ProfileModals modals={modals} toggleModal={toggleModal} />
    </div>
  );
};