// vista del prestador de servicio donde genera sus servicios
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CardContainer } from '../ui/CardContainer';
import { crearNuevoServicio, subirFotoVerificacionServicio } from '../../serviceFront/servicioService';

// Importaciones de los nuevos componentes modulares
import { InfoGeneralSection } from '../sections/ingresar-servicio/InfoGeneralSection';
import { AgendaSection } from '../sections/ingresar-servicio/AgendaSection';
import { UbicacionSection } from '../sections/ingresar-servicio/UbicacionSection';
import { VerificacionSection } from '../sections/ingresar-servicio/VerificacionSection';

export const ProviderIngresarServicioView = () => {
  const { user } = useAuth();

  // Estados de control del formulario
  const [nombre, setNombre] = useState('');
  const [area, setArea] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [modalidad, setModalidad] = useState('Domicilio');
  const [coordenadas, setCoordenadas] = useState({ lat: -33.4489, lng: -70.6693 });
  const [agenda, setAgenda] = useState([{ fecha: '', hora: '', error: '' }]);
  const [fotoCapturada, setFotoCapturada] = useState(null);

  // Estados de control de UI
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleClear = () => {
    setNombre('');
    setArea('');
    setDescripcion('');
    setPrecio('');
    setModalidad('Domicilio');
    setAgenda([{ fecha: '', hora: '', error: '' }]);
    setFotoCapturada(null);
    setMensajeExito('');
    setMensajeError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeExito('');
    setMensajeError('');

    if (!nombre.trim() || !area.trim() || !descripcion.trim() || !precio) {
      setMensajeError('Por favor, rellene todos los campos de información básica.');
      return;
    }

    const tieneErroresFechas = agenda.some(slot => slot.error !== '' || !slot.fecha || !slot.hora);
    if (tieneErroresFechas) {
      setMensajeError('La agenda tiene fechas inválidas. Complete la agenda respetando las reglas de validación.');
      return;
    }

    if (!fotoCapturada) {
      setMensajeError('Es obligatorio tomarse una foto de verificación actual para crear el servicio.');
      return;
    }

    setCargando(true);

    try {
      // 1. Subir la imagen de verificación
      const fotoRespuesta = await subirFotoVerificacionServicio(user.idUsuario, fotoCapturada);
      console.log('Foto de verificación guardada:', fotoRespuesta);

      // 2. Crear Payload del Servicio
      const servicioPayload = {
        idPrestador: user.idUsuario,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precioReferencial: parseFloat(precio),
        modalidad: modalidad,
        latitud: coordenadas.lat,
        longitud: coordenadas.lng,
        agendaDisponible: agenda.map(slot => ({ fecha: slot.fecha, hora: slot.hora }))
      };

      // 3. POST al backend de Spring Boot
      const servicioCreado = await crearNuevoServicio(servicioPayload);
      console.log('Servicio creado con éxito:', servicioCreado);

      setMensajeExito('¡Felicidades! Su servicio ha sido registrado correctamente en la plataforma.');
      setTimeout(() => handleClear(), 2000);

    } catch (error) {
      console.error(error);
      setMensajeError(error.message || 'Error al procesar el registro del servicio.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <CardContainer maxwidth="1000px">
      
      {/* Cabecera idéntica al Perfil de Prestador */}
      <div className="d-flex justify-content-between align-items-start align-items-md-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-file-earmark-plus-fill text-success me-2" />
            registro de servicio
          </h2>
          <span className="text-muted small">
            Formulario de registro de servicio para: <strong>{user?.nombre} {user?.apellido}</strong>
          </span>
        </div>
      </div>

      {mensajeExito && <div className="alert alert-success text-center fw-bold shadow-sm mb-4">{mensajeExito}</div>}
      {mensajeError && <div className="alert alert-danger text-center fw-bold shadow-sm mb-4">{mensajeError}</div>}

      <form onSubmit={handleSubmit}>
        
        {/* Componentes modulares orquestados */}
        <InfoGeneralSection
          nombre={nombre} setNombre={setNombre}
          area={area} setArea={setArea}
          precio={precio} setPrecio={setPrecio}
          modalidad={modalidad} setModalidad={setModalidad}
          descripcion={descripcion} setDescripcion={setDescripcion}
        />

        <AgendaSection 
          agenda={agenda} 
          setAgenda={setAgenda} 
        />

        <UbicacionSection 
          user={user} 
          coordenadas={coordenadas} 
          setCoordenadas={setCoordenadas} 
        />

        <VerificacionSection 
          fotoCapturada={fotoCapturada} 
          setFotoCapturada={setFotoCapturada} 
        />

        {/* Acciones del Formulario */}
        <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
          <button
            type="button"
            className="btn btn-outline-secondary px-4 fw-bold"
            onClick={handleClear}
            disabled={cargando}
          >
            Limpiar Formulario
          </button>
          
          <button
            type="submit"
            className="btn btn-success px-5 fw-bold text-white shadow-sm"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i> Guardar Servicio
              </>
            )}
          </button>
        </div>

      </form>
    </CardContainer>
  );
};