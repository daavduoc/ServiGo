import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { authValidations } from '../../../utils/authValidations';
import {
  registrarUsuario,
  subirCertificacionesRegistro,
  subirFotoRegistro,
} from '../../../serviceFront/authService';
import '../../../assets/css/registro-cliente.css';
import '../../../assets/css/registro-prestador.css';

const REGIONES = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
];

const ESPECIALIDADES_POR_TIPO = {
  tecnico: ['Gasfitería', 'Electricista'],
  profesional: ['Kinesiología', 'Psicología', 'Profesor Particular'],
};

const GIROS = [
  'Servicios técnicos',
  'Construcción',
  'Salud y bienestar',
  'Educación',
  'Comercio',
  'Otro',
];

const TIPO_REGISTRO = [
  {
    value: 'particular',
    title: 'Prestador a domicilio',
    subtitle: 'Persona Natural',
    icon: 'bi-person',
  },
  {
    value: 'empresa',
    title: 'Prestador establecido',
    subtitle: 'Empresa o Local',
    icon: 'bi-building',
  },
];

const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="form-label">
    {children}
    {required && <span className="text-danger"> *</span>}
  </label>
);

const PasswordField = ({ id, name, value, onChange, label, required }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-3">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="registro-prestador-password-wrap">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          className="form-control"
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={name === 'contrasena' ? 'new-password' : 'off'}
        />
        <button
          type="button"
          className="registro-prestador-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

const TipoRegistroCard = ({ option, selected, onSelect }) => (
  <div className="col-md-6">
    <button
      type="button"
      className={`registro-type-card${selected ? ' is-selected' : ''}`}
      onClick={() => onSelect(option.value)}
      aria-pressed={selected}
    >
      <span className="registro-type-card__check" aria-hidden="true">
        {selected && <i className="bi bi-check-lg" />}
      </span>
      <i className={`bi ${option.icon} registro-type-card__icon`} aria-hidden="true" />
      <span className="registro-type-card__title">{option.title}</span>
      <span className="registro-type-card__sub">{option.subtitle}</span>
    </button>
  </div>
);

export const ProviderRegisterView = () => {
  const navigate = useNavigate();
  const certInputRef = useRef(null);

  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    nombreFantasia: '',
    giro: '',
    correo: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    tipoPrestador: 'particular',
    tipoServicio: 'tecnico',
    especialidad: '',
    fechaNacimiento: '',
    latitud: '',
    longitud: '',
    fotoPerfil: null,
  });

  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [certificaciones, setCertificaciones] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const esEmpresa = formData.tipoPrestador === 'empresa';

  const handleChange = (e) => {
    let { name, value } = e.target;
    // No convertir región: el <select> usa valores con tildes/capitalización fija (ej. Metropolitana).
    const camposMayusculas = ['comuna', 'direccion'];
    if (camposMayusculas.includes(name)) value = value.toUpperCase();
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleTipoPrestador = (value) => {
    setFormData((prev) => ({
      ...prev,
      tipoPrestador: value,
      apellido: value === 'empresa' ? '' : prev.apellido,
    }));
    if (error) setError(null);
  };

  const handleTipoServicio = (value) => {
    setFormData((prev) => ({
      ...prev,
      tipoServicio: value,
      especialidad: '',
    }));
  };

  const handleCertChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setCertificaciones(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasena !== confirmContrasena) {
      return setError('Las contraseñas no coinciden.');
    }

    const payloadValidacion = {
      ...formData,
      apellido: esEmpresa ? formData.nombre || 'Empresa' : formData.apellido,
    };
    const errorValidacion = authValidations(payloadValidacion);
    if (errorValidacion) return setError(errorValidacion);

    if (!esEmpresa && !formData.fechaNacimiento) {
      return setError('La fecha de nacimiento es obligatoria.');
    }

    if (esEmpresa && !formData.giro) {
      return setError('Selecciona el giro comercial de la empresa.');
    }

    if (!esEmpresa && !formData.especialidad) {
      return setError('Selecciona tu especialidad.');
    }

    setIsLoading(true);
    setError(null);

    try {
      setLoadingMessage('Creando tu cuenta...');

      const dataParaBackend = {
        rut: formData.rut,
        nombre: formData.nombre,
        apellido: esEmpresa ? '' : formData.apellido,
        correo: formData.correo,
        contrasena: formData.contrasena,
        telefono: formData.telefono,
        fechaNacimiento: esEmpresa ? null : formData.fechaNacimiento,
        direccion: formData.direccion,
        comuna: formData.comuna,
        region: formData.region,
        tipoPrestador: formData.tipoPrestador,
        latitud: formData.latitud ? Number(formData.latitud) : null,
        longitud: formData.longitud ? Number(formData.longitud) : null,
        tipoUsuario: 'PRESTADOR',
        idCategoria: formData.tipoServicio === 'profesional' ? 2 : 1,
        direccionLocal: formData.direccion,
        especialidad: formData.especialidad,
        ...(esEmpresa && {
          razonSocial: formData.nombre,
          nombreFantasia: formData.nombreFantasia,
          giroComercial: formData.giro,
          rutEmpresa: formData.rut,
        }),
      };

      const registroResponse = await registrarUsuario(dataParaBackend);

      const subidas = [];

      if (formData.fotoPerfil && registroResponse?.idUsuario) {
        setLoadingMessage('Subiendo foto de perfil...');
        subidas.push(subirFotoRegistro(registroResponse.idUsuario, formData.fotoPerfil));
      }

      if (certificaciones.length > 0 && registroResponse?.idPrestador) {
        setLoadingMessage('Subiendo documentación...');
        subidas.push(
          subirCertificacionesRegistro(registroResponse.idPrestador, certificaciones)
        );
      }

      if (subidas.length > 0) {
        await Promise.all(subidas);
      }

      navigate('/registro/prestador/confirmacion', {
        state: {
          correo: (registroResponse?.correo || formData.correo).trim().toLowerCase(),
          tipoPrestador: formData.tipoPrestador,
        },
      });
    } catch (err) {
      setError(err.message || 'Error al registrar en el servidor');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const direccionParaMapa = `${formData.direccion}, ${formData.comuna}, ${formData.region}, Chile`;
  const direccionVisible = direccionParaMapa
    .replace(/,\s*,/g, ',')
    .replace(/^,\s*/, '')
    .replace(/,\s*Chile$/, '')
    .trim();

  const nombrePreview = formData.nombre.trim() || 'Nombre de tu Empresa';

  return (
    <CardContainer maxwidth="1320px" className="registro-cliente-card-wrap">
      <form onSubmit={handleSubmit} className="registro-cliente-form registro-prestador-form">
        <Link
          to="/unete-especialista"
          className="d-inline-flex align-items-center gap-1 text-success fw-semibold text-decoration-none mb-3 small"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Volver a información para especialistas
        </Link>

        <header className="registro-cliente-page-header">
          <h1>
            <i className="bi bi-briefcase-fill" aria-hidden="true" />
            Crear cuenta de prestador
          </h1>
          <p>
            {esEmpresa
              ? 'Completa la información de tu empresa o local para ofrecer servicios en ServiGo.'
              : 'Completa tu información para ofrecer servicios en ServiGo.'}
          </p>
        </header>

        <p className="registro-prestador-section-label mb-2">¿Cómo deseas registrarte?</p>
        <div className="row g-3 registro-prestador-type-cards">
          {TIPO_REGISTRO.map((opt) => (
            <TipoRegistroCard
              key={opt.value}
              option={opt}
              selected={formData.tipoPrestador === opt.value}
              onSelect={handleTipoPrestador}
            />
          ))}
        </div>

        <div className="row g-4 g-xl-5">
          <div className="col-lg-7">
            {esEmpresa ? (
              <>
                <h5 className="registro-section-title">Información de la Empresa</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Label htmlFor="rut" required>
                      RUT de la empresa
                    </Label>
                    <input
                      id="rut"
                      name="rut"
                      className="form-control"
                      value={formData.rut}
                      onChange={handleChange}
                      placeholder="Ej: 76.123.456-7"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="nombre" required>
                      Razón social
                    </Label>
                    <input
                      id="nombre"
                      name="nombre"
                      className="form-control"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="nombreFantasia">Nombre de fantasía (Opcional)</Label>
                    <input
                      id="nombreFantasia"
                      name="nombreFantasia"
                      className="form-control"
                      value={formData.nombreFantasia}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="giro" required>
                      Giro comercial
                    </Label>
                    <select
                      id="giro"
                      name="giro"
                      className="form-select"
                      value={formData.giro}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un giro</option>
                      {GIROS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="correo" required>
                      Correo electrónico empresarial
                    </Label>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      className="form-control"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="telefono" required>
                      Teléfono empresarial
                    </Label>
                    <div className="input-group">
                      <span className="input-group-text">+56 9</span>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        className="form-control"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="1234 5678"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <PasswordField
                      id="contrasena-emp"
                      name="contrasena"
                      label="Contraseña"
                      value={formData.contrasena}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <PasswordField
                      id="confirm-emp"
                      name="confirmContrasena"
                      label="Confirmar contraseña"
                      value={confirmContrasena}
                      onChange={(e) => setConfirmContrasena(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="registro-prestador-hint-box registro-prestador-hint-box--yellow mt-3">
                  <i className="bi bi-clock" aria-hidden="true" />
                  <span>
                    La información será revisada por un administrador antes de activar tu perfil público.
                  </span>
                </div>

                <h5 className="registro-section-title mt-4">Documentación empresarial (Opcional)</h5>
                <div className="row g-3 align-items-start">
                  <div className="col-md-7">
                    <input
                      ref={certInputRef}
                      type="file"
                      className="d-none"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={handleCertChange}
                    />
                    <div
                      className="registro-cert-dropzone"
                      role="button"
                      tabIndex={0}
                      onClick={() => certInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          certInputRef.current?.click();
                        }
                      }}
                    >
                      <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
                      <p className="fw-semibold mb-1">Arrastra tus documentos aquí</p>
                      <small>PDF, JPG o PNG · Máx. 5MB por archivo</small>
                      {certificaciones.length > 0 && (
                        <small className="d-block mt-2 text-success">
                          {certificaciones.length} archivo(s) seleccionado(s)
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="registro-prestador-hint-box registro-prestador-hint-box--blue mb-0 h-100">
                      <i className="bi bi-info-circle" aria-hidden="true" />
                      <span>
                        Ejemplos: patente comercial, inicio de actividades, certificado vigencia, etc.
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h5 className="registro-section-title">Información Personal</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Label htmlFor="rut" required>
                      RUT
                    </Label>
                    <input
                      id="rut"
                      name="rut"
                      className="form-control"
                      value={formData.rut}
                      onChange={handleChange}
                      placeholder="Ej: 12.345.678-9"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="fechaNacimiento" required>
                      Fecha de nacimiento
                    </Label>
                    <input
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      type="date"
                      className="form-control"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="nombre" required>
                      Nombres
                    </Label>
                    <input
                      id="nombre"
                      name="nombre"
                      className="form-control"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="apellido" required>
                      Apellidos
                    </Label>
                    <input
                      id="apellido"
                      name="apellido"
                      className="form-control"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="correo" required>
                      Correo electrónico
                    </Label>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      className="form-control"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="telefono" required>
                      Teléfono
                    </Label>
                    <div className="input-group">
                      <span className="input-group-text">+56 9</span>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        className="form-control"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <PasswordField
                      id="contrasena"
                      name="contrasena"
                      label="Contraseña"
                      value={formData.contrasena}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <PasswordField
                      id="confirm"
                      name="confirmContrasena"
                      label="Confirmar contraseña"
                      value={confirmContrasena}
                      onChange={(e) => setConfirmContrasena(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <h5 className="registro-section-title mt-4">¿Qué tipo de servicio ofreces?</h5>
                <div className="registro-servicio-cards">
                  <button
                    type="button"
                    className={`registro-servicio-card${formData.tipoServicio === 'tecnico' ? ' is-selected' : ''}`}
                    onClick={() => handleTipoServicio('tecnico')}
                    aria-pressed={formData.tipoServicio === 'tecnico'}
                  >
                    <i className="bi bi-wrench" aria-hidden="true" />
                    <span>Técnico</span>
                  </button>
                  <button
                    type="button"
                    className={`registro-servicio-card${formData.tipoServicio === 'profesional' ? ' is-selected' : ''}`}
                    onClick={() => handleTipoServicio('profesional')}
                    aria-pressed={formData.tipoServicio === 'profesional'}
                  >
                    <i className="bi bi-person-workspace" aria-hidden="true" />
                    <span>Profesional</span>
                  </button>
                </div>

                <Label htmlFor="especialidad" required>
                  Especialidad
                </Label>
                <select
                  id="especialidad"
                  name="especialidad"
                  className="form-select mb-3"
                  value={formData.especialidad}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona tu especialidad</option>
                  {(ESPECIALIDADES_POR_TIPO[formData.tipoServicio] || []).map((esp) => (
                    <option key={esp} value={esp}>
                      {esp}
                    </option>
                  ))}
                </select>

                <div className="registro-prestador-hint-box registro-prestador-hint-box--green">
                  <i className="bi bi-tools" aria-hidden="true" />
                  <span>
                    <strong>Técnicos:</strong> Gasfitería, Electricista.
                  </span>
                </div>
                <div className="registro-prestador-hint-box registro-prestador-hint-box--blue">
                  <i className="bi bi-mortarboard" aria-hidden="true" />
                  <span>
                    <strong>Profesionales:</strong> Kinesiología, Psicología, Profesor Particular.
                  </span>
                </div>

                <h5 className="registro-section-title mt-4">Documentación obligatoria</h5>
                <input
                  ref={certInputRef}
                  type="file"
                  className="d-none"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleCertChange}
                />
                <div
                  className="registro-cert-dropzone"
                  role="button"
                  tabIndex={0}
                  onClick={() => certInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      certInputRef.current?.click();
                    }
                  }}
                >
                  <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
                  <p className="fw-semibold mb-1">Arrastra tus certificados aquí</p>
                  <small>PDF, JPG o PNG · Máx. 5MB por archivo</small>
                  {certificaciones.length > 0 && (
                    <small className="d-block mt-2 text-success">
                      {certificaciones.length} archivo(s) seleccionado(s)
                    </small>
                  )}
                </div>
              </>
            )}

            <h5 className="registro-section-title mt-4">
              {esEmpresa ? 'Dirección del local o sede principal' : 'Dirección'}
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <Label htmlFor="region" required>
                  Región
                </Label>
                <select
                  id="region"
                  name="region"
                  className="form-select"
                  value={formData.region}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona región</option>
                  {REGIONES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <Label htmlFor="comuna" required>
                  Comuna
                </Label>
                <input
                  id="comuna"
                  name="comuna"
                  className="form-control"
                  value={formData.comuna}
                  onChange={handleChange}
                  placeholder="Ej: PROVIDENCIA"
                  required
                />
              </div>
              <div className="col-12">
                <Label htmlFor="direccion" required>
                  Dirección / Calle
                </Label>
                <input
                  id="direccion"
                  name="direccion"
                  className="form-control"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle, número, depto."
                  required
                />
              </div>
            </div>

            <h5 className="registro-section-title mt-4">Verificación de geolocalización</h5>
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
                  placeholder="Busca tu dirección o mueve el marcador en el mapa"
                  aria-label="Dirección para ubicación en mapa"
                />
              </div>
            </div>
            <div className="registro-cliente-hint registro-cliente-hint--success mb-0">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
              <span>
                Ubica el marcador donde atiendes o desde donde operas tus servicios.
              </span>
            </div>
          </div>

          <div className="col-lg-5 registro-cliente-col-right">
            <PhotoUpload
              label={esEmpresa ? 'Logo de la empresa' : 'Foto de perfil'}
              variant={esEmpresa ? 'empresa' : 'person'}
              onImageSelect={(file) => setFormData((p) => ({ ...p, fotoPerfil: file }))}
              dropzoneTitle={esEmpresa ? 'Sube el logo de tu empresa' : 'Sube tu foto de perfil'}
            />

            {esEmpresa && (
              <div className="registro-empresa-preview">
                <p className="registro-empresa-preview__label mb-0">Vista previa</p>
                <div className="registro-empresa-preview__body mt-2">
                  <div className="registro-empresa-preview__icon" aria-hidden="true">
                    <i className="bi bi-building" />
                  </div>
                  <div>
                    <p className="registro-empresa-preview__name">{nombrePreview}</p>
                    <span className="badge badge-pendiente rounded-pill">Pendiente</span>
                  </div>
                </div>
              </div>
            )}

            <MapSection
              label="Ubicación en el mapa"
              fullAddress={direccionParaMapa}
              onCoordsChange={(coords) =>
                setFormData((prev) => ({ ...prev, latitud: coords.lat, longitud: coords.lng }))
              }
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

        {isLoading && loadingMessage && (
          <p className="text-center text-success small fw-semibold mb-2" role="status">
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
            {loadingMessage}
          </p>
        )}

        <FormActions
          onCancel={() => window.history.back()}
          submitLabel={isLoading ? loadingMessage || 'Procesando...' : 'Finalizar registro'}
          submitDisabled={isLoading}
        />

        <p className="registro-cliente-footer-note">
          <i className="bi bi-shield-lock" aria-hidden="true" />
          Tus datos están protegidos y se usan solo para mejorar tu experiencia en ServiGo.
        </p>
      </form>
    </CardContainer>
  );
};
