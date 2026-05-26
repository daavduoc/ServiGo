// seccion para ingresar la agenda del servicio  con calendario interactivo y grupos de horarios
import React, { useState } from 'react';

// nombres de los meses en español para mostrar en el navegador del calendario
const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

// cabecera de días de la semana, ordenados de lunes a domingo
const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

// paleta de colores para identificar visualmente cada grupo de horario (modificar si al grupo no le agrada)
const COLORES_GRUPOS = ['#198754', '#0d6efd', '#dc3545', '#fd7e14', '#6f42c1'];

export const AgendaSection = ({ agenda, setAgenda }) => {

  // hace que el calendario inicie mostrando el mes actual
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // muestra el calendario y controla la selección de días y horas para cada grupo de horario que asigne el prestador de servicio
  const [mesVista,    setMesVista]    = useState(hoy.getMonth());
  const [añoVista,    setAñoVista]    = useState(hoy.getFullYear());
  const [grupoActivo, setGrupoActivo] = useState(0);

  // logica para validar que la fecha seleccionada sea al menos 2 días después de hoy
  const fechaMin = new Date(hoy);
  fechaMin.setDate(fechaMin.getDate() + 2); // Mínimo 2 días de anticipación

  // logica para validar que la fecha no exceda 3 meses desde hoy (antes solo llegaba al fin de mes)
  const fechaMax = new Date(hoy);
  fechaMax.setMonth(fechaMax.getMonth() + 4); // Máximo 4 meses hacia adelante ( el valor puede cambiarse segun lo que se designe)

  // convierte año + mes base-0 + día numérico a string formato 'YYYY-MM-DD' que necesita el input date
  const aFechaStr = (año, mes, dia) => {
    const m = String(mes + 1).padStart(2, '0'); // el mes en JavaScript es base-0 (0=Enero), por eso se suma 1. Luego se formatea con ceros a la izquierda para que siempre tenga 2 dígitos."
    const d = String(dia).padStart(2, '0');
    return `${año}-${m}-${d}`;
  };

  // verifica si un día del calendario está dentro del rango permitido (entre fechaMin y fechaMax)
  const esFechaHabilitada = (año, mes, dia) => {
    const f = new Date(año, mes, dia);
    return f >= fechaMin && f <= fechaMax;
  };

  //alterna la selección de un día en el grupo activo
  const toggleDia = (fechaStr) => {
    const nuevaAgenda = agenda.map((grupo, i) => {
      if (i !== grupoActivo) return grupo; // solo modifica el grupo activo, el resto no cambia
      const yaSeleccionado = grupo.dias.includes(fechaStr);
      return {
        ...grupo,
        dias: yaSeleccionado
          ? grupo.dias.filter(d => d !== fechaStr) // quitar si ya estaba seleccionado
          : [...grupo.dias, fechaStr].sort(), // agregar y ordenar cronológicamente
      };
    });
    setAgenda(nuevaAgenda);
  };

  // actualiza la hora asignada a un grupo específico
  const handleHoraChange = (grupoIndex, valor) => {
    setAgenda(agenda.map((g, i) => i === grupoIndex ? { ...g, hora: valor } : g));
  };

  // agrega un nuevo grupo de horario vacío y lo activa automáticamente para editar
  const handleAddGrupo = () => {
    const nuevoGrupo = { id: Date.now(), dias: [], hora: '', error: '' };
    setAgenda([...agenda, nuevoGrupo]);
    setGrupoActivo(agenda.length); // el nuevo grupo pasa a ser el activo
  };

  // elimina un grupo (no permite eliminar si solo queda uno)
  const handleRemoveGrupo = (index) => {
    if (agenda.length === 1) return;
    const nuevaAgenda = agenda.filter((_, i) => i !== index);
    setAgenda(nuevaAgenda);
    // si el grupo activo desaparece por la eliminación, retroceder al anterior
    if (grupoActivo >= nuevaAgenda.length) {
      setGrupoActivo(nuevaAgenda.length - 1);
    }
  };

  // navega entre meses del calendario (-1 = mes anterior, +1 = mes siguiente)
  const navegarMes = (dir) => {
    let nuevoMes = mesVista + dir;
    let nuevoAño = añoVista;
    if (nuevoMes > 11) { nuevoMes = 0; nuevoAño++; }  // pasar de diciembre a enero del año siguiente
    if (nuevoMes < 0)  { nuevoMes = 11; nuevoAño--; } // pasar de enero a diciembre del año anterior
    setMesVista(nuevoMes);
    setAñoVista(nuevoAño);
  };

  // construcción del calendario para el mes en vista
  const diasEnMes    = new Date(añoVista, mesVista + 1, 0).getDate(); // día 0 del mes siguiente = último día del mes actual
  const primerDiaSemana = new Date(añoVista, mesVista, 1).getDay();   // 0=Dom, 1=Lun, 2=Mar... etc
  const offsetInicio = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; // ajuste para semana Lun-Dom (Dom pasa al final)

  const celdas = [];
  for (let i = 0; i < offsetInicio; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null); // completar la última fila de 7 columnas

  // dividir el array plano de celdas en semanas de 7 días para renderizar fila por fila
  const semanas = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));

  // control de navegación: no permitir retroceder más allá del mes que contiene fechaMin
  const mesMinDate   = new Date(fechaMin.getFullYear(), fechaMin.getMonth(), 1);
  const mesMaxDate   = new Date(fechaMax.getFullYear(), fechaMax.getMonth(), 1);
  const mesVistaDate = new Date(añoVista, mesVista, 1);
  const puedeRetroceder = mesVistaDate > mesMinDate;
  const puedeAvanzar    = mesVistaDate < mesMaxDate;

  return (
    <div className="card border-0 shadow-sm p-4 mb-4 bg-white animate__animated animate__fadeIn">
      <h4 className="profile-panel-title mb-2">
        <i className="bi bi-calendar-event" />
        Fechas y Horarios Disponibles
      </h4>

      <p className="text-danger small fw-semibold mb-3 d-flex align-items-center gap-1">
        <i className="bi bi-exclamation-triangle-fill"></i>
        Selecciona los días disponibles en el calendario. Mínimo 2 días de anticipación, hasta 3 meses hacia adelante.
      </p>

      {/* selector de grupo activo — visible solo cuando hay más de un grupo de horario */}
      {agenda.length > 1 && (
        <div className="d-flex gap-2 flex-wrap mb-3 align-items-center">
          <small className="text-muted fw-semibold">Marcando días para:</small>
          {agenda.map((g, i) => (
            <button
              key={i}
              type="button"
              className="btn btn-sm"
              style={{
                background: grupoActivo === i ? COLORES_GRUPOS[i % COLORES_GRUPOS.length] : 'transparent',
                color:      grupoActivo === i ? '#fff' : '#6c757d',
                border:     `1px solid ${COLORES_GRUPOS[i % COLORES_GRUPOS.length]}`,
              }}
              onClick={() => setGrupoActivo(i)}
            >
              Horario {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* navegador del mes: botones anterior/siguiente con el nombre del mes al centro */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navegarMes(-1)}
          disabled={!puedeRetroceder}
        >
          <i className="bi bi-chevron-left" />
        </button>
        <span className="fw-bold">{MESES[mesVista]} {añoVista}</span>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navegarMes(1)}
          disabled={!puedeAvanzar}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      {/* cabecera de días de la semana */}
      <div className="d-grid mb-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {DIAS_SEMANA.map(d => (
          <div key={d} className="text-center text-muted small fw-semibold py-1">{d}</div>
        ))}
      </div>

      {/* fila por semana, columna por día */}
      {semanas.map((semana, si) => (
        <div key={si} className="d-grid mb-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
          {semana.map((dia, di) => {
            if (!dia) return <div key={di} />; // celda vacía de relleno

            const fechaStr  = aFechaStr(añoVista, mesVista, dia);
            const habilitado = esFechaHabilitada(añoVista, mesVista, dia);

            // buscar en qué grupo está este día para mostrar su color correspondiente
            const grupoConDia = agenda.findIndex(g => g.dias.includes(fechaStr));
            const seleccionado  = grupoConDia >= 0;
            const colorDelGrupo = seleccionado ? COLORES_GRUPOS[grupoConDia % COLORES_GRUPOS.length] : null;

            return (
              <div key={di} className="text-center">
                <button
                  type="button"
                  disabled={!habilitado}
                  onClick={() => toggleDia(fechaStr)}
                  title={habilitado ? fechaStr : 'Fecha no disponible'}
                  style={{
                    width:        '36px',
                    height:       '36px',
                    borderRadius: '50%',
                    border:       seleccionado ? `2px solid ${colorDelGrupo}` : '1px solid #dee2e6',
                    background:   seleccionado ? colorDelGrupo : habilitado ? '#ffffff' : '#f8f9fa',
                    color:        seleccionado ? '#ffffff'     : habilitado ? '#212529' : '#adb5bd',
                    cursor:       habilitado ? 'pointer' : 'not-allowed',
                    fontSize:     '0.82rem',
                    fontWeight:   seleccionado ? 'bold' : 'normal',
                    transition:   'all 0.15s ease',
                  }}
                >
                  {dia}
                </button>
              </div>
            );
          })}
        </div>
      ))}

      {/* lista de grupos con sus días seleccionados y el input de hora correspondiente */}
      <div className="mt-4">
        <p className="small text-muted fw-semibold mb-2">
          <i className="bi bi-info-circle me-1" />
          Haz clic en los días del calendario para asignarlos al horario activo.
        </p>

        {agenda.map((grupo, grupoIndex) => {
          const color   = COLORES_GRUPOS[grupoIndex % COLORES_GRUPOS.length];
          const esActivo = grupoActivo === grupoIndex;

          return (
            <div
              key={grupo.id ?? grupoIndex}
              className="rounded p-3 mb-3"
              style={{
                border:     esActivo ? `2px solid ${color}` : '1px solid #dee2e6',
                background: esActivo ? '#f8f9fa' : '#ffffff',
              }}
            >
              {/* encabezado del grupo con botón para activarlo y botón para eliminarlo */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <button
                  type="button"
                  className="btn btn-sm fw-semibold"
                  style={{
                    background: esActivo ? color : 'transparent',
                    color:      esActivo ? '#fff' : '#6c757d',
                    border:     `1px solid ${color}`,
                  }}
                  onClick={() => setGrupoActivo(grupoIndex)}
                >
                  <i className="bi bi-pencil-square me-1" />
                  Horario {grupoIndex + 1} {esActivo ? '(activo)' : ''}
                </button>

                {agenda.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm border-0"
                    onClick={() => handleRemoveGrupo(grupoIndex)}
                  >
                    <i className="bi bi-trash3 me-1"></i> Eliminar
                  </button>
                )}
              </div>

              {/* días seleccionados del grupo mostrados como badges de color */}
              <div className="mb-2 d-flex flex-wrap gap-1">
                {grupo.dias.length === 0
                  ? <span className="small text-muted fst-italic">Sin días seleccionados — haz clic en el calendario arriba</span>
                  : grupo.dias.map(d => (
                      <span key={d} className="badge" style={{ background: color, fontSize: '0.75rem' }}>
                        {d}
                      </span>
                    ))
                }
              </div>

              {/* input de hora para este grupo — validación de fechaa */}
              <div className="d-flex align-items-center gap-3">
                <label className="form-label fw-bold text-secondary small mb-0">
                  Hora de disposición:
                </label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  style={{ maxWidth: '140px' }}
                  value={grupo.hora}
                  onChange={(e) => handleHoraChange(grupoIndex, e.target.value)}
                  required
                />
              </div>

              {grupo.error && (
                <div className="col-12 text-danger small mt-1">
                  {grupo.error}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* botón para agregar otro grupo de horario con días y hora distintos */}
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold px-3"
          onClick={handleAddGrupo}
        >
          <i className="bi bi-plus-lg me-1"></i> Añadir Fecha y Hora
        </button>
      </div>

    </div>
  );
};