import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateUserProfile, uploadProfilePhoto } from '../../serviceFront/userService';
import { CardContainer } from '../ui/CardContainer';
import { ButtonCustom } from '../ui/ButtonCustom';
import { PhotoUpload } from '../ui/PhotoUpload';
import { ProviderNavTabs } from '../ui/ProviderNavTabs';

export const ProviderProfileView = () => {
  const { user, updateUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    fotoPerfil: null,
  });

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        setError(null);
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
            fotoPerfil: null,
          });

          const urlFoto =
            datos.urlFotoCloud ||
            user?.urlFotoCloud ||
            null;
          setFotoPreviewUrl(urlFoto);
        }
      } catch (err) {
        console.warn('Perfil del prestador no cargado:', err.message);
        if (user?.urlFotoCloud) {
          setFotoPreviewUrl(user.urlFotoCloud);
        }
        setError(err.message || 'No se pudieron recuperar los datos del perfil.');
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [user?.idUsuario, user?.urlFotoCloud]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let fotoUrl = fotoPreviewUrl;

      if (formData.fotoPerfil) {
        const resultadoFoto = await uploadProfilePhoto(userId, formData.fotoPerfil);
        fotoUrl = resultadoFoto?.urlFotoCloud || fotoUrl;
        if (fotoUrl) setFotoPreviewUrl(fotoUrl);
      }

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

      updateUserData({
        nombre: payload.nombre,
        apellido: payload.apellido,
        correo: payload.correo,
        telefono: payload.telefono,
        region: payload.region,
        comuna: payload.comuna,
        urlFotoCloud: fotoUrl,
      });

      setSuccessMessage('Perfil actualizado con éxito.');
      setIsEditing(false);
    } catch (err) {
      console.error('Error al guardar perfil:', err);
      setError(err.message || 'Ocurrió un error al actualizar el perfil.');
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
            <i className="bi bi-person-vcard-fill text-success me-2" aria-hidden="true" />
            {isEditing ? 'Modificar mis Datos' : 'Mi Cuenta de Prestador'}
          </h2>
          <p className="text-muted mb-0 small">
            {isEditing
              ? 'Edita los campos habilitados de tu cuenta.'
              : 'Información oficial de tu registro en ServiGo.'}
          </p>
        </div>
        <ProviderNavTabs active="perfil" />
      </div>

      {!isEditing && (
        <div className="text-end mb-3">
          <ButtonCustom texto="Modificar mis Datos" color="success" onClick={() => setIsEditing(true)} />
        </div>
      )}

      {error && <div className="alert alert-danger text-center fw-bold shadow-sm">{error}</div>}
      {successMessage && (
        <div className="alert alert-success text-center fw-bold shadow-sm">
          <i className="bi bi-check-circle-fill me-2" aria-hidden="true" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-md-4 text-center border-end pe-md-4">
            <PhotoUpload
              key={fotoPreviewUrl || 'sin-foto-perfil'}
              label={esEmpresa ? 'Logo Corporativo' : 'Fotografía de Perfil'}
              variant={esEmpresa ? 'empresa' : 'person'}
              onImageSelect={(archivo) => setFormData((p) => ({ ...p, fotoPerfil: archivo }))}
              dropzoneTitle={
                fotoPreviewUrl
                  ? 'Haga clic o arrastre para cambiar imagen'
                  : 'Haga clic o arrastre para subir imagen'
              }
              initialPreview={fotoPreviewUrl}
              disabled={!isEditing}
            />
            <div className="mt-3">
              <span className="badge bg-success text-white px-3 py-2 text-capitalize fw-bold rounded-pill">
                Persona {esEmpresa ? 'Jurídica (Empresa)' : 'Natural'}
              </span>
            </div>
          </div>

          <div className="col-md-8 ps-md-4">
            <h5 className="text-success fw-bold mb-3 text-uppercase">Credenciales e Identidad</h5>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label text-muted small fw-bold text-uppercase">RUT</label>
                <input type="text" className="form-control bg-light fw-bold text-secondary" value={formData.rut || 'No registrado'} disabled />
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
                <label className="form-label text-muted small fw-bold text-uppercase">Email</label>
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
                <label className="form-label text-muted small fw-bold text-uppercase">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  className={`form-control ${!isEditing ? 'bg-light text-secondary fw-semibold' : ''}`}
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <h5 className="text-success fw-bold mb-3 mt-4 text-uppercase">Ubicación</h5>
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
            <ButtonCustom texto="Cancelar" color="outline-secondary" onClick={() => setIsEditing(false)} disabled={isSaving} />
            <button type="submit" className="btn btn-success fw-bold px-4" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Confirmar y Guardar'}
            </button>
          </div>
        )}
      </form>
    </CardContainer>
  );
};
