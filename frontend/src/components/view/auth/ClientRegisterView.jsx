import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContainer, FormActions, MapSection, PhotoUpload } from '../../ui';
import { SeccionUsuarioBase } from '../../sections/SeccionUsuarioBase';
import { authValidations } from '../../../utils/authValidations';
import { registrarUsuario, registrarUsuarioConFoto } from '../../../serviceFront/authService';
import '../../../assets/css/registro-cliente.css';

// Limpia y formatea la dirección en pantalla  
const limpiarDireccionFormato = (dir, com, reg) => {
  return `${dir || ''}, ${com || ''}, ${reg || ''}`
    .replace(/,\s*,/g, ',')
    .replace(/^,\s*|,\s*$/g, '')
    .trim();
};

export const ClientRegisterView = () => {
  const navigate = useNavigate();
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
    idRol: 1, 
    latitud: '', 
    longitud: '', 
    fotoPerfil: null,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (['region', 'comuna', 'direccion'].includes(name)) value = value.toUpperCase();
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleMapCoords = ({ lat, lng }) => {
    setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contrasena !== confirmContrasena) return setError('Las contraseñas no coinciden.');

    const errorValidacion = authValidations(formData);
    if (errorValidacion) return setError(errorValidacion);

    setIsLoading(true);
    setError(null);

    try {
      const dataParaBackend = {
        ...formData,
        latitud: formData.latitud ? Number(formData.latitud) : null,
        longitud: formData.longitud ? Number(formData.longitud) : null,
        tipoUsuario: 'CLIENTE',
      };
      delete dataParaBackend.fotoPerfil; // Se remueve para evitar duplicados

      if (formData.fotoPerfil) {
        await registrarUsuarioConFoto(dataParaBackend, formData.fotoPerfil);
      } else {
        await registrarUsuario(dataParaBackend);
      }

      navigate('/verificar-correo', { state: { correo: formData.correo } });
    } catch (err) {
      setError(err.message || 'Error al registrar en el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const direccionParaMapa = `${formData.direccion}, ${formData.comuna}, ${formData.region}, Chile`;

  return (
    <CardContainer maxwidth="1320px" className="registro-cliente-card-wrap">
      <form onSubmit={handleSubmit} className="registro-cliente-form">
        
        <header className="registro-cliente-page-header">
          <h1><i className="bi bi-person-plus-fill" aria-hidden="true" /> Crear cuenta de cliente</h1>
          <p>Completa tu información para comenzar a contratar servicios.</p>
        </header>

        <div className="row g-4 g-xl-5">
          <div className="col-lg-7">
            <SeccionUsuarioBase
              handleChange={handleChange}
              formData={formData}
              layout="client"
              showConfirmPassword
              confirmContrasena={confirmContrasena}
              onConfirmPasswordChange={(e) => { setConfirmContrasena(e.target.value); if (error) setError(null); }}
            />

            <h5 className="registro-section-title">Verificación de geolocalización</h5>
            <div className="registro-cliente-geo-search mb-2">
              <div className="input-group registro-cliente-input-lg">
                <span className="input-group-text bg-white"><i className="bi bi-search text-muted" aria-hidden="true" /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  value={limpiarDireccionFormato(formData.direccion, formData.comuna, formData.region)} 
                  readOnly 
                  placeholder="Busca tu dirección o arrastra el marcador en el mapa" 
                />
              </div>
            </div>
            <div className="registro-cliente-hint registro-cliente-hint--success mb-0">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
              <span> Asegúrate de que el marcador esté en la ubicación exacta donde recibirás los servicios.</span>
            </div>
          </div>

          <div className="col-lg-5 registro-cliente-col-right">
            <PhotoUpload label="Foto de Perfil" onImageSelect={(archivo) => setFormData(p => ({ ...p, fotoPerfil: archivo }))} />
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

        {error && <div className="alert alert-danger mt-4 text-center fw-bold mb-0" role="alert">{error}</div>}

        <FormActions
          onCancel={() => window.history.back()}
          submitLabel={isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          submitDisabled={isLoading}
        />

        <p className="registro-cliente-footer-note">
          <i className="bi bi-lock-fill" aria-hidden="true" /> Tus datos están protegidos y se usan solo para mejorar tu experiencia en ServiGo.
        </p>
      </form>
    </CardContainer>
  );
};