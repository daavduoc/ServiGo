import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateUserProfile } from '../../serviceFront/userService';

export const ProfileView = () => {
  const { user, updateUserData } = useAuth();
  
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    rut: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cuando el backend esté listo, descomenta esta línea:
        // const data = await getMyProfile();
        // setProfileData(data);
        
        // Por ahora usamos los datos del contexto
        if (user) {
          setProfileData({
            nombre: user.nombre || '',
            apellido: user.apellido || '',
            correo: user.correo || '',
            telefono: user.telefono || '',
            direccion: user.direccion || '',
            comuna: user.comuna || '',
            region: user.region || '',
            rut: user.rut || ''
          });
        }
      } catch (err) {
        setError('Error al cargar el perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

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
    // Revertir cambios
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        comuna: user.comuna || '',
        region: user.region || '',
        rut: user.rut || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mt-5 mb-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Lado Izquierdo: Foto y Datos Rápidos */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <div className="bg-secondary bg-opacity-25 rounded-circle d-inline-flex justify-content-center align-items-center mb-3 mx-auto" style={{ width: '150px', height: '150px' }}>
              <span style={{ fontSize: '5rem' }}>👤</span>
            </div>
            <h3 className="fw-bold">{profileData.nombre} {profileData.apellido}</h3>
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
                className="btn btn-primary w-100"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Lado Derecho: Formulario de Edición */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-4">
              {isEditing ? '✏️ Actualizar mis Datos' : '📋 Mis Datos Personales'}
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
              // Formulario en modo edición
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
                      onChange={handleInputChange}
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
                    className="btn btn-success flex-grow-1"
                    onClick={handleSave}
                  >
                    💾 Guardar Cambios
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary flex-grow-1"
                    onClick={handleCancel}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            ) : (
              // Vista de solo lectura
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

                <div className="bg-light p-4 rounded-3 border-start border-primary border-4">
                  <p className="text-muted mb-0">
                    💡 Haz clic en <strong>"Editar Perfil"</strong> para actualizar tu información de contacto y dirección.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sección adicional: Información de la cuenta */}
          <div className="card shadow-sm border-0 p-4 mt-4">
            <h5 className="fw-bold mb-3">⚙️ Configuración de Cuenta</h5>
            <div className="list-group list-group-flush">
              <button className="list-group-item list-group-item-action text-start">
                🔑 Cambiar Contraseña
              </button>
              <button className="list-group-item list-group-item-action text-start">
                🔔 Preferencias de Notificaciones
              </button>
              <button className="list-group-item list-group-item-action text-start">
                📸 Cambiar Foto de Perfil
              </button>
              <button className="list-group-item list-group-item-action text-danger">
                🗑️ Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};