import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateUserProfile, uploadProfilePhoto } from '../../serviceFront/userService';
import { CardContainer } from '../ui/CardContainer';
import { ButtonCustom } from '../ui/ButtonCustom';
import { ProviderNavTabs } from '../ui/ProviderNavTabs';

// importamos los componentes modularizados
import { ProfileCard } from '../profile/ProfileCard';
import { ProfileDetails } from '../profile/ProfileDetails';

export const ProviderProfileView = () => {
  const { user, updateUserData } = useAuth();
  
  // estados de la interfaz y mensajes
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // datos del usuario (lo que lee la bd)
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

  // carga inicial de datos
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const datos = await getMyProfile();

        if (datos) {
          setUserId(datos.idUsuario);
          setFormData({
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

          const urlFoto = datos.urlFotoCloud || user?.urlFotoCloud || null;
          setFotoPreviewUrl(urlFoto);
          updateUserData({ ...datos, urlFotoCloud: urlFoto });
        }
      } catch (err) {
        setError(err.message || 'no se pudieron recuperar los datos del perfil.');
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, [user?.idUsuario, user?.urlFotoCloud]);

  // manejador de texto del formulario
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  // manejador de foto (subida inmediata)
  const handlePhotoSelect = async (archivo) => {
    if (!archivo || !userId) return;
    setUploadingPhoto(true);
    const vistaPreviaLocal = URL.createObjectURL(archivo);
    setFotoPreviewUrl(vistaPreviaLocal);

    try {
      const resultadoFoto = await uploadProfilePhoto(userId, archivo);
      const nuevaUrl = resultadoFoto?.urlFotoCloud || vistaPreviaLocal;
      setFotoPreviewUrl(nuevaUrl);
      updateUserData({ urlFotoCloud: nuevaUrl });
      
      setSuccessMessage('fotografía actualizada con éxito.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('error al subir la imagen. inténtalo nuevamente.');
      setFotoPreviewUrl(user?.urlFotoCloud || null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // manejador de guardado
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
      setSuccessMessage('datos actualizados con éxito.');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'ocurrió un error al actualizar los datos.');
    } finally {
      setIsSaving(false);
    }
  };

  // pantalla de carga
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status" />
        <p className="text-muted mt-2">cargando perfil...</p>
      </div>
    );
  }

  // control de tipo de usuario
  const esEmpresa = formData.tipoPrestador === 'empresa';

  // renderizado principal
  return (
    <CardContainer maxwidth="1000px">
      
      {/* cabecera y tabs */}
      <div className="d-flex justify-content-between align-items-start align-items-md-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-person-vcard-fill text-success me-2" />
            {isEditing ? 'modificar mis datos' : 'mi cuenta de prestador'}
          </h2>
        </div>
        <ProviderNavTabs active="perfil" />
      </div>

      {/* boton activar edicion (version a prueba de fallos) */}
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
            <i className="bi bi-pencil-square me-2"></i>modificar mis datos
          </button>
        </div>
      )}

      {/* alertas de mensaje */}
      {error && <div className="alert alert-danger text-center fw-bold shadow-sm">{error}</div>}
      {successMessage && <div className="alert alert-success text-center fw-bold shadow-sm">{successMessage}</div>}

      {/* formulario de datos */}
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          
          {/* modulo de foto */}
          <div className="col-md-4">
            <ProfileCard 
              fotoPreviewUrl={fotoPreviewUrl}
              esEmpresa={esEmpresa}
              uploadingPhoto={uploadingPhoto}
              isEditing={isEditing}
              onPhotoSelect={handlePhotoSelect}
            />
          </div>

          {/* modulo de detalles de texto */}
          <div className="col-md-8">
            <ProfileDetails 
              formData={formData}
              handleChange={handleChange}
              isEditing={isEditing}
              esEmpresa={esEmpresa}
            />
          </div>

        </div>

        {/* botones de confirmacion y cancelacion */}
        {isEditing && (
          <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
            <ButtonCustom 
              texto="cancelar" 
              color="outline-secondary" 
              onClick={() => setIsEditing(false)} 
              disabled={isSaving || uploadingPhoto} 
            />
            <button type="submit" className="btn btn-success fw-bold px-4" disabled={isSaving || uploadingPhoto}>
              {isSaving ? 'guardando...' : 'confirmar y guardar'}
            </button>
          </div>
        )}
      </form>
    </CardContainer>
  );
};