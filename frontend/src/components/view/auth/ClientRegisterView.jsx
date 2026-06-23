import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';
import { authValidations } from '../../../utils/authValidations';
import { registrarUsuario, registrarUsuarioConFoto } from '../../../serviceFront/authService';
import { BiometricCaptureModal } from '../../camera/BiometricCaptureModal';
import '../../../assets/css/registro-cliente.css';

// Vista de registro de cliente
export const ClientRegisterView = () => {
  const navigate = useNavigate();
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
    tipoUsuario: 'CLIENTE',
    fechaNacimiento: '',
    idRol: 1,
    latitud: '',
    longitud: '',
    fotoPerfil: null,
  });

  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fotoBiometrica, setFotoBiometrica] = useState(null);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricRejected, setBiometricRejected] = useState(false);

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

    if (!fotoBiometrica) {
      return setError('Debes tomar tu foto biométrica antes de continuar.');
    }

    if (formData.contrasena !== confirmContrasena) {
      return setError('Las contraseñas no coinciden.');
    }

    const errorValidacion = authValidations({ ...formData, tipoUsuario: 'CLIENTE' });
    if (errorValidacion) return setError(errorValidacion);

    setIsLoading(true);
    setError(null);

    try {
      const dataParaBackend = {
        rut: formData.rut,
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        contrasena: formData.contrasena,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento || null,
        direccion: formData.direccion,
        comuna: formData.comuna,
        region: formData.region,
        latitud: formData.latitud ? Number(formData.latitud) : null,
        longitud: formData.longitud ? Number(formData.longitud) : null,
        tipoUsuario: 'CLIENTE',
        fotoBiometrica,
      };

      let registroResponse;
      if (formData.fotoPerfil) {
        registroResponse = await registrarUsuarioConFoto(dataParaBackend, formData.fotoPerfil);
      } else {
        registroResponse = await registrarUsuario(dataParaBackend);
      }

      navigate('/verificar-correo', {
        state: {
          correo: (registroResponse?.correo || formData.correo).trim().toLowerCase(),
          tipoUsuario: 'CLIENTE',
        },
      });
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

  return (
    <CardContainer maxwidth="1320px" className="registro-cliente-card-wrap">
      <form onSubmit={handleSubmit} className="registro-cliente-form">
        <header className="registro-cliente-page-header">
          <h1>
            <i className="bi bi-person-plus-fill" aria-hidden="true" />
            Crear cuenta de cliente
          </h1>
          <p>Completa tu información para comenzar a contratar servicios.</p>
        </header>

        <div className="row g-4 g-xl-5">
          

          {/* Columna izquierda del formulario */}
          <div className="col-lg-7">
            
            {/* Seccion datos personales y seccion direccion, todo esta empaquetado en SeccionUsuarioBase */}
            <SeccionUsuarioBase
              handleChange={handleChange}
              formData={formData}
              layout="client"
              showConfirmPassword
              confirmContrasena={confirmContrasena}
              onConfirmPasswordChange={handleConfirmPasswordChange}
            />

            {/* // seccion geolocalización */}
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
                  placeholder="Tu dirección aparecerá aquí en el mapa de forma automática"
                  aria-label="Dirección para ubicación en mapa"
                />
              </div>
            </div>
            <div className="registro-cliente-hint registro-cliente-hint--success mb-4">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
              <span>
                Asegúrate de que el marcador esté en la ubicación exacta donde recibirás los servicios.
              </span>
            </div>

            {/* // sección foto biometrica (Aquí está la cámara) */}
            <h5 className="registro-section-title">Foto Biométrica</h5>
            <div className="card shadow-sm rounded-4 border-0 mb-4 p-4">
              <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                <div>
                  <p className="text-uppercase small text-secondary fw-semibold mb-2">Foto biométrica obligatoria</p>
                  <p className="mb-0 small text-muted">
                    Esta foto se usará únicamente para validar tu identidad en el futuro. No es la misma que tu foto de perfil y nadie más la verá.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setIsBiometricModalOpen(true);
                      setBiometricRejected(false);
                      if (error) setError(null);
                    }}
                    style={{ minWidth: '120px' }}
                  >
                    {fotoBiometrica ? 'Repetir foto' : 'Tomar foto'}
                  </button>
                </div>
              </div>
              {fotoBiometrica ? (
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={fotoBiometrica}
                    alt="Foto biométrica tomada"
                    className="rounded-4 shadow-sm"
                    style={{ width: '110px', height: '110px', objectFit: 'cover', transform: 'scaleX(-1)' }}
                  />
                  <div>
                    <p className="mb-1 fw-semibold">Foto biométrica lista</p>
                    <p className="mb-0 small text-success">Puedes continuar con el registro.</p>
                  </div>
                </div>
              ) : (
                <p className="mb-0 small text-muted">
                  Presiona "Tomar foto" y sigue las instrucciones en la cámara.
                </p>
              )}
              {biometricRejected && (
                <div className="alert alert-warning mt-3 mb-0" role="alert">
                  Si rechazas la foto no podrás registrarte.
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha, foto perfil, mapa interactivo                           */}

          <div className="col-lg-5 registro-cliente-col-right">
            
            {/* // seccion foto de perfil */}
            <PhotoUpload label="Foto de Perfil" onImageSelect={handleImageChange} />

            {/* seccion mapa interactivo (Parte de la sección dirección) */}
            <MapSection
              label="Ubicación en el mapa"
              fullAddress={direccionParaMapa}
              onCoordsChange={handleMapCoords}
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
          onCancel={() => window.history.back()}
          submitLabel={isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          submitDisabled={isLoading}
        />

        <p className="registro-cliente-footer-note">
          <i className="bi bi-lock-fill" aria-hidden="true" />
          Tus datos están protegidos y se usan solo para mejorar tu experiencia en ServiGo.
        </p>

        <BiometricCaptureModal
          isOpen={isBiometricModalOpen}
          onClose={() => setIsBiometricModalOpen(false)}
          onConfirm={(foto) => {
            setFotoBiometrica(foto);
            setIsBiometricModalOpen(false);
            if (error) setError(null);
          }}
          onReject={() => {
            setBiometricRejected(true);
            setFotoBiometrica(null);
            setIsBiometricModalOpen(false);
            if (error) setError(null);
          }}
        />
      </form>
    </CardContainer>
  );
};
