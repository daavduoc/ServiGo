import React, { useState } from 'react';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';
import { authValidations } from '../../../utils/authValidations';
import { registrarUsuario, registrarUsuarioConFoto } from '../../../serviceFront/authService';
import '../../../assets/css/registro-cliente.css';

export const ProviderRegisterView = () => {
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    tipoPrestador: 'particular',
    latitud: '',
    longitud: '',
    fotoPerfil: null,
  });

  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    const camposMayusculas = ['region', 'comuna', 'direccion'];
    if (camposMayusculas.includes(name)) value = value.toUpperCase();

    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmContrasena(e.target.value);
    if (error) setError(null);
  };

  const handleImageChange = (archivo) => {
    setFormData((prev) => ({ ...prev, fotoPerfil: archivo }));
  };

  const handleMapCoords = (coords) => {
    setFormData((prev) => ({ ...prev, latitud: coords.lat, longitud: coords.lng }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasena !== confirmContrasena) {
      return setError('Las contraseñas no coinciden.');
    }

    const errorValidacion = authValidations(formData);
    if (errorValidacion) return setError(errorValidacion);

    setIsLoading(true);
    setError(null);

    try {
      const dataParaBackend = {
        rut: formData.rut,
        nombre: formData.nombre,
        apellido: formData.tipoPrestador === 'empresa' ? '' : formData.apellido,
        correo: formData.correo,
        contrasena: formData.contrasena,
        telefono: formData.telefono,
        direccion: formData.direccion,
        comuna: formData.comuna,
        region: formData.region,
        tipoPrestador: formData.tipoPrestador.toUpperCase(),
        latitud: formData.latitud ? Number(formData.latitud) : null,
        longitud: formData.longitud ? Number(formData.longitud) : null,
        tipoUsuario: 'PRESTADOR',
        idCategoria: formData.tipoPrestador === 'empresa' ? 2 : 1,
        idEmpresa: null,
        direccionLocal: formData.direccion,
      };

      if (formData.fotoPerfil) {
        await registrarUsuarioConFoto(dataParaBackend, formData.fotoPerfil);
      } else {
        await registrarUsuario(dataParaBackend);
      }

      alert('¡Registro de prestador exitoso!');
      window.location.href = '/login';
    } catch (err) {
      setError(err.message || 'Error al registrar en el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const direccionParaMapa = `${formData.direccion}, ${formData.comuna}, ${formData.region}, Chile`;
  const direccionVisible = direccionParaMapa
    .replace(/,\s*,/g, ',')
    .replace(/^,\s*/, '')
    .replace(/,\s*Chile$/, '')
    .trim();

  const esEmpresa = formData.tipoPrestador === 'empresa';
  const fotoLabel = esEmpresa ? 'Logo de la empresa' : 'Foto de perfil';

  return (
    <CardContainer maxwidth="1320px" className="registro-cliente-card-wrap">
      <form onSubmit={handleSubmit} className="registro-cliente-form registro-prestador-form">
        <header className="registro-cliente-page-header">
          <h1>
            <i className="bi bi-briefcase-fill" aria-hidden="true" />
            Crear cuenta de prestador
          </h1>
          <p>Completa tu información para ofrecer servicios en ServiGo.</p>
        </header>

        <div className="registro-prestador-type-box mb-4 p-3 border rounded-3">
          <label className="form-label fw-bold mb-2">¿Cómo deseas registrarte?</label>
          <select
            className="form-select registro-cliente-input-lg"
            name="tipoPrestador"
            value={formData.tipoPrestador}
            onChange={handleChange}
          >
            <option value="particular">Persona Natural (Particular)</option>
            <option value="empresa">Persona Jurídica (Empresa)</option>
          </select>
          <small className="text-muted d-block mt-2">
            Los campos del formulario se adaptan según tu selección.
          </small>
        </div>

        <div className="row g-4 g-xl-5">
          <div className="col-lg-7">
            <SeccionUsuarioBase
              handleChange={handleChange}
              formData={formData}
              layout="client"
              showConfirmPassword
              confirmContrasena={confirmContrasena}
              onConfirmPasswordChange={handleConfirmPasswordChange}
            />

            <h5 className="registro-section-title">Verificación de geolocalización</h5>
            <div className="registro-cliente-geo-search mb-2">
              <div className="input-group registro-cliente-input-lg">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted" aria-hidden="true" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={direccionVisible}
                  readOnly
                  placeholder="Completa tu dirección o arrastra el marcador en el mapa"
                  aria-label="Dirección para ubicación en mapa"
                />
              </div>
            </div>
            <div className="registro-cliente-hint registro-cliente-hint--provider mb-0">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
              <span>
                Ubica el marcador donde atiendes o desde donde operas tus servicios.
              </span>
            </div>
          </div>

          <div className="col-lg-5 registro-cliente-col-right">
            <PhotoUpload
              label={fotoLabel}
              onImageSelect={handleImageChange}
              variant="dropzone"
              dropzoneTitle={esEmpresa ? 'Sube el logo de tu empresa' : 'Sube tu foto de perfil'}
            />

            <MapSection
              label="Ubicación en el mapa"
              fullAddress={direccionParaMapa}
              onCoordsChange={handleMapCoords}
              displayMode="map-only"
              mapHint="Puedes mover el marcador para ajustar tu ubicación exacta."
              mapClassName="map-section-map"
              allowMarkerDrag
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mt-4 text-center fw-bold mb-0" role="alert">
            {error}
          </div>
        )}

        <FormActions
          variant="client"
          onCancel={() => window.history.back()}
          submitLabel={isLoading ? 'Creando cuenta...' : 'Finalizar registro'}
          submitDisabled={isLoading}
        />

        <p className="registro-cliente-footer-note">
          <i className="bi bi-lock-fill" aria-hidden="true" />
          Tus datos están protegidos y se usan solo para mejorar tu experiencia en ServiGo.
        </p>
      </form>
    </CardContainer>
  );
};
