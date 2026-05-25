import React, { useEffect, useState } from 'react';
import { useAuth }      from '../../../context/AuthContext';
import { CardContainer } from '../../ui/CardContainer';

// Inicio seccion de importaciones de secciones
import { PerfilCabecera }   from '../../../components/sections/provider-perfil/PerfilCabecera';
import { PerfilFormulario } from '../../../components/sections/provider-perfil/PerfilFormulario';
// Fin seccion de importaciones de secciones

// importacion para conectarse con el backend
import {
  getMyProfile,
  updateUserProfile,
  uploadProfilePhoto,
} from '../../../serviceFront/userService';
// fin de importacion para conectarse con el backend

import '../../../assets/css/provider-views.css';

// invoca losd atos del perfil del prestador y llos datos de formulario, asegurando que no haya campos undefined
const mapPerfilToForm = (datos) => ({
  rut:          datos.rut           || '',
  nombre:       datos.nombre        || '',
  apellido:     datos.apellido      || '',
  correo:       datos.correo        || '',
  telefono:     datos.telefono      || '',
  region:       datos.region        || '',
  comuna:       datos.comuna        || '',
  direccion:    datos.direccionLocal || datos.direccion || '',
  tipoPrestador:(datos.tipoPrestador || 'particular').toLowerCase(),
});

export const ProviderPerfilPage = () => {
  const { user, updateUserData } = useAuth();

  // Inicio seccion de estado del perfil
  const [isEditing,      setIsEditing]      = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [isSaving,       setIsSaving]       = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error,          setError]          = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userId,         setUserId]         = useState(user?.idUsuario ?? null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState(user?.urlFotoCloud ?? null);
  const [formData,       setFormData]       = useState({
    rut: '', nombre: '', apellido: '', correo: '',
    telefono: '', region: '', comuna: '', direccion: '', tipoPrestador: 'particular',
  });
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  // Fin seccion de estado del perfil

  // inicio conaeción con el backend para cargar los datos del perfil del prestador autenticado

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

    if (user?.idUsuario) cargarPerfil();
    else setLoading(false);
    // dependencia para recargar el perfil si cambia el usuario autenticado (ej: después de editar datos o subir foto, se actualiza el contexto de autenticación y así se recarga el perfil con los nuevos datos)
  }, [user?.idUsuario]);

  // upload de foto a Cloudinary vía backend
  const handlePhotoSelect = async (archivo) => {
    if (!archivo || !userId) return;
    setUploadingPhoto(true);
    setError(null);
    const vistaPreviaLocal = URL.createObjectURL(archivo);
    setFotoPreviewUrl(vistaPreviaLocal);

    try {
      const resultado = await uploadProfilePhoto(userId, archivo);
      const nuevaUrl  = resultado?.urlFotoCloud || vistaPreviaLocal;
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

  // conexión con el backend para actualizar los datos del perfil del prestador autenticado
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    setError(null);

    try {
      const esEmpresa = formData.tipoPrestador === 'empresa';
      const payload   = {
        rut:       formData.rut,
        nombre:    formData.nombre,
        apellido:  esEmpresa ? '' : formData.apellido,
        correo:    formData.correo,
        telefono:  formData.telefono,
        region:    formData.region,
        comuna:    formData.comuna,
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
  // fin de conexión con el backend para actualizar los datos del perfil del prestador autenticado

  const handleCancelEdit = () => {
    if (savedSnapshot) setFormData(savedSnapshot);
    setIsEditing(false);
    setError(null);
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

      {/* Inicio seccion de encavezado */}
      <PerfilCabecera
        isEditing={isEditing}
        onStartEdit={() => setIsEditing(true)}
      />
      {/* Fin seccion de encavezado */}

      {/* Inicio seccion de mensajes de estado */}
      {error          && <div className="alert alert-danger  text-center fw-bold shadow-sm">{error}</div>}
      {successMessage && <div className="alert alert-success text-center fw-bold shadow-sm">{successMessage}</div>}
      {/* Fin seccion de mensajes de estado */}

      {/* Inicio seccion de formulario de perfil */}
      <form onSubmit={handleSubmit}>
        <PerfilFormulario
          formData={formData}
          setFormData={setFormData}
          fotoPreviewUrl={fotoPreviewUrl}
          esEmpresa={esEmpresa}
          isEditing={isEditing}
          isSaving={isSaving}
          uploadingPhoto={uploadingPhoto}
          onPhotoSelect={handlePhotoSelect}
          onCancel={handleCancelEdit}
        />
      </form>
      {/* Fin seccion de formulario de perfil */}

    </CardContainer>
  );
};
