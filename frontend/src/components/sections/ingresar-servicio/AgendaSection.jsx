import React, { useState } from 'react';

// Días de la semana — el value es el string exacto que recibe la entidad Disponibilidad del backend
const DIAS_SEMANA = [
  { label: 'Lunes',     value: 'LUNES'     },
  { label: 'Martes',    value: 'MARTES'    },
  { label: 'Miércoles', value: 'MIERCOLES' },
  { label: 'Jueves',    value: 'JUEVES'    },
  { label: 'Viernes',   value: 'VIERNES'   },
  { label: 'Sábado',    value: 'SABADO'    },
  { label: 'Domingo',   value: 'DOMINGO'   },
];

// Nombres de meses en español para el navegador de mes del calendario de referencia
const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

// Cabecera corta de días (Lun a Dom) para el mini-calendario del modal
const CAB_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

// Mapa de día-valor → índice de columna (0=Lunes … 6=Domingo) para resaltar columnas en el calendario
const DIA_A_COLUMNA = {
  LUNES: 0, MARTES: 1, MIERCOLES: 2, JUEVES: 3,
  VIERNES: 4, SABADO: 5, DOMINGO: 6,
};

/** Construye el array de semanas (7 columnas) para el mes/año dado */
function construirCalendario(anio, mes) {
  const diasEnMes       = new Date(anio, mes + 1, 0).getDate();
  const primerDiaSemana = new Date(anio, mes, 1).getDay();
  const offset          = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

  const celdas = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);

  const semanas = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));
  return semanas;
}

// Helper para formatear la fecha como string YYYY-MM-DD
const obtenerFechaString = (anio, mes, dia) => {
  if (!dia) return null;
  const m = String(mes + 1).padStart(2, '0');
  const d = String(dia).padStart(2, '0');
  return `${anio}-${m}-${d}`;
};

