import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Servicios para interactuar con el backend Spring Boot
import { getMyProfile, updateUserProfile, uploadProfilePhoto } from '../../serviceFront/userService'; 

import { CardContainer } from '../ui/CardContainer'; 
import { ButtonCustom } from '../ui/ButtonCustom';
import { PhotoUpload } from '../ui/PhotoUpload';

export const ProviderProfileView = () => {
  // Extrae 'user' y agregamos 'updateUserData' para mantener el mismo sistema global
  const { user, updateUserData } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contrasena: '',
    region: '',
    comuna: '',
    direccion: '',
    tipoPrestador: 'particular',
    fotoPerfil: null
  });

  const [fotoPreviewUrl, setFotoPreviewUrl] = useState(null);

  useEffect(() => {
    const cargarPerfilDesdeServidor = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const datosServidor = await getMyProfile();
        console.log("Datos completos devueltos por Spring Boot:", datosServidor);

        if (datosServidor) {
          setUserId(datosServidor.id);
          
          setFormData({
            rut: datosServidor.rut || '',
            nombre: datosServidor.nombre || '',
            apellido: datosServidor.apellido || '',
            correo: datosServidor.correo || '',
            telefono: datosServidor.telefono || '',
            contrasena: '', 
            region: datosServidor.region || '',
            comuna: datosServidor.comuna || '',
            direccion: datosServidor.direccionLocal || datosServidor.direccion || '',
            tipoPrestador: (datosServidor.tipoPrestador || 'particular').toLowerCase(),
            fotoPerfil: null
          });

          // Lógica inteligente para detectar la URL de la foto de perfil desde múltiples posibles campos, con prioridad a los datos del servidor
          const urlFoto = datosServidor.fotoPerfil || 
                          datosServidor.fotoUrl || 
                          datosServidor.imagen || 
                          user?.fotoPerfil || 
                          user?.fotoUrl;
                          
          if (urlFoto) {
            console.log("🎯 Imagen detectada y asignada al preview:", urlFoto);
            setFotoPreviewUrl(urlFoto);
          }
        }
      } catch (err) {
        console.error("Error al sincronizar con getMyProfile:", err);
        setError("No se pudieron recuperar los datos completos del registro. Verifica tu servidor backend.");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfilDesdeServidor();
  }, [user]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (['region', 'comuna', 'direccion'].includes(name)) value = value.toUpperCase();
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const esEmpresa = formData.tipoPrestador === 'empresa';
      let fotoUrlSubida = fotoPreviewUrl; // estado inicial para mantener la foto actual si no se selecciona una nueva
      if (formData.fotoPerfil) {
        const resultadoFoto = await uploadProfilePhoto(userId, formData.fotoPerfil);
        console.log("Respuesta de Cloudinary:", resultadoFoto);
        
        fotoUrlSubida = resultadoFoto?.secure_url || resultadoFoto?.url;
        
        if (fotoUrlSubida) {
          setFotoPreviewUrl(fotoUrlSubida);
        }
      }
      
      // 2. Preparar el Payload para Spring Boot
      const payloadActualizacion = {
        rut: formData.rut,
        nombre: formData.nombre,
        apellido: esEmpresa ? '' : formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono,
        region: formData.region,
        comuna: formData.comuna,
        direccionLocal: formData.direccion, 
        tipoPrestador: formData.tipoPrestador.toUpperCase(),
        tipoUsuario: 'PRESTADOR',
        fotoPerfil: fotoUrlSubida // Guardamos la URL final en la base de datos
      };

      if (formData.contrasena && formData.contrasena.trim() !== '') {
        payloadActualizacion.contrasena = formData.contrasena;
      }

      // 3. Enviamos los cambios al servidor backend
      await updateUserProfile(userId, payloadActualizacion);

      // 4. sincronización con el mismo sistema de AuthContext:
      // actualiza el Navbar, Sidebar y LocalStorage de inmediato sin recargar la página.
      if (typeof updateUserData === 'function') {
        updateUserData({
          ...user,
          ...payloadActualizacion,
          fotoUrl: fotoUrlSubida // Actualiza la URL de la foto en toda la aplicación
        });
      }

      setSuccessMessage("¡Perfil e imagen actualizados con éxito en ServiGo!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      setError(err.message || "Ocurrió un error al intentar actualizar el perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="text-muted mt-2">Buscando tu expediente en el servidor...</p>
      </div>
    );
  }

  const esEmpresa = formData.tipoPrestador === 'empresa';

  return (
    <CardContainer maxwidth="1000px">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-person-vcard-fill text-success me-2"></i>
            {isEditing ? 'Modificar mis Datos' : 'Mi Cuenta de Prestador'}
          </h2>
          <p className="text-muted mb-0 small">
            {isEditing ? 'Edita los campos habilitados de tu cuenta.' : 'Información oficial extraída del registro de ServiGo.'}
          </p>
        </div>
        
        {!isEditing && (
          <div style={{ width: '200px' }}>
            <ButtonCustom 
              texto="Modificar mis Datos" 
              color="success" 
              onClick={() => setIsEditing(true)} 
            />
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger text-center fw-bold shadow-sm">{error}</div>}
      {successMessage && <div className="alert alert-success text-center fw-bold shadow-sm"><i className="bi bi-check-circle-fill me-2"></i>{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          
          <div className="col-md-4 text-center border-end pe-md-4">
            {/* 🎯 LA CLAVE DEL ÉXITO: Usamos 'key' vinculada a la URL de la foto. 
                Cuando la API responda, React destruirá y recreará este componente con la imagen real. */}
            <PhotoUpload
              key={fotoPreviewUrl || 'sin-foto-perfil'}
              label={esEmpresa ? 'Logo Corporativo' : 'Fotografía de Perfil'}
              onImageSelect={(archivo) => setFormData(p => ({ ...p, fotoPerfil: archivo }))}
              dropzoneTitle="Haga clic o arrastre para cambiar imagen"
              initialPreview={fotoPreviewUrl} 
              disabled={!isEditing}
            />
            <div className="mt-3">
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 text-capitalize fw-bold rounded-pill">
                Persona {esEmpresa ? 'Jurídica (Empresa)' : 'Natural'}
              </span>
            </div>
          </div>

          <div className="col-md-8 ps-md-4">
            <h5 className="text-success fw-bold mb-3 text-uppercase tracking-wider">
              <i className="bi bi-shield-lock me-2"></i>Credenciales e Identidad
            </h5>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label text-muted small fw-bold text-uppercase">RUT / Cédula Identidad</label>
                <input 
                  type="text" 
                  className="form-control bg-light fw-bold text-secondary" 
                  value={formData.rut || 'No registrado'} 
                  disabled 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold text-uppercase">
                  {esEmpresa ? 'Razón Social / Empresa' : 'Nombres'}
                </label>
                <input 
                  type="text" 
                  name="nombre"
                  className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold' : ''}`} 
                  value={formData.nombre} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                  required 
                />
              </div>

              {!esEmpresa && (
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold text-uppercase">Apellidos</label>
                  <input 
                    type="text" 
                    name="apellido"
                    className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold' : ''}`} 
                    value={formData.apellido} 
                    onChange={handleChange}
                    disabled={!isEditing} 
                    required 
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold text-uppercase">Email Registrado</label>
                <input 
                  type="email" 
                  name="correo"
                  className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold' : ''}`} 
                  value={formData.correo} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                  required 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold text-uppercase">Teléfono Móvil</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted fw-bold">+56 9</span>
                  <input 
                    type="text" 
                    name="telefono"
                    className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold' : ''}`} 
                    value={formData.telefono} 
                    onChange={handleChange}
                    disabled={!isEditing} 
                    placeholder="Ej: 12345678"
                    required
                  />
                </div>
              </div>

              {isEditing && (
                <div className="col-12">
                  <label className="form-label text-muted small fw-bold text-uppercase">Cambiar Contraseña (Opcional)</label>
                  <input 
                    type="password" 
                    name="contrasena"
                    className="form-control" 
                    value={formData.contrasena} 
                    onChange={handleChange}
                    placeholder="Escribe la nueva contraseña de seguridad"
                  />
                </div>
              )}
            </div>

            <h5 className="text-success fw-bold mb-3 mt-4 text-uppercase tracking-wider">
              <i className="bi bi-geo-alt me-2"></i>Ubicación de Contacto
            </h5>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold text-uppercase">Región</label>
                <input 
                  type="text" 
                  name="region"
                  className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold' : ''}`} 
                  value={formData.region} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold text-uppercase">Comuna</label>
                <input 
                  type="text" 
                  name="comuna"
                  className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold' : ''}`} 
                  value={formData.comuna} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label text-muted small fw-bold text-uppercase">Dirección</label>
                <input 
                  type="text" 
                  name="direccion"
                  className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold' : ''}`} 
                  value={formData.direccion} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                  required
                />
              </div>
            </div>

          </div>
        </div>

        {isEditing && (
          <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
            <div style={{ width: '160px' }}>
              <ButtonCustom 
                texto="Cancelar" 
                color="outline-secondary" 
                onClick={() => setIsEditing(false)} 
                disabled={isSaving}
              />
            </div>
            <div style={{ width: '250px' }}>
              <button 
                type="submit" 
                className="btn btn-success w-100 fw-bold py-2 rounded-3 shadow-sm"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sincronizando...
                  </>
                ) : 'Confirmar y Guardar Cambios'}
              </button>
            </div>
          </div>
        )}
      </form>
    </CardContainer>
  );
};