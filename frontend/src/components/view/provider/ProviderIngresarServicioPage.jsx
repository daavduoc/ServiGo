// D:/Proyectos/servigo91/ServiGo/frontend/src/components/view/provider/ProviderIngresarServicioPage.jsx

// Vista de control de servicios generados por el prestador
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la redirección
import { useAuth } from '../../../context/AuthContext';
import { CardContainer } from '../../ui/CardContainer';

import { InfoGeneralSection }  from '../../sections/ingresar-servicio/InfoGeneralSection';
import { AgendaSection }       from '../../sections/ingresar-servicio/AgendaSection';
import { UbicacionSection }    from '../../sections/ingresar-servicio/UbicacionSection';
import { VerificacionSection } from '../../sections/ingresar-servicio/VerificacionSection';

import {
  crearNuevoServicio,
  crearDisponibilidades,
  subirFotoVerificacionServicio,
  getEspecialidades,
} from '../../../serviceFront/servicioService';
import { getMyProfile } from '../../../serviceFront/userService';

import '../../../assets/css/provider-views.css';

const DIAS_MAP = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

function obtenerDiaSemanaDeFecha(fechaStr) {
  const date = new Date(fechaStr + 'T00:00:00');
  return DIAS_MAP[date.getDay()];
}

export const ProviderIngresarServicioPage = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate(); // Inicializamos el hook de navegación

  const [nombre,        setNombre]        = useState('');
  const [area,          setArea]          = useState('');
  const [descripcion,   setDescripcion]   = useState('');
  const [precio,        setPrecio]        = useState('');
  const [modalidad,     setModalidad]     = useState('Domicilio');
  const [coordenadas,   setCoordenadas]   = useState({ lat: -33.4489, lng: -70.6693 });
  const [agenda,        setAgenda]        = useState([]);
  const [fotoCapturada, setFotoCapturada] = useState(null);
  const [cargando,      setCargando]      = useState(false);
  const [mensajeExito,  setMensajeExito]  = useState('');
  const [mensajeError,  setMensajeError]  = useState('');

  const [especialidades, setEspecialidades] = useState([]);
  const [idPrestador,    setIdPrestador]    = useState(null); // Estado para el ID real del prestador

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const perfil = await getMyProfile();
        updateUserData(perfil);

        // Guardamos el ID del prestador de forma segura desde el backend
        if (perfil.idPrestador) {
          setIdPrestador(perfil.idPrestador);
        }

        if (perfil.latitud != null && perfil.longitud != null) {
          setCoordenadas({ lat: perfil.latitud, lng: perfil.longitud });
        }

        if (perfil.especialidad && !area) {
          setArea(perfil.especialidad);
        }
      } catch (err) {
        console.warn('No se pudo cargar el perfil completo:', err);
      }

      try {
        const esp = await getEspecialidades();
        setEspecialidades(esp);
      } catch (err) {
        console.warn('No se pudo cargar especialidades:', err);
      }
    };

    cargarDatos();
  }, [updateUserData]);

  const handleClear = () => {
    setNombre(''); setArea(user?.especialidad || ''); setDescripcion(''); setPrecio('');
    setModalidad('Domicilio');
    setAgenda([]);
    setFotoCapturada(null);
    setMensajeExito(''); setMensajeError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeExito(''); setMensajeError('');

    if (!nombre.trim() || !area.trim() || !descripcion.trim() || !precio) {
      setMensajeError('Por favor, rellene todos los campos de información básica.');
      return;
    }

    const reglasValidas = agenda.filter((r) => !r.excluido);
    const tieneReglas = reglasValidas.length > 0;

    if (tieneReglas) {
      const reglasSinHora = reglasValidas.some((r) => !r.horaInicio || !r.horaFin);
      if (reglasSinHora) {
        setMensajeError('Cada regla de horario debe tener hora de inicio y hora de fin.');
        return;
      }
    }

    // Función para normalizar texto quitando acentos y mayúsculas
    const normalizarTexto = (texto) => {
      return texto
        ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
        : "";
    };

    // Buscamos la especialidad comparando los textos normalizados para evitar fallos por tildes
    const especialidadSeleccionada = especialidades.find(
      (e) => normalizarTexto(e.nombre) === normalizarTexto(area)
    );

    if (especialidades.length > 0 && !especialidadSeleccionada) {
      setMensajeError('Seleccione una especialidad válida de la lista.');
      return;
    }

    // Validamos que contemos con el ID del prestador antes de guardar
    const idPrestadorActual = idPrestador || user.idPrestador;
    if (!idPrestadorActual) {
      setMensajeError('No se pudo identificar su perfil de prestador. Intente recargar la página.');
      return;
    }

    setCargando(true);
    try {
      if (fotoCapturada) {
        await subirFotoVerificacionServicio(user.idUsuario, fotoCapturada);
      }

      const servicioPayload = {
        idPrestador:       idPrestadorActual, // Asignamos el ID real de la tabla PRESTADOR
        idEspecialidad:    especialidadSeleccionada?.idEspecialidad || null,
        nombre:            nombre.trim(),
        descripcion:       descripcion.trim(),
        precioReferencial: parseFloat(precio),
        modalidad,
      };

      const servicioCreado = await crearNuevoServicio(servicioPayload);
      console.log('Servicio creado con éxito:', servicioCreado);

      if (tieneReglas) {
        const disponibilidades = reglasValidas.map((regla) => {
          let diaSemana = regla.diaSemana;

          if (!diaSemana && regla.fecha) {
            diaSemana = obtenerDiaSemanaDeFecha(regla.fecha);
          }

          return {
            diaSemana,
            horaInicio: regla.horaInicio,
            horaFin:    regla.horaFin,
            estado:     'activo',
            prestador:  { idPrestador: idPrestadorActual }, // Asignamos el ID correcto
          };
        });

        await crearDisponibilidades(disponibilidades);
      }

      setMensajeExito('¡Felicidades! Su servicio ha sido registrado correctamente en la plataforma.');
      
      // Redirección automática después de 2 segundos a la gestión de servicios
      setTimeout(() => {
        handleClear();
        navigate('/prestador/gestionar-servicios');
      }, 2000);

    } catch (error) {
      setMensajeError(error.message || 'Error al procesar el registro del servicio.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <CardContainer maxwidth="1000px">

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

      {mensajeExito && <div className="alert alert-success text-center fw-bold shadow-sm mb-4">{mensajeExito}</div>}
      {mensajeError && <div className="alert alert-danger  text-center fw-bold shadow-sm mb-4">{mensajeError}</div>}

      <form onSubmit={handleSubmit}>

        <InfoGeneralSection
          nombre={nombre}       setNombre={setNombre}
          area={area}
          precio={precio}       setPrecio={setPrecio}
          modalidad={modalidad} setModalidad={setModalidad}
          descripcion={descripcion} setDescripcion={setDescripcion}
        />

        <AgendaSection agenda={agenda} setAgenda={setAgenda} />

        <UbicacionSection
          user={user} coordenadas={coordenadas} setCoordenadas={setCoordenadas}
        />

        <VerificacionSection fotoCapturada={fotoCapturada} setFotoCapturada={setFotoCapturada} />

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

      </form>
    </CardContainer>
  );
};