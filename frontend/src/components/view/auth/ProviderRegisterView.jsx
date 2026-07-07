import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Inicio seccion de importaciones de UI compartida
import { CardContainer, FormActions } from '../../ui';
import { authValidations }           from '../../../utils/authValidations';
// Fin seccion de importaciones de UI compartida

// Inicio seccion de importaciones de módulos del formulario
import { EmpresaFormSection }    from './EmpresaFormSection';
import { ParticularFormSection } from './ParticularFormSection';
import { TipoRegistroCard }      from './TipoRegistroCard';
import { TIPO_REGISTRO }         from './formConstants';
// Fin seccion de importaciones de módulos del formulario

// Inicio seccion de importaciones de secciones de registro
import { DireccionSection }      from '../../../components/sections/provider-registro/DireccionSection';
import { GeolocalizacionSection } from '../../../components/sections/provider-registro/GeolocalizacionSection';
import { ColDerechaRegistro }    from '../../../components/sections/provider-registro/ColDerechaRegistro';
// Fin seccion de importaciones de secciones de registro

// importaciones para  Coneccion con el backend para registro
import {
  registrarUsuario,
  subirCertificacionesRegistro,
  subirFotoBiometricaRegistro,
  subirFotoRegistro,
} from '../../../serviceFront/authService';
import { BiometricCaptureModal } from '../../camera/BiometricCaptureModal';
// fin de las importacones para las conecciones con el backendS para registro

import '../../../assets/css/registro-prestador.css';

// Estado inicial del formulario
const FORM_INICIAL = {
  rut: '', nombre: '', apellido: '', nombreFantasia: '', giro: '',
  correo: '', contrasena: '', telefono: '', direccion: '', comuna: '',
  region: '', tipoPrestador: 'particular', tipoServicio: 'tecnico',
  especialidad: '', fechaNacimiento: '', latitud: '', longitud: '', fotoPerfil: null,
};

