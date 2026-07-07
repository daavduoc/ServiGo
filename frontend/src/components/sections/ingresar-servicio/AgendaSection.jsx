import React, { useMemo, useState } from 'react';

const DIAS_SEMANA = [
  { label: 'Lunes', value: 'LUNES' },
  { label: 'Martes', value: 'MARTES' },
  { label: 'Miércoles', value: 'MIERCOLES' },
  { label: 'Jueves', value: 'JUEVES' },
  { label: 'Viernes', value: 'VIERNES' },
  { label: 'Sábado', value: 'SABADO' },
  { label: 'Domingo', value: 'DOMINGO' },
];

const DURACIONES = [
  { label: '30 minutos', value: 30 },
  { label: '45 minutos', value: 45 },
  { label: '60 minutos (1 hora)', value: 60 },
  { label: '90 minutos', value: 90 },
  { label: '120 minutos (2 horas)', value: 120 },
];

const DESCANSOS = [
  { label: 'Sin descanso', value: 0 },
  { label: '10 minutos', value: 10 },
  { label: '15 minutos', value: 15 },
  { label: '30 minutos', value: 30 },
  { label: '45 minutos', value: 45 },
  { label: '60 minutos (1 hora)', value: 60 },
];

const BLOQUES_HORARIOS = [
  { key: 'MANANA', label: 'Mañana', icon: 'bi-sunrise', horaInicio: '08:00', horaFin: '12:00' },
  { key: 'TARDE', label: 'Tarde', icon: 'bi-sun', horaInicio: '13:00', horaFin: '18:00' },
  { key: 'NOCHE', label: 'Noche', icon: 'bi-moon', horaInicio: '18:00', horaFin: '22:00' },
];

const obtenerBloquePorHoras = (horaInicio, horaFin) => {
  const bloque = BLOQUES_HORARIOS.find(
    (item) => item.horaInicio === horaInicio && item.horaFin === horaFin
  );
  return bloque?.key || 'PERSONALIZADO';
};

const etiquetaBloque = (bloqueKey) => {
  if (bloqueKey === 'PERSONALIZADO') return 'Personalizado';
  return BLOQUES_HORARIOS.find((item) => item.key === bloqueKey)?.label || 'Personalizado';
};

const crearIntervalo = (
  horaInicio = '09:00',
  horaFin = '13:00',
  bloque = obtenerBloquePorHoras(horaInicio, horaFin)
) => ({
  id: `${Date.now()}-${Math.random()}`,
  horaInicio,
  horaFin,
  bloque,
});

const minutosDesdeHora = (hora) => {
  const [hh, mm] = String(hora || '00:00').split(':').map(Number);
  return (hh * 60) + mm;
};

