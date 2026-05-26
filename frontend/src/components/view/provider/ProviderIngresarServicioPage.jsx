import React, { useState } from 'react';
import { useAuth }       from '../../../context/AuthContext';
import { CardContainer } from '../../ui/CardContainer';

// Inicio seccion de importaciones de secciones
import { InfoGeneralSection }  from '../../sections/ingresar-servicio/InfoGeneralSection';
import { AgendaSection }       from '../../sections/ingresar-servicio/AgendaSection';
import { UbicacionSection }    from '../../sections/ingresar-servicio/UbicacionSection';
import { VerificacionSection } from '../../sections/ingresar-servicio/VerificacionSection';
// Fin seccion de importaciones de secciones

// importacion para conectarse con el backend
import {
  crearNuevoServicio,
  subirFotoVerificacionServicio,
} from '../../../serviceFront/servicioService';
// fin de importacion para conectarse con el backend

import '../../../assets/css/provider-views.css';

export const ProviderIngresarServicioPage = () => {
  const { user } = useAuth();

  // Inicio seccion del formulario
  const [nombre,        setNombre]        = useState('');
  const [area,          setArea]          = useState('');
  const [descripcion,   setDescripcion]   = useState('');
  const [precio,        setPrecio]        = useState('');
  const [modalidad,     setModalidad]     = useState('Domicilio');
  const [coordenadas,   setCoordenadas]   = useState({ lat: -33.4489, lng: -70.6693 });
  const [agenda,        setAgenda]        = useState([{ id: Date.now(), dias: [], hora: '', error: '' }]); // cambiado: ahora cada grupo tiene un array de días en lugar de una sola fecha
  const [fotoCapturada, setFotoCapturada] = useState(null);
  const [cargando,      setCargando]      = useState(false);
  const [mensajeExito,  setMensajeExito]  = useState('');
  const [mensajeError,  setMensajeError]  = useState('');
  // Fin seccion del formulario

  // Inicio seccion de limpieza del formulario
  const handleClear = () => {
    setNombre(''); setArea(''); setDescripcion(''); setPrecio('');
    setModalidad('Domicilio');
    setAgenda([{ id: Date.now(), dias: [], hora: '', error: '' }]); // cambiado: reinicia con la nueva estructura de grupos
    setFotoCapturada(null);
    setMensajeExito(''); setMensajeError('');
  };
  // Fin seccion de limpieza del formulario

  // inicio seccion de conexión con el backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeExito(''); setMensajeError('');

    if (!nombre.trim() || !area.trim() || !descripcion.trim() || !precio) {
      setMensajeError('Por favor, rellene todos los campos de información básica.');
      return;
    }

    // cambiado: valida que cada grupo tenga al menos un día seleccionado y una hora asignada
    const agendaInvalida = agenda.some((g) => g.dias.length === 0 || !g.hora);
    if (agendaInvalida) {
      setMensajeError('Cada horario debe tener al menos un día seleccionado y una hora asignada.');
      return;
    }

    if (!fotoCapturada) {
      setMensajeError('Es obligatorio tomarse una foto de verificación para crear el servicio.');
      return;
    }

    setCargando(true);
    try {
      // linea de codigo para subir la foto de verificación al backend y obtener la URL o ID de la foto guardada
      const fotoRespuesta = await subirFotoVerificacionServicio(user.idUsuario, fotoCapturada);
      console.log('Foto de verificación guardada:', fotoRespuesta);

      // para crear el servicio, se envía la información del formulario junto con la referencia a la foto de verificación guardada
      const servicioPayload = {
        idPrestador:       user.idUsuario,
        nombre:            nombre.trim(),
        descripcion:       descripcion.trim(),
        precioReferencial: parseFloat(precio),
        modalidad,
        latitud:           coordenadas.lat,
        longitud:          coordenadas.lng,
        agendaDisponible:  agenda.flatMap((grupo) => grupo.dias.map((fecha) => ({ fecha, hora: grupo.hora }))), // cambiado: flatMap expande cada grupo en pares {fecha, hora} que el backend ya entiende
      };

      const servicioCreado = await crearNuevoServicio(servicioPayload);
      console.log('Servicio creado con éxito:', servicioCreado);

      setMensajeExito('¡Felicidades! Su servicio ha sido registrado correctamente en la plataforma.');
      setTimeout(() => handleClear(), 2000);
    } catch (error) {
      setMensajeError(error.message || 'Error al procesar el registro del servicio.');
    } finally {
      setCargando(false);
    }
  };
  // fin de seccion de conexión con el backend

  return (
    <CardContainer maxwidth="1000px">

      {/* Inicio seccion del encavezado */}
      <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-file-earmark-plus-fill text-success me-2" aria-hidden="true" />
            Registro de servicio
          </h2>
          <span className="text-muted small">
            Formulario para: <strong>{user?.nombre} {user?.apellido}</strong>
          </span>
        </div>
      </div>
      {/* Fin seccion del encavezado */}

      {/* Inicio seccion de mensajes de retroalimentación */}
      {mensajeExito && <div className="alert alert-success text-center fw-bold shadow-sm mb-4">{mensajeExito}</div>}
      {mensajeError && <div className="alert alert-danger  text-center fw-bold shadow-sm mb-4">{mensajeError}</div>}
      {/* Fin seccion de mensajes de retroalimentación */}

      <form onSubmit={handleSubmit}>

        {/* Inicio seccion de información general */}
        <InfoGeneralSection
          nombre={nombre}       setNombre={setNombre}
          area={area}           setArea={setArea}
          precio={precio}       setPrecio={setPrecio}
          modalidad={modalidad} setModalidad={setModalidad}
          descripcion={descripcion} setDescripcion={setDescripcion}
        />
        {/* Fin seccion de información general */}

        {/* Inicio seccion de agenda */}
        <AgendaSection agenda={agenda} setAgenda={setAgenda} />
        {/* Fin seccion de agenda */}

        {/* Inicio seccion de ubicación */}
        <UbicacionSection
          user={user} coordenadas={coordenadas} setCoordenadas={setCoordenadas}
        />
        {/* Fin seccion de ubicación */}

        {/* Inicio seccion de verificación con foto */}
        <VerificacionSection fotoCapturada={fotoCapturada} setFotoCapturada={setFotoCapturada} />
        {/* Fin seccion de verificación con foto */}

        {/* Inicio seccion de botones*/}
        <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
          <button type="button" className="btn btn-outline-secondary px-4 fw-bold"
            onClick={handleClear} disabled={cargando}>
            Limpiar Formulario
          </button>
          <button type="submit" className="btn btn-success px-5 fw-bold text-white shadow-sm"
            disabled={cargando}>
            {cargando
              ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
              : <><i className="bi bi-check-lg me-2" />Guardar Servicio</>
            }
          </button>
        </div>
        {/* Fin seccion de botones guardar servicio */}

      </form>
    </CardContainer>
  );
};