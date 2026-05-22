import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, uploadProfilePhoto } from '../../serviceFront/userService';

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
    urlFotoCloud: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [fotoError, setFotoError] = useState(false);

  // --- NUEVOS ESTADOS PARA LOS MODALES ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getMyProfile();
        const fotoUrl = data.urlFotoCloud || '';
        setFotoError(false);
        setProfileData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          correo: data.correo || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          comuna: data.comuna || '',
          region: data.region || '',
          rut: data.rut || '',
          urlFotoCloud: fotoUrl,
        });
        updateUserData({
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          telefono: data.telefono,
          direccion: data.direccion,
          comuna: data.comuna,
          region: data.region,
          rut: data.rut,
          urlFotoCloud: fotoUrl,
        });
      } catch (err) {
        setError('Error al cargar el perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (isAuthenticated && token) {
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
      setProfileData((prev) => ({ ...prev, urlFotoCloud: nuevaUrl }));
      updateUserData({ urlFotoCloud: nuevaUrl });
      setSuccessMessage('Foto de perfil actualizada');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'No se pudo subir la foto');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccessMessage('');
      
      // Cuando el backend esté listo, descomenta y usa updateUserProfile:
      // await updateUserProfile(user.idUsuario, profileData);
      
      // Por ahora actualiza el contexto localmente
      updateUserData(profileData);
      
      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al actualizar el perfil');
      console.error(err);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        comuna: user.comuna || '',
        region: user.region || '',
        rut: user.rut || '',
        urlFotoCloud: user.urlFotoCloud || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mt-5 mb-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 position-relative">
      <div className="row">
        {/* Lado Izquierdo: Foto y Datos Rápidos */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <div
              className="rounded-circle overflow-hidden d-inline-flex justify-content-center align-items-center mb-3 mx-auto bg-secondary bg-opacity-25"
              style={{ width: '150px', height: '150px' }}
            >
              {profileData.urlFotoCloud && !fotoError ? (
                <img
                  src={profileData.urlFotoCloud}
                  alt={`Foto de ${profileData.nombre}`}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={() => setFotoError(true)}
                />
              ) : (
                <i
                  className="bi bi-person-circle profile-avatar-placeholder"
                  aria-label="Sin foto"
                />
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
                  <i className="bi bi-camera me-1" aria-hidden="true" />
                  Cambiar foto
                </>
              )}
            </button>
            <h3 className="fw-semibold mb-0">{profileData.nombre} {profileData.apellido}</h3>
            <p className="text-muted mb-2">{profileData.correo}</p>
            <p className="text-muted small">RUT: {profileData.rut}</p>
            
            <hr />
            
            <div className="text-start">
              <p className="mb-2"><strong>Teléfono:</strong> {profileData.telefono || 'No especificado'}</p>
              <p className="mb-2"><strong>Dirección:</strong> {profileData.direccion || 'No especificada'}</p>
              <p className="mb-2"><strong>Comuna:</strong> {profileData.comuna || 'No especificada'}</p>
              <p className="mb-0"><strong>Región:</strong> {profileData.region || 'No especificada'}</p>
            </div>

            <hr />

            {!isEditing && (
              <button 
                className="btn btn-success w-100 shadow-sm text-white fw-medium"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil-square me-1" aria-hidden="true" />
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Lado Derecho: Formulario de Edición */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="mb-4 profile-panel-title">
              {isEditing ? (
                <>
                  <i className="bi bi-pencil-square" aria-hidden="true" />
                  Actualizar mis Datos
                </>
              ) : (
                <>
                  <i className="bi bi-person-vcard" aria-hidden="true" />
                  Mis Datos Personales
                </>
              )}
            </h4>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError(null)}></button>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {successMessage}
                <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
              </div>
            )}

            {isEditing ? (
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="nombre"
                      value={profileData.nombre}
                      onChange={handleInputChange}
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
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Correo</label>
                    <input 
                      type="email" 
                      className="form-control"
                      name="correo"
                      value={profileData.correo}
                      disabled
                    />
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
                  <button 
                    type="button"
                    className="btn btn-success flex-grow-1 fw-bold"
                    onClick={handleSave}
                  >
                    <i className="bi bi-check-lg me-1" aria-hidden="true" />
                    Guardar Cambios
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary flex-grow-1 fw-bold"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-x-lg me-1" aria-hidden="true" />
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="text-muted mb-2">Nombre Completo</h5>
                    <p className="fs-5 fw-bold">{profileData.nombre} {profileData.apellido}</p>
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
                    Haz clic en <strong>&quot;Editar Perfil&quot;</strong> para actualizar tu información de
                    contacto y dirección.
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
                onClick={() => setShowPasswordModal(true)}
                className="list-group-item list-group-item-action profile-settings-item"
              >
                <i className="bi bi-lock profile-settings-item__icon" aria-hidden="true" />
                <span className="profile-settings-item__label">Cambiar Contraseña</span>
                <i className="bi bi-chevron-right profile-settings-item__chevron" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setShowNotifModal(true)}
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
                onClick={() => setShowDeleteModal(true)}
                className="list-group-item list-group-item-action profile-settings-item profile-settings-item--danger text-danger fw-medium"
              >
                <i className="bi bi-trash profile-settings-item__icon" aria-hidden="true" />
                <span className="profile-settings-item__label">Eliminar Cuenta</span>
                <i className="bi bi-chevron-right profile-settings-item__chevron" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          MODALES (VENTANAS EMERGENTES) 
          ========================================================== */}

      {/* MODAL: CAMBIAR CONTRASEÑA */}
      {showPasswordModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-lock text-success" aria-hidden="true" />
                  Cambiar Contraseña
                </h5>
                <button onClick={() => setShowPasswordModal(false)} className="btn-close"></button>
              </div>
              <div className="modal-body py-4">
                <label className="form-label small fw-bold text-muted">Contraseña Actual</label>
                <input type="password" placeholder="Ingresa tu contraseña actual" className="form-control mb-3 rounded-pill px-3 py-2" />
                
                <label className="form-label small fw-bold text-muted">Nueva Contraseña</label>
                <input type="password" placeholder="Ingresa la nueva contraseña" className="form-control mb-3 rounded-pill px-3 py-2" />
                
                <label className="form-label small fw-bold text-muted">Confirmar Nueva Contraseña</label>
                <input type="password" placeholder="Repite la nueva contraseña" className="form-control rounded-pill px-3 py-2" />
              </div>
              <div className="modal-footer border-0 pt-0">
                <button onClick={() => setShowPasswordModal(false)} className="btn btn-light rounded-pill px-4 fw-medium">Cancelar</button>
                <button onClick={() => setShowPasswordModal(false)} className="btn btn-success rounded-pill px-4 fw-bold">Actualizar Clave</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREFERENCIAS NOTIFICACIONES */}
      {showNotifModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-bell text-success" aria-hidden="true" />
                  Mis Notificaciones
                </h5>
                <button onClick={() => setShowNotifModal(false)} className="btn-close"></button>
              </div>
              <div className="modal-body py-4">
                <p className="text-muted small mb-4">Elige cómo quieres que ServiGo se comunique contigo.</p>
                <div className="form-check form-switch mb-3 d-flex align-items-center gap-2">
                  <input className="form-check-input fs-5 mt-0" type="checkbox" defaultChecked />
                  <label className="form-check-label fw-medium">Notificaciones por Correo Electrónico</label>
                </div>
                <div className="form-check form-switch d-flex align-items-center gap-2">
                  <input className="form-check-input fs-5 mt-0" type="checkbox" />
                  <label className="form-check-label fw-medium">Alertas SMS a mi teléfono</label>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button onClick={() => setShowNotifModal(false)} className="btn btn-success rounded-pill w-100 fw-bold py-2">Guardar Preferencias</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ELIMINAR CUENTA */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <button onClick={() => setShowDeleteModal(false)} className="btn-close"></button>
              </div>
              <div className="modal-body text-center p-4 pt-0">
                <i
                  className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"
                  aria-hidden="true"
                />
                <h4 className="fw-bold text-danger mb-3">Zona de Peligro</h4>
                <h6 className="fw-bold text-dark">¿Estás segura de eliminar tu cuenta?</h6>
                <p className="text-muted small mt-2">
                  Esta acción es permanente y borrará todo tu historial de servicios, reservas y mensajes en ServiGo.
                </p>
              </div>
              <div className="modal-footer border-0 justify-content-center bg-light rounded-bottom-4">
                <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary rounded-pill px-4 fw-medium">Me arrepentí</button>
                <button onClick={() => setShowDeleteModal(false)} className="btn btn-danger rounded-pill px-4 fw-bold">Sí, Eliminar Todo</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};