export const AgendaSection = ({ agenda, setAgenda }) => {
  // modal de asignacion de horas
  const [modalAbierto,      setModalAbierto]      = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  
  //Estados para excepciones de fechas específicas
  const [fechasDesactivadas, setFechasDesactivadas] = useState([]); // Fechas del grupo que se desmarcaron
  const [fechasAdicionales,  setFechasAdicionales]  = useState([]); // Fechas individuales que se marcaron

  const [horaInicio,        setHoraInicio]        = useState('09:00');
  const [horaFin,           setHoraFin]           = useState('13:00');
  const [errorModal,        setErrorModal]        = useState('');

  //calendario del modal
  const hoy = new Date();
  const [mesVista,  setMesVista]  = useState(hoy.getMonth());
  const [anioVista, setAnioVista] = useState(hoy.getFullYear());

  // secciond e navegacion del calendario
  const navegarMes = (dir) => {
    let m = mesVista + dir;
    let a = anioVista;
    if (m > 11) { m = 0; a++; }
    if (m < 0)  { m = 11; a--; }
    setMesVista(m);
    setAnioVista(a);
  };

  // Comprueba si un día específico debe mostrarse seleccionado (en verde)
  const esFechaSeleccionada = (fechaStr, diaSemanaIndex) => {
    if (!fechaStr) return false;
    const diaSemanaVal = DIAS_SEMANA[diaSemanaIndex]?.value;
    const perteneceADiaSemana = diasSeleccionados.includes(diaSemanaVal);

    if (perteneceADiaSemana) {
      return !fechasDesactivadas.includes(fechaStr);
    } else {
      return fechasAdicionales.includes(fechaStr);
    }
  };

  // Marca/desmarca una fecha del calendario al hacer clic en ella
  const toggleFechaEnCalendario = (fechaStr, diaSemanaIndex) => {
    if (!fechaStr) return;
    const diaSemanaVal = DIAS_SEMANA[diaSemanaIndex]?.value;
    const perteneceADiaSemana = diasSeleccionados.includes(diaSemanaVal);

    if (perteneceADiaSemana) {
      setFechasDesactivadas((prev) =>
        prev.includes(fechaStr) ? prev.filter((f) => f !== fechaStr) : [...prev, fechaStr]
      );
    } else {
      setFechasAdicionales((prev) =>
        prev.includes(fechaStr) ? prev.filter((f) => f !== fechaStr) : [...prev, fechaStr]
      );
    }
  };

  // esto se encarga de agregar o quitar un día de la semana del array de seleccionados al hacer click en el botón correspondiente
  const toggleDia = (valor) => {
    setDiasSeleccionados((prev) => {
      const nuevo = prev.includes(valor) ? prev.filter((d) => d !== valor) : [...prev, valor];
      
      // Resetea excepciones para este día de la semana
      const columnaIndex = DIAS_SEMANA.findIndex(d => d.value === valor);
      setFechasDesactivadas(current => current.filter(fecha => {
        const date = new Date(fecha + 'T00:00:00');
        const day = date.getDay();
        const dayIndex = day === 0 ? 6 : day - 1;
        return dayIndex !== columnaIndex;
      }));
      setFechasAdicionales(current => current.filter(fecha => {
        const date = new Date(fecha + 'T00:00:00');
        const day = date.getDay();
        const dayIndex = day === 0 ? 6 : day - 1;
        return dayIndex !== columnaIndex;
      }));

      return nuevo;
    });
  };

  // abre el modal limpio con valores con iniciales (puede cambiarse sin problemas)
  const abrirModal = () => {
    setDiasSeleccionados([]);
    // Resetear excepciones locales al abrir modal
    setFechasDesactivadas([]);
    setFechasAdicionales([]);
    setHoraInicio('09:00');
    setHoraFin('13:00');
    setErrorModal('');
    setModalAbierto(true);
  };

  // agegar reglas
  const confirmarRegla = () => {
    //  Validación de selección flexible
    const tieneSeleccion = diasSeleccionados.length > 0 || fechasAdicionales.length > 0;
    if (!tieneSeleccion) {
      setErrorModal('Selecciona al menos un día de la semana o marca fechas en el calendario.');
      return;
    }
    if (!horaInicio || !horaFin) {
      setErrorModal('Completa la hora de inicio y la hora de fin.');
      return;
    }
    if (horaFin <= horaInicio) {
      setErrorModal('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    const nuevasReglas = [];

    // Reglas recurrentes semanales
    diasSeleccionados.forEach((dia) => {
      nuevasReglas.push({
        id:         `${Date.now()}-${dia}`,
        diaSemana:  dia,
        fecha:      null,
        horaInicio,
        horaFin,
        mes:        mesVista,
        anio:       anioVista,
      });
    });

    // Reglas para fechas específicas marcadas individualmente
    fechasAdicionales.forEach((fechaStr) => {
      nuevasReglas.push({
        id:         `${Date.now()}-${fechaStr}`,
        diaSemana:  null,
        fecha:      fechaStr,
        horaInicio,
        horaFin,
      });
    });

    //  Reglas de exclusión (útil en frontend para documentar y mandar al backend si este se actualiza)
    fechasDesactivadas.forEach((fechaStr) => {
      nuevasReglas.push({
        id:         `${Date.now()}-${fechaStr}-excluido`,
        diaSemana:  null,
        fecha:      fechaStr,
        excluido:   true,
        horaInicio,
        horaFin,
      });
    });

    setAgenda([...agenda, ...nuevasReglas]);
    setModalAbierto(false);
  };

  //elimina una regla de horas
  const eliminarRegla = (index) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  // mini calendariod el modal se usan las semanas para el mes/año de vista y un set de columnas a resaltar según los días seleccionados
  const semanas            = construirCalendario(anioVista, mesVista);
  const columnasResaltadas = new Set(diasSeleccionados.map((d) => DIA_A_COLUMNA[d]));

  // render inicial
  return (
    <div className="card border-0 shadow-sm p-4 mb-4 bg-white animate__animated animate__fadeIn">

      {/* Cabecera de la sección */}
      <h4 className="profile-panel-title mb-2">
        <i className="bi bi-calendar-week" />
        Horarios Semanales de Atención
      </h4>
      <p className="text-muted small mb-3">
        Configura los días recurrentes y/o fechas específicas en los que ofreces este servicio.
      </p>

      {/* Lista de reglas ya agregadas */}
      {agenda.length === 0 ? (
        <p className="fst-italic text-muted small mb-3">
          Aún no has ingresado ningún horario. Haz clic en el botón de abajo para empezar.
        </p>
      ) : (
        <div className="mb-3">
          {agenda.map((regla, i) => (
            <div
              key={regla.id ?? i}
              className="d-flex align-items-center justify-content-between rounded px-3 py-2 mb-2"
              // Color de fondo de los badges según sea recurrente, específico o exclusión
              style={{ 
                background: regla.excluido ? '#f8d7da' : regla.fecha ? '#e8f4fd' : '#f0faf4', 
                border: regla.excluido ? '1px solid #f5c2c7' : regla.fecha ? '1px solid #bde0fe' : '1px solid #c3e6cb' 
              }}
            >
              <div>
                {/* Renderizado de badges adaptativos */}
                {regla.excluido ? (
                  <span className="badge bg-danger me-2" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-calendar-x me-1" />
                    Excluido: {(() => {
                      const parts = regla.fecha.split('-');
                      if (parts.length === 3) {
                        const [, mm, dd] = parts;
                        const mesIndex = parseInt(mm, 10) - 1;
                        return `${parseInt(dd, 10)} de ${MESES[mesIndex]}`;
                      }
                      return regla.fecha;
                    })()}
                  </span>
                ) : regla.fecha ? (
                  <span className="badge bg-primary me-2" style={{ fontSize: '0.78rem', background: '#0d6efd' }}>
                    <i className="bi bi-calendar-event me-1" />
                    {(() => {
                      const parts = regla.fecha.split('-');
                      if (parts.length === 3) {
                        // MODIFICACIÓN LÍNEA 266: Se omite 'aaaa' para evitar el warning
                        const [, mm, dd] = parts;
                        const mesIndex = parseInt(mm, 10) - 1;
                        return `${parseInt(dd, 10)} de ${MESES[mesIndex]}`;
                      }
                      return regla.fecha;
                    })()}
                  </span>
                ) : (
                  <span className="badge bg-success me-2" style={{ fontSize: '0.78rem' }}>
                    Cada {DIAS_SEMANA.find((d) => d.value === regla.diaSemana)?.label ?? regla.diaSemana}
                    {regla.mes != null && regla.anio != null && ` de ${MESES[regla.mes]}`}
                  </span>
                )}
                <span className="small fw-semibold text-dark" style={{ textDecoration: regla.excluido ? 'line-through' : 'none' }}>
                  {regla.horaInicio} — {regla.horaFin}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm border-0 py-0 px-2"
                title="Eliminar este horario"
                onClick={() => eliminarRegla(i)}
              >
                <i className="bi bi-trash3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botón principal para abrir el modal */}
      <div>
        <button
          type="button"
          className="btn btn-outline-success fw-bold px-4"
          onClick={abrirModal}
        >
          <i className="bi bi-plus-lg me-2" />
          Asignar Horas
        </button>
      </div>

      {/* Modal y las reglas*/}
      {modalAbierto && (
        <div
          className="modal fade show d-block animate__animated animate__fadeIn"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1055 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content rounded-4 shadow-lg border-0 overflow-hidden">

              {/* Cabecera del modal */}
              <div className="modal-header py-3" style={{ background: '#198754' }}>
                <h5 className="modal-title fw-bold text-white">
                  <i className="bi bi-clock me-2" />
                  Nueva Regla de Horario
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalAbierto(false)}
                />
              </div>

              <div className="modal-body p-4">

                {/* Días de la semana */}
                <p className="fw-semibold mb-2">1. Selecciona los días de la semana:</p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {DIAS_SEMANA.map((dia) => {
                    const activo = diasSeleccionados.includes(dia.value);
                    return (
                      <button
                        key={dia.value}
                        type="button"
                        onClick={() => toggleDia(dia.value)}
                        style={{
                          borderRadius: '999px',
                          padding:      '6px 18px',
                          fontWeight:   '600',
                          fontSize:     '0.9rem',
                          border:       activo ? 'none' : '1.5px solid #198754',
                          background:   activo ? '#198754' : 'transparent',
                          color:        activo ? '#fff'   : '#198754',
                          cursor:       'pointer',
                          transition:   'all 0.15s ease',
                        }}
                      >
                        {dia.label}
                      </button>
                    );
                  })}
                </div>

                {/* parte horario: Rango horario */}
                <p className="fw-semibold mb-2">2. Rango horario:</p>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Hora de Inicio</label>
                    <input
                      type="time"
                      className="form-control"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Hora de Fin</label>
                    <input
                      type="time"
                      className="form-control"
                      value={horaFin}
                      onChange={(e) => setHoraFin(e.target.value)}
                    />
                  </div>
                </div>

                {/* calendario de referencia */}
                <p className="fw-semibold small text-muted mb-1">
                  <i className="bi bi-calendar3 me-1" />
                  Vista del mes — los días seleccionados se resaltan:
                </p>

                {/* Mensaje explicativo para marcar y desmarcar celdas */}
                <p className="small text-success fw-semibold mb-2">
                  * Al hacer clic en el calendario puedes marcar o desmarcar fechas.
                </p>

                {/* Navegador de mes */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <button type="button" className="btn btn-outline-secondary btn-sm"
                    onClick={() => navegarMes(-1)}>
                    <i className="bi bi-chevron-left" />
                  </button>
                  <span className="fw-bold small">{MESES[mesVista]} {anioVista}</span>
                  <button type="button" className="btn btn-outline-secondary btn-sm"
                    onClick={() => navegarMes(1)}>
                    <i className="bi bi-chevron-right" />
                  </button>
                </div>

                {/* Cabecera días del mini-calendario */}
                <div className="d-grid mb-1"
                  style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {CAB_SEMANA.map((d, i) => (
                    <div
                      key={d}
                      className="text-center py-1 rounded small fw-semibold"
                      style={{
                        background: columnasResaltadas.has(i) ? '#d1f0e0' : 'transparent',
                        color:      columnasResaltadas.has(i) ? '#155724' : '#6c757d',
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Filas del mini-calendario */}
                {semanas.map((semana, si) => (
                  <div key={si} className="d-grid mb-1"
                    style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {semana.map((dia, di) => {
                      // Renderizado interactivo y unificado de selección
                      if (!dia) {
                        return <div key={di} style={{ minHeight: '32px' }} />;
                      }

                      const fechaStr = obtenerFechaString(anioVista, mesVista, dia);
                      const seleccionado = esFechaSeleccionada(fechaStr, di);

                      let background = 'transparent';
                      let color = '#212529';
                      let fontWeight = 'normal';

                      if (seleccionado) {
                        background = '#198754'; // Verde unificado
                        color = '#fff';
                        fontWeight = 'bold';
                      }

                      return (
                        <button
                          key={di}
                          type="button"
                          onClick={() => toggleFechaEnCalendario(fechaStr, di)}
                          className="btn btn-sm p-0 rounded-circle text-center d-flex align-items-center justify-content-center"
                          style={{
                            width: '32px',
                            height: '32px',
                            margin: 'auto',
                            background,
                            color,
                            fontWeight,
                            border: seleccionado ? 'none' : '1px solid #dee2e6',
                            fontSize: '0.85rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {dia}
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* Error de validación */}
                {errorModal && (
                  <div className="alert alert-danger py-2 small mt-3 mb-0">
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    {errorModal}
                  </div>
                )}
              </div>

              {/* Footer del modal */}
              <div className="modal-footer border-0 pb-4 px-4 gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 fw-bold"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success px-5 fw-bold text-white"
                  onClick={confirmarRegla}
                >
                  Aceptar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};