const horaDesdeMinutos = (minutos) => {
  const minutosValidos = Math.min(Math.max(minutos, 0), 1439);
  const hh = String(Math.floor(minutosValidos / 60)).padStart(2, '0');
  const mm = String(minutosValidos % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

const crearSiguienteIntervalo = (intervalosActuales) => {
  const ultimo = intervalosActuales[intervalosActuales.length - 1];
  if (!ultimo?.horaInicio || !ultimo?.horaFin) return crearIntervalo();

  const duracionUltimo = Math.max(
    minutosDesdeHora(ultimo.horaFin) - minutosDesdeHora(ultimo.horaInicio),
    60
  );
  const inicio = minutosDesdeHora(ultimo.horaFin) + 60;
  const fin = inicio + duracionUltimo;

  if (inicio >= 1439) {
    return crearIntervalo('09:00', '13:00');
  }

  return crearIntervalo(horaDesdeMinutos(inicio), horaDesdeMinutos(fin), 'PERSONALIZADO');
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
};

const crearVistaPrevia = (intervalos, duracion, descanso) => {
  const slots = [];

  intervalos.forEach((intervalo) => {
    let actual = minutosDesdeHora(intervalo.horaInicio);
    const fin = minutosDesdeHora(intervalo.horaFin);

    while (actual + duracion <= fin && slots.length < 9) {
      const inicioSlot = horaDesdeMinutos(actual);
      const finSlot = horaDesdeMinutos(actual + duracion);
      slots.push(`${inicioSlot} - ${finSlot}`);
      actual += duracion + descanso;
    }
  });

  return slots;
};

export const AgendaSection = ({ agenda, setAgenda }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [intervalos, setIntervalos] = useState([]);
  const [duracionCita, setDuracionCita] = useState(60);
  const [descanso, setDescanso] = useState(15);
  const [fechaExcepcion, setFechaExcepcion] = useState('');
  const [excepciones, setExcepciones] = useState([]);
  const [errorModal, setErrorModal] = useState('');

  const agendaPorDia = useMemo(() => {
    return DIAS_SEMANA.reduce((acc, dia) => {
      acc[dia.value] = agenda
        .filter((regla) => !regla.fecha && !regla.excluido && regla.diaSemana === dia.value)
        .sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));
      return acc;
    }, {});
  }, [agenda]);

  const excepcionesGuardadas = useMemo(
    () => agenda.filter((regla) => regla.excluido && regla.fecha),
    [agenda]
  );

  const diaPreview = DIAS_SEMANA.find((dia) => diasSeleccionados.includes(dia.value));
  const vistaPrevia = crearVistaPrevia(intervalos, Number(duracionCita), Number(descanso));

  const abrirModalNuevo = () => {
    setModoEdicion(null);
    setDiasSeleccionados([]);
    setIntervalos([]);
    setDuracionCita(60);
    setDescanso(15);
    setFechaExcepcion('');
    setExcepciones(excepcionesGuardadas.map((regla) => regla.fecha));
    setErrorModal('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (dia) => {
    const reglasDia = agendaPorDia[dia.value] || [];

    setModoEdicion(dia.value);
    setDiasSeleccionados([dia.value]);
    setIntervalos(
      reglasDia.length > 0
        ? reglasDia.map((regla) => ({
            id: regla.id || `${dia.value}-${regla.horaInicio}-${regla.horaFin}`,
            horaInicio: regla.horaInicio,
            horaFin: regla.horaFin,
            bloque: regla.bloque || obtenerBloquePorHoras(regla.horaInicio, regla.horaFin),
          }))
        : []
    );
    setDuracionCita(reglasDia[0]?.duracionCita || 60);
    setDescanso(reglasDia[0]?.descanso || 15);
    setFechaExcepcion('');
    setExcepciones(excepcionesGuardadas.map((regla) => regla.fecha));
    setErrorModal('');
    setModalAbierto(true);
  };

  const toggleDia = (valor) => {
    if (modoEdicion) return;
    setDiasSeleccionados((actual) =>
      actual.includes(valor) ? actual.filter((dia) => dia !== valor) : [...actual, valor]
    );
  };

  const actualizarIntervalo = (id, campo, valor) => {
    setIntervalos((actual) =>
      actual.map((intervalo) => {
        if (intervalo.id !== id) return intervalo;
        const siguiente = { ...intervalo, [campo]: valor };
        if (campo === 'horaInicio' || campo === 'horaFin') {
          siguiente.bloque = obtenerBloquePorHoras(siguiente.horaInicio, siguiente.horaFin);
        }
        return siguiente;
      })
    );
  };

  const agregarBloqueHorario = (bloque) => {
    setErrorModal('');
    setIntervalos((actual) => {
      const yaExiste = actual.some((intervalo) => intervalo.bloque === bloque.key);
      if (yaExiste) return actual;
      return [...actual, crearIntervalo(bloque.horaInicio, bloque.horaFin, bloque.key)];
    });
  };

  const agregarIntervalo = () => {
    setIntervalos((actual) => [
      ...actual,
      actual.length > 0 ? crearSiguienteIntervalo(actual) : crearIntervalo('09:00', '13:00', 'PERSONALIZADO'),
    ]);
  };

  const eliminarIntervalo = (id) => {
    setIntervalos((actual) =>
      actual.length === 1 ? actual : actual.filter((intervalo) => intervalo.id !== id)
    );
  };

  const agregarExcepcion = () => {
    if (!fechaExcepcion) return;
    setExcepciones((actual) =>
      actual.includes(fechaExcepcion) ? actual : [...actual, fechaExcepcion].sort()
    );
    setFechaExcepcion('');
  };

  const eliminarExcepcion = (fecha) => {
    setExcepciones((actual) => actual.filter((item) => item !== fecha));
  };

  const validarModal = () => {
    if (diasSeleccionados.length === 0) {
      return 'Selecciona al menos un dia de la semana.';
    }

    for (const intervalo of intervalos) {
      if (!intervalo.horaInicio || !intervalo.horaFin) {
        return 'Completa todos los intervalos.';
      }
      if (intervalo.horaFin <= intervalo.horaInicio) {
        return 'La hora de fin debe ser mayor que la hora de inicio.';
      }
    }

    const ordenados = [...intervalos].sort((a, b) =>
      a.horaInicio.localeCompare(b.horaInicio)
    );
    for (let i = 1; i < ordenados.length; i += 1) {
      if (ordenados[i].horaInicio < ordenados[i - 1].horaFin) {
        return 'Los intervalos no pueden superponerse.';
      }
    }

    return '';
  };

  const confirmarRegla = () => {
    const error = validarModal();
    if (error) {
      setErrorModal(error);
      return;
    }

    const diasAReemplazar = new Set(diasSeleccionados);
    const reglasSinDiasEditados = agenda.filter(
      (regla) => regla.fecha || regla.excluido || !diasAReemplazar.has(regla.diaSemana)
    );

    const reglasSemanales = diasSeleccionados.flatMap((dia) =>
      intervalos.map((intervalo, index) => ({
        id: `${Date.now()}-${dia}-${index}`,
        diaSemana: dia,
        fecha: null,
        horaInicio: intervalo.horaInicio,
        horaFin: intervalo.horaFin,
        bloque: intervalo.bloque,
        duracionCita: Number(duracionCita),
        descanso: Number(descanso),
      }))
    );

    const reglasSinExcepciones = reglasSinDiasEditados.filter((regla) => !regla.excluido);
    const reglasExcepciones = excepciones.map((fecha) => ({
      id: `${Date.now()}-${fecha}-excluido`,
      diaSemana: null,
      fecha,
      excluido: true,
      horaInicio: '00:00',
      horaFin: '23:59',
    }));

    setAgenda([...reglasSinExcepciones, ...reglasSemanales, ...reglasExcepciones]);
    setModalAbierto(false);
  };

  const desactivarDia = (dia) => {
    setAgenda(agenda.filter((regla) => regla.diaSemana !== dia.value));
  };

  return (
    <div className="card border-0 shadow-sm p-4 mb-4 bg-white animate__animated animate__fadeIn">
      <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h4 className="profile-panel-title mb-2">
            <i className="bi bi-calendar-week" />
            Horarios Semanales de Atención
          </h4>
          <p className="text-muted small mb-0">
            Configura los días y horarios en los que ofreces este servicio.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-success fw-bold px-3"
          onClick={abrirModalNuevo}
        >
          <i className="bi bi-plus-lg me-2" />
          Nuevo Horario
        </button>
      </div>

      <div className="border rounded-3 overflow-hidden">
        {DIAS_SEMANA.map((dia) => {
          const reglas = agendaPorDia[dia.value] || [];
          const activo = reglas.length > 0;

          return (
            <div
              key={dia.value}
              className="d-flex align-items-center gap-3 px-3 py-2 border-bottom"
              style={{ minHeight: 54, background: activo ? '#fff' : '#fbfcfd' }}
            >
              <button
                type="button"
                className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: activo ? '#198754' : '#fff',
                  borderColor: activo ? '#198754' : '#adb5bd',
                  color: activo ? '#fff' : '#6c757d',
                }}
                onClick={() => (activo ? desactivarDia(dia) : abrirModalEditar(dia))}
                title={activo ? 'Desactivar dia' : 'Agregar horario'}
              >
                {activo && <i className="bi bi-check-lg" style={{ fontSize: 12 }} />}
              </button>

              <strong className="small text-dark" style={{ width: 96 }}>
                {dia.label}
              </strong>

              <div className="d-flex flex-wrap gap-2 flex-grow-1">
                {activo ? (
                  reglas.map((regla) => (
                    <span
                      key={regla.id || `${dia.value}-${regla.horaInicio}-${regla.horaFin}`}
                      className="badge bg-light text-dark border fw-semibold px-3 py-2"
                    >
                      <i className="bi bi-clock me-2 text-success" />
                      <span className="text-success me-2">{etiquetaBloque(regla.bloque)}:</span>
                      {regla.horaInicio} - {regla.horaFin}
                    </span>
                  ))
                ) : (
                  <span className="text-muted small">-</span>
                )}
              </div>

              <button
                type="button"
                className={`btn btn-sm px-4 fw-bold ${
                  activo ? 'btn-outline-success' : 'btn-outline-secondary'
                }`}
                onClick={() => abrirModalEditar(dia)}
                disabled={!activo}
              >
                <i className="bi bi-pencil me-2" />
                Modificar
              </button>
            </div>
          );
        })}
      </div>

      <div className="row g-3 mt-3">
        <div className="col-lg-4">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-1">Duración de cada cita</h6>
            <p className="text-muted small mb-2">Tiempo que durara cada asesoria.</p>
            <span className="badge bg-light text-dark border px-3 py-2">
              <i className="bi bi-clock me-2 text-success" />
              {DURACIONES.find((item) => item.value === Number(duracionCita))?.label || '60 minutos'}
            </span>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-1">Descanso entre citas</h6>
            <p className="text-muted small mb-2">Tiempo de descanso entre una cita y otra.</p>
            <span className="badge bg-light text-dark border px-3 py-2">
              <i className="bi bi-clock me-2 text-success" />
              {DESCANSOS.find((item) => item.value === Number(descanso))?.label || '15 minutos'}
            </span>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-1">Vista previa de disponibilidad</h6>
            <p className="text-muted small mb-2">Así verán tus clientes los horarios disponibles.</p>
            {excepcionesGuardadas.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {excepcionesGuardadas.slice(0, 3).map((regla) => (
                  <span key={regla.id || regla.fecha} className="badge bg-danger-subtle text-danger border px-2 py-2">
                    {formatearFecha(regla.fecha)}
                  </span>
                ))}
              </div>
            )}
            {excepcionesGuardadas.length === 0 && (
              <span className="text-muted small">Sin excepciones configuradas.</span>
            )}
          </div>
        </div>
      </div>

      {modalAbierto && (
        <div
          className="modal fade show d-block animate__animated animate__fadeIn"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1055 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content shadow-lg border-0 overflow-hidden" style={{ borderRadius: 8 }}>
              <div className="modal-header py-3" style={{ background: '#198754' }}>
                <h5 className="modal-title fw-bold m-0" style={{ color: '#fff' }}>
                  <span
                    className="d-inline-flex align-items-center"
                    style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
                  >
                    <i className="bi bi-clock me-2" style={{ color: '#fff', WebkitTextFillColor: '#fff' }} />
                    <span style={{ color: '#fff', WebkitTextFillColor: '#fff' }}>
                      {modoEdicion ? 'Modificar horario' : 'Nuevo Horario'}
                    </span>
                  </span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalAbierto(false)}
                />
              </div>

              <div className="modal-body p-4">
                <p className="fw-bold mb-2">1. Selecciona los días de la semana</p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {DIAS_SEMANA.map((dia) => {
                    const activo = diasSeleccionados.includes(dia.value);
                    return (
                      <button
                        key={dia.value}
                        type="button"
                        className="btn btn-sm rounded-pill px-4 fw-bold"
                        style={{
                          backgroundColor: activo ? '#198754' : '#fff',
                          borderColor: '#198754',
                          color: activo ? '#fff' : '#198754',
                          opacity: modoEdicion && !activo ? 0.55 : 1,
                        }}
                        onClick={() => toggleDia(dia.value)}
                        disabled={Boolean(modoEdicion && !activo)}
                      >
                        {activo && <i className="bi bi-check-square-fill me-2" />}
                        {dia.label}
                      </button>
                    );
                  })}
                </div>

                <p className="fw-bold mb-1">2. Define los horarios para los días seleccionados</p>
                <p className="text-muted small mb-3">
                  Agrega bloques por mañana, tarde o noche. Puedes modificar las horas después.
                </p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {BLOQUES_HORARIOS.map((bloque) => (
                    <button
                      key={bloque.key}
                      type="button"
                      className="btn btn-outline-success btn-sm fw-bold"
                      onClick={() => agregarBloqueHorario(bloque)}
                    >
                      <i className={`bi ${bloque.icon} me-2`} />
                      {bloque.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm fw-bold"
                    onClick={agregarIntervalo}
                  >
                    <i className="bi bi-plus-lg me-2" />
                    Personalizado
                  </button>
                </div>

                <div className="border rounded-3 overflow-hidden mb-3">
                  {intervalos.length === 0 && (
                    <div className="p-4 text-center text-muted small">
                      Selecciona Mañana, Tarde, Noche o Personalizado para agregar un horario.
                    </div>
                  )}
                  {intervalos.map((intervalo, index) => (
                    <div key={intervalo.id} className="p-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <strong className="small">{etiquetaBloque(intervalo.bloque)}</strong>
                          <span className="text-muted small ms-2">Intervalo {index + 1}</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => eliminarIntervalo(intervalo.id)}
                          disabled={intervalos.length === 1}
                          title="Eliminar intervalo"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-muted small">Hora de inicio</label>
                          <input
                            type="time"
                            className="form-control"
                            value={intervalo.horaInicio}
                            onChange={(e) => actualizarIntervalo(intervalo.id, 'horaInicio', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small">Hora de fin</label>
                          <input
                            type="time"
                            className="form-control"
                            value={intervalo.horaFin}
                            onChange={(e) => actualizarIntervalo(intervalo.id, 'horaFin', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3">
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm fw-bold"
                      onClick={agregarIntervalo}
                    >
                      <i className="bi bi-plus-lg me-2" />
                      Agregar personalizado
                    </button>
                  </div>
                </div>

                <div className="border-bottom pb-3 mb-3">
                  <p className="fw-bold mb-1">3. Excepciones (opcional)</p>
                  <p className="text-muted small mb-2">
                    Agrega todas las fechas en las que no estarás disponible.
                  </p>
                  <div className="d-flex gap-2 flex-wrap align-items-center">
                    <input
                      type="date"
                      className="form-control"
                      style={{ maxWidth: 220 }}
                      value={fechaExcepcion}
                      onChange={(e) => setFechaExcepcion(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary fw-bold"
                      onClick={agregarExcepcion}
                      disabled={!fechaExcepcion}
                    >
                      <i className="bi bi-calendar-x me-2" />
                      Agregar excepción
                    </button>
                    {excepciones.length > 0 && (
                      <span className="badge bg-success-subtle text-success border px-3 py-2">
                        {excepciones.length} fecha{excepciones.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {excepciones.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {excepciones.map((fecha) => (
                        <button
                          key={fecha}
                          type="button"
                          className="btn btn-sm btn-danger-subtle text-danger border"
                          onClick={() => eliminarExcepcion(fecha)}
                          title="Quitar excepción"
                        >
                          {formatearFecha(fecha)}
                          <i className="bi bi-x-lg ms-2" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">4. Duración de cada cita</label>
                    <select
                      className="form-select"
                      value={duracionCita}
                      onChange={(e) => setDuracionCita(Number(e.target.value))}
                    >
                      {DURACIONES.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Descanso entre citas</label>
                    <select
                      className="form-select"
                      value={descanso}
                      onChange={(e) => setDescanso(Number(e.target.value))}
                    >
                      {DESCANSOS.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="fw-bold mb-1">
                    5. Vista previa{diaPreview ? ` para ${diaPreview.label}` : ''}
                  </p>
                  <p className="text-muted small mb-2">
                    Así verán tus clientes los horarios disponibles para los días seleccionados.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {vistaPrevia.length > 0 ? (
                      vistaPrevia.map((slot) => (
                        <span key={slot} className="badge bg-success-subtle text-success border px-3 py-2">
                          {slot}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted small">No hay bloques disponibles con esta configuracion.</span>
                    )}
                  </div>
                </div>

                {errorModal && (
                  <div className="alert alert-danger py-2 small mt-3 mb-0">
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    {errorModal}
                  </div>
                )}
              </div>

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