export const ProviderRegisterView = () => {
  const navigate = useNavigate();

  // Inicio seccion de estado del formulario
  const [formData, setFormData]                     = useState(FORM_INICIAL);
  const [confirmContrasena, setConfirmContrasena]   = useState('');
  const [certificaciones, setCertificaciones]       = useState([]);
  const [fotoBiometrica, setFotoBiometrica]         = useState(null);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [error, setError]                           = useState(null);
  const [biometricRejected, setBiometricRejected]   = useState(false);
  const [isLoading, setIsLoading]                   = useState(false);
  const [loadingMessage, setLoadingMessage]         = useState('');
  // Fin seccion de estado del formulario

  const esEmpresa = formData.tipoPrestador === 'empresa';

  // Inicio seccion de handlers generales
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (['comuna', 'direccion'].includes(name)) value = value.toUpperCase();
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
    setFormData((prev) => ({ ...prev, tipoServicio: value, especialidad: '' }));
  };
  // Fin seccion de handlers generales

  // inicio coneccion con el backend para registro
  const handleSubmit = async (e) => {
    e.preventDefault();

    // La foto biométrica solo es obligatoria para prestadores particulares, no para empresas
    if (!esEmpresa && !fotoBiometrica)
      return setError('Debes tomar tu foto biométrica antes de continuar.');

    if (formData.contrasena !== confirmContrasena)
      return setError('Las contraseñas no coinciden.');

    const payloadValidacion = {
      ...formData,
      apellido: esEmpresa ? formData.nombre || 'Empresa' : formData.apellido,
    };
    const errorValidacion = authValidations(payloadValidacion);
    if (errorValidacion) return setError(errorValidacion);

    if (!esEmpresa && !formData.fechaNacimiento)
      return setError('La fecha de nacimiento es obligatoria.');
    if (esEmpresa && !formData.giro)
      return setError('Selecciona el giro comercial de la empresa.');
    if (!esEmpresa && !formData.especialidad)
      return setError('Selecciona tu especialidad.');

    setIsLoading(true);
    setError(null);

    try {
      setLoadingMessage('Creando tu cuenta...');

      // FIX: Ya no se envía fotoBiometrica aquí para evitar que se guarde como foto de perfil
      const dataParaBackend = {
        rut:            formData.rut,
        nombre:         formData.nombre,
        apellido:       esEmpresa ? '' : formData.apellido,
        correo:         formData.correo,
        contrasena:     formData.contrasena,
        telefono:       formData.telefono,
        fechaNacimiento:esEmpresa ? null : formData.fechaNacimiento,
        direccion:      formData.direccion,
        comuna:         formData.comuna,
        region:         formData.region,
        tipoPrestador:  formData.tipoPrestador,
        latitud:        formData.latitud  ? Number(formData.latitud)  : null,
        longitud:       formData.longitud ? Number(formData.longitud) : null,
        tipoUsuario:    'PRESTADOR',
        idCategoria:    formData.tipoServicio === 'profesional' ? 2 : 1,
        direccionLocal: formData.direccion,
        especialidad:   formData.especialidad,
        ...(esEmpresa && {
          razonSocial:    formData.nombre,
          nombreFantasia: formData.nombreFantasia,
          giroComercial:  formData.giro,
          rutEmpresa:     formData.rut,
        }),
      };

      const registroResponse = await registrarUsuario(dataParaBackend);

      const subidas = [];

      if (!esEmpresa && fotoBiometrica && registroResponse?.idUsuario) {
        setLoadingMessage('Guardando foto biométrica...');
        subidas.push(subirFotoBiometricaRegistro(registroResponse.idUsuario, fotoBiometrica));
      }

      // este codigo es para subir la foto de perfil si se seleccionó una
      if (formData.fotoPerfil && registroResponse?.idUsuario) {
        setLoadingMessage('Subiendo foto de perfil...');
        subidas.push(subirFotoRegistro(registroResponse.idUsuario, formData.fotoPerfil));
      }

      // este codigo es para subir las certificaciones si se seleccionaron archivos
      if (certificaciones.length > 0 && registroResponse?.idPrestador) {
        setLoadingMessage('Subiendo documentación...');
        subidas.push(subirCertificacionesRegistro(registroResponse.idPrestador, certificaciones));
      }

      if (subidas.length > 0) await Promise.all(subidas);

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
  // fin coneccion con el backend para registro

  // Inicio seccion para el mapa y dirección
  const direccionParaMapa = `${formData.direccion}, ${formData.comuna}, ${formData.region}, Chile`;
  const direccionVisible  = direccionParaMapa
    .replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*Chile$/, '').trim();
  const nombrePreview = formData.nombre.trim() || 'Nombre de tu Empresa';
  // fin seccion para el mapa y dirección

  return (
    <CardContainer maxwidth="1320px" className="registro-cliente-card-wrap">
      <form onSubmit={handleSubmit} className="registro-cliente-form registro-prestador-form">

        {/* Inicio seccion de enlace de retorno */}
        <Link
          to="/unete-especialista"
          className="d-inline-flex align-items-center gap-1 text-success fw-semibold text-decoration-none mb-3 small"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" /> Volver a información para especialistas
        </Link>
        {/* Fin seccion de enlace de retorno */}

        {/* Inicio seccion de encabezado */}
        <header className="registro-cliente-page-header">
          <h1>
            <i className="bi bi-briefcase-fill" aria-hidden="true" /> Crear cuenta de prestador
          </h1>
          <p>
            {esEmpresa
              ? 'Completa la información de tu empresa o local para ofrecer servicios en ServiGo.'
              : 'Completa tu información para ofrecer servicios en ServiGo.'}
          </p>
        </header>
        {/* Fin seccion de encabezado */}

        {/* Inicio seccion de selección de tipo de prestador */}
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
        {/* Fin seccion de selección de tipo de prestador */}

        <div className="row g-4 g-xl-5">
          <div className="col-lg-7">

            {/* Inicio seccion de formulario principal (empresa o particular) */}
            {esEmpresa ? (
              <EmpresaFormSection
                formData={formData}
                handleChange={handleChange}
                confirmContrasena={confirmContrasena}
                setConfirmContrasena={setConfirmContrasena}
                certificaciones={certificaciones}
                onCertFilesChange={setCertificaciones}
              />
            ) : (
              <ParticularFormSection
                formData={formData}
                handleChange={handleChange}
                handleTipoServicio={handleTipoServicio}
                confirmContrasena={confirmContrasena}
                setConfirmContrasena={setConfirmContrasena}
                certificaciones={certificaciones}
                onCertFilesChange={setCertificaciones}
              />
            )}
            {/* Fin seccion de formulario principal */}

            {/* Inicio seccion de dirección */}
            <DireccionSection
              formData={formData}
              handleChange={handleChange}
              esEmpresa={esEmpresa}
            />
            {/* Fin seccion de dirección */}

            {/* Inicio seccion de geolocalización */}
            <GeolocalizacionSection direccionVisible={direccionVisible} />
            {/* Fin seccion de geolocalización */}

          </div>

          {/* Inicio seccion de columna derecha */}
          <ColDerechaRegistro
            esEmpresa={esEmpresa}
            nombrePreview={nombrePreview}
            direccionParaMapa={direccionParaMapa}
            onFotoSelect={(file) => setFormData((p) => ({ ...p, fotoPerfil: file }))}
            onCoordsChange={(coords) =>
              setFormData((prev) => ({ ...prev, latitud: coords.lat, longitud: coords.lng }))
            }
            fotoBiometrica={fotoBiometrica}
            onOpenBiometricModal={() => {
              setIsBiometricModalOpen(true);
              setBiometricRejected(false);
              if (error) setError(null);
            }}
            biometricRejected={biometricRejected}
          />
          {/* Fin seccion de columna derecha */}
        </div>

        {/* Inicio seccion de mensajes y acciones */}
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
        {/* Fin seccion de mensajes y acciones */}

        {/* Solo mostrar el modal de cámara biométrica si NO es empresa */}
        {!esEmpresa && (
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
        )}

      </form>
    </CardContainer>
  );
};