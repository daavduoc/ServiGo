import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/formatPrice';
import {
  ETIQUETAS_DIA_CORTA,
  addDias,
  esFechaReservable,
  etiquetaDiaRecurrente,
  filtrarDisponibilidades,
  formatFechaChip,
  formatFechaHorarioTitulo,
  formatRangoSemana,
  getDiaSemanaBackend,
  getFechaHoyStrings,
  getInicioSemana,
  getLimitesAgenda,
  horariosParaFecha,
  isHoraPasada,
  listarProximasFechas,
  parseFechaIso,
  toFechaIso,
  validarSeleccionHorario,
} from '../../utils/booking';

const limpiarDescripcionServicio = (descripcion) => {
  if (!descripcion) return '';

  const texto = String(descripcion).trim();
  const pareceRespuestaGenerada =
    /aqu[ií] tienes/i.test(texto) ||
    /opci[oó]n\s+\d/i.test(texto) ||
    /puedes elegir/i.test(texto);

  if (!pareceRespuestaGenerada) return texto;

  const sinOpcionesPosteriores = texto.split(/opci[oó]n\s+2\s*:/i)[0];
  const desdePregunta = sinOpcionesPosteriores.match(/¿[^]+/);
  if (desdePregunta?.[0]) {
    return desdePregunta[0]
      .replace(/Mi metodolog[ií]a\s*:/i, '\nMi metodología:')
      .trim();
  }

  const desdeSoy = sinOpcionesPosteriores.match(/Soy\s+[^]+/i);
  if (desdeSoy?.[0]) return desdeSoy[0].trim();

  return '';
};

export const BookingForm = ({
  prestador,
  precioReferencial,
  onSubmit,
  submitting = false,
  resetKey = 0,
}) => {
  const todasDisponibilidades = useMemo(
    () => prestador.disponibilidades || [],
    [prestador.disponibilidades]
  );
  const servicios = useMemo(
    () => prestador.servicios || [],
    [prestador.servicios]
  );
  const { fechaMinString, fechaMaxString } = getLimitesAgenda();
  const fechaMinDate = useMemo(() => parseFechaIso(fechaMinString), [fechaMinString]);
  const { fechaHoyString, horaActualString } = getFechaHoyStrings();

  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [inicioSemana, setInicioSemana] = useState(() => getInicioSemana(fechaMinDate));

  useEffect(() => {
    setServicioSeleccionado(null);
    setFechaSeleccionada('');
    setHoraSeleccionada('');
    setInicioSemana(getInicioSemana(fechaMinDate));
  }, [resetKey, fechaMinDate]);

  useEffect(() => {
    if (servicioSeleccionado || servicios.length === 0) return;

    const servicioConDisponibilidad = servicios.find((servicio) =>
      todasDisponibilidades.some(
        (disponibilidad) =>
          disponibilidad.idServicio != null &&
          String(disponibilidad.idServicio) === String(servicio.idServicio)
      )
    );

    const servicioConPrecioDesde = servicios.find(
      (servicio) =>
        servicio.precioReferencial != null &&
        precioReferencial != null &&
        Number(servicio.precioReferencial) === Number(precioReferencial)
    );
    const servicioConDetalle = servicios.find(
      (servicio) => servicio.descripcion || servicio.precioReferencial != null
    );

    setServicioSeleccionado(servicioConDisponibilidad || servicioConPrecioDesde || servicioConDetalle || servicios[0]);
  }, [servicioSeleccionado, servicios, todasDisponibilidades, precioReferencial]);

  const disponibilidades = useMemo(
    () => filtrarDisponibilidades(todasDisponibilidades, servicioSeleccionado?.idServicio ?? null),
    [todasDisponibilidades, servicioSeleccionado]
  );

  const finSemana = useMemo(() => addDias(inicioSemana, 6), [inicioSemana]);

  const diasSemanaVista = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDias(inicioSemana, i)),
    [inicioSemana]
  );

  const proximasFechas = useMemo(
    () => listarProximasFechas(fechaMinString, fechaMaxString, disponibilidades, inicioSemana),
    [fechaMinString, fechaMaxString, disponibilidades, inicioSemana]
  );

  const horariosDisponibles = useMemo(
    () => horariosParaFecha(fechaSeleccionada, disponibilidades),
    [fechaSeleccionada, disponibilidades]
  );

  const duracionEstimada = useMemo(() => {
    const reglaConDuracion = disponibilidades.find((regla) => Number(regla.duracionCita) > 0);
    return Number(reglaConDuracion?.duracionCita) || 60;
  }, [disponibilidades]);

  const descripcionServicioSeleccionado = useMemo(
    () => limpiarDescripcionServicio(servicioSeleccionado?.descripcion),
    [servicioSeleccionado?.descripcion]
  );

  const inicioSemanaMin = getInicioSemana(parseFechaIso(fechaMinString));
  const inicioSemanaMax = getInicioSemana(parseFechaIso(fechaMaxString));
  const puedeSemanaAnterior = inicioSemana > inicioSemanaMin;
  const puedeSemanaSiguiente = inicioSemana < inicioSemanaMax;

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio);
    setFechaSeleccionada('');
    setHoraSeleccionada('');
  };

  const seleccionarFecha = (fechaIso) => {
    setFechaSeleccionada(fechaIso);
    setHoraSeleccionada('');
  };

  const irSemanaAnterior = () => {
    if (!puedeSemanaAnterior) return;
    setInicioSemana(addDias(inicioSemana, -7));
  };

  const irSemanaSiguiente = () => {
    if (!puedeSemanaSiguiente) return;
    setInicioSemana(addDias(inicioSemana, 7));
  };

  const handleContinuar = (e) => {
    e.preventDefault();
    const errorMsg = validarSeleccionHorario(
      fechaSeleccionada,
      horaSeleccionada,
      fechaHoyString,
      horaActualString
    );
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    onSubmit(fechaSeleccionada, horaSeleccionada, servicioSeleccionado?.idServicio ?? null);
  };

  return (
    <div className="servigo-booking-card card border-0 shadow-sm p-4 bg-white h-100">
      <h4 className="servigo-booking-card__title fw-bold text-dark mb-2 d-flex align-items-center gap-2">
        <i className="bi bi-calendar-event" aria-hidden="true" />
        Agendar cita
      </h4>
      <p className="text-muted small mb-4">
        Selecciona un servicio, fecha y hora para solicitar una cita con <strong>{prestador.nombre}</strong>.
        Puedes agendar desde <strong>2 días después de hoy</strong> hasta{' '}
        <strong>4 semanas</strong>.
      </p>

      {servicios.length > 0 && (
        <section className="mb-4 p-3 rounded-3 bg-light border">
          <h6 className="servigo-booking-subtitle small fw-bold text-success mb-3 d-flex align-items-center gap-2">
            <span className="servigo-booking-step-num" aria-hidden="true">0</span>
            Selecciona el servicio
          </h6>
          <div className="d-flex flex-column gap-2">
            {servicios.map((servicio) => {
              const seleccionado = String(servicioSeleccionado?.idServicio) === String(servicio.idServicio);
              const descripcionLimpia = limpiarDescripcionServicio(servicio.descripcion);
              return (
                <button
                  key={servicio.idServicio}
                  type="button"
                  className={`btn w-100 text-start servigo-transition servigo-service-select-btn ${
                    seleccionado ? 'btn-success text-white' : 'btn-outline-secondary'
                  }`}
                  onClick={() => seleccionarServicio(servicio)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{servicio.nombre}</strong>
                      {descripcionLimpia && (
                        <span
                          className="small ms-2 d-none d-md-inline"
                          style={{ color: seleccionado ? '#30533f' : '#6c757d' }}
                        >
                          — {descripcionLimpia.length > 60
                            ? descripcionLimpia.substring(0, 60) + '...'
                            : descripcionLimpia}
                        </span>
                      )}
                    </div>
                    <span className="fw-bold">
                      {servicio.precioReferencial != null ? formatearPrecio(servicio.precioReferencial) : ''}
                    </span>
                  </div>
                  {servicio.modalidad && (
                    <small
                      className={seleccionado ? 'fw-semibold' : 'text-muted'}
                      style={seleccionado ? { color: '#0f5132' } : undefined}
                    >
                      <i className="bi bi-geo-alt me-1" aria-hidden="true" />
                      {servicio.modalidad}
                    </small>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {servicioSeleccionado && (
        <section className="servigo-selected-service mb-4">
          <div className="servigo-selected-service__body">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
              <div>
                <h5 className="servigo-selected-service__title mb-2">
                  {servicioSeleccionado.nombre}
                </h5>
                <span className="servigo-selected-service__eyebrow">
                  Acerca del servicio
                </span>
              </div>
              {servicioSeleccionado.modalidad && (
                <span className="servigo-selected-service__mode align-self-md-start">
                  <i className="bi bi-geo-alt me-1" aria-hidden="true" />
                  {servicioSeleccionado.modalidad}
                </span>
              )}
            </div>

            <p className="servigo-selected-service__description mb-4">
              {descripcionServicioSeleccionado || `Servicio de ${servicioSeleccionado.nombre} ofrecido por ${prestador.nombre}.`}
            </p>

            <div className="servigo-selected-service__meta">
              <div className="servigo-selected-service__meta-item">
                <span className="servigo-selected-service__icon" aria-hidden="true">
                  <i className="bi bi-clock" />
                </span>
                <div>
                  <strong>Duración estimada</strong>
                  <span>{duracionEstimada} minutos</span>
                </div>
              </div>

              <div className="servigo-selected-service__meta-item">
                <span className="servigo-selected-service__icon" aria-hidden="true">
                  <i className="bi bi-tag" />
                </span>
                <div>
                  <strong>Precio referencial</strong>
                  <span className="servigo-selected-service__price">
                    {formatearPrecio(servicioSeleccionado.precioReferencial ?? precioReferencial)}
                  </span>
                  <small>El precio final puede variar según la modalidad del servicio.</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {disponibilidades.length > 0 && (
        <section className="mb-4 p-3 rounded-3 bg-light border">
          <h6 className="servigo-booking-subtitle small fw-bold text-success mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-calendar-check-fill" aria-hidden="true" />
            Horarios de atención disponibles
            {servicioSeleccionado && (
              <> para <em>{servicioSeleccionado.nombre}</em></>
            )}
          </h6>
          <div className="d-flex flex-column gap-2">
            {disponibilidades.filter((regla) => !regla.excluido).map((regla, idx) => (
              <div
                key={`${regla.diaSemana}-${regla.horaInicio}-${idx}`}
                className="d-flex align-items-center justify-content-between p-2 bg-white rounded-2 border-1"
              >
                <div className="d-flex align-items-center gap-2">
                  <div className="text-success fw-bold" style={{ minWidth: '120px' }}>
                    {etiquetaDiaRecurrente(regla.diaSemana)}
                  </div>
                </div>
                <div className="text-muted small fw-semibold">
                  <i className="bi bi-clock-history me-1 text-success" aria-hidden="true" />
                  {regla.horaInicio} – {regla.horaFin}
                </div>
              </div>
            ))}
          </div>
          <p className="small text-secondary mt-3 mb-0">
            <i className="bi bi-info-circle me-1" aria-hidden="true" />
            Los horarios mostrados se repiten cada semana según la disponibilidad del especialista.
          </p>
        </section>
      )}

      <form onSubmit={handleContinuar}>
        <section className="mb-4">
          <label className="form-label small fw-bold text-secondary d-flex align-items-center mb-3">
            <span className="servigo-booking-step-num" aria-hidden="true">
              1
            </span>
            Selecciona la fecha
          </label>

          <div className="servigo-week-picker border rounded-3 p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle servigo-week-nav"
                onClick={irSemanaAnterior}
                disabled={!puedeSemanaAnterior}
                aria-label="Semana anterior"
              >
                <i className="bi bi-chevron-left" aria-hidden="true" />
              </button>
              <span className="small fw-semibold text-center px-2">
                Semana del {formatRangoSemana(inicioSemana, finSemana)}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle servigo-week-nav"
                onClick={irSemanaSiguiente}
                disabled={!puedeSemanaSiguiente}
                aria-label="Semana siguiente"
              >
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </button>
            </div>

            <div className="row g-2">
              {diasSemanaVista.map((dia) => {
                const fechaIso = toFechaIso(dia);
                const diaBackend = getDiaSemanaBackend(dia);
                const etiqueta = ETIQUETAS_DIA_CORTA[diaBackend] || diaBackend.slice(0, 3);
                const reservable = esFechaReservable(
                  fechaIso,
                  fechaMinString,
                  fechaMaxString,
                  disponibilidades
                );
                const selected = fechaSeleccionada === fechaIso;

                return (
                  <div key={fechaIso} className="col">
                    <button
                      type="button"
                      className={`servigo-week-day w-100 ${selected ? 'servigo-week-day--selected' : ''} ${
                        reservable ? '' : 'servigo-week-day--disabled'
                      }`}
                      disabled={!reservable}
                      onClick={() => seleccionarFecha(fechaIso)}
                      aria-pressed={selected}
                    >
                      <span className="servigo-week-day__label">{etiqueta}</span>
                      <span className="servigo-week-day__num">{dia.getDate()}</span>
                      {reservable ? (
                        selected && (
                          <span className="servigo-week-day__dot" aria-hidden="true" />
                        )
                      ) : (
                        <span className="servigo-week-day__muted">No disponible</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {proximasFechas.length > 0 && (
            <div>
              <p className="small fw-semibold text-secondary mb-2">Próximas fechas disponibles</p>
              <div className="servigo-fechas-scroll d-flex gap-2 pb-1">
                {proximasFechas.map((fechaIso) => (
                  <button
                    key={fechaIso}
                    type="button"
                    className={`servigo-fecha-chip ${fechaSeleccionada === fechaIso ? 'servigo-fecha-chip--selected' : ''}`}
                    onClick={() => seleccionarFecha(fechaIso)}
                  >
                    {formatFechaChip(fechaIso)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mb-4">
          <label className="form-label small fw-bold text-secondary d-flex align-items-center mb-2">
            <span className="servigo-booking-step-num" aria-hidden="true">
              2
            </span>
            Selecciona el horario
          </label>
          {fechaSeleccionada ? (
            <p className="small text-muted mb-3">
              <i className="bi bi-calendar-event me-1 text-success" aria-hidden="true" />
              {formatFechaHorarioTitulo(fechaSeleccionada)}
            </p>
          ) : (
            <p className="small text-muted mb-3">
              <i className="bi bi-calendar-check me-1 text-warning" aria-hidden="true" />
              Primero elige una fecha disponible.
            </p>
          )}

          <div className="row g-2">
            {horariosDisponibles.map((hora) => {
              const horaPasada = isHoraPasada(
                fechaSeleccionada,
                hora,
                fechaHoyString,
                horaActualString
              );
              const disponible = Boolean(fechaSeleccionada) && !horaPasada;
              return (
                <div key={hora} className="col-6 col-md-4 col-lg-3">
                  <button
                    type="button"
                    className={`btn w-100 py-2 rounded-3 fw-semibold servigo-transition servigo-booking-hour ${
                      horaSeleccionada === hora
                        ? 'btn-success text-white'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setHoraSeleccionada(hora)}
                    disabled={!disponible}
                    title={!disponible ? 'Este horario no está disponible' : `Seleccionar ${hora}`}
                  >
                    <i className="bi bi-clock-history me-1" aria-hidden="true" />
                    {hora} hrs
                  </button>
                </div>
              );
            })}
          </div>

          {!fechaSeleccionada && horariosDisponibles.length === 0 && (
            <div className="alert alert-light border text-center py-3 mt-3 mb-0">
              <p className="small text-muted mb-0">
                <i className="bi bi-info-circle me-1" aria-hidden="true" />
                Selecciona una fecha para ver los horarios disponibles.
              </p>
            </div>
          )}

          {fechaSeleccionada && horariosDisponibles.length === 0 && (
            <div className="alert alert-warning border text-center py-3 mt-3 mb-0">
              <p className="small mb-0">
                <i className="bi bi-exclamation-triangle me-1" aria-hidden="true" />
                No hay horarios disponibles para esta fecha. Intenta con otra fecha.
              </p>
            </div>
          )}
        </section>

        <div className="servigo-booking-help rounded-3 p-3 mb-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          <p className="small text-muted mb-0">
            ¿No encuentras un horario que te acomode? Escríbele al especialista.
          </p>
          <Link to="/soporte" className="btn btn-outline-success btn-sm fw-semibold text-nowrap">
            Enviar mensaje
          </Link>
        </div>

        <div className="servigo-booking-footer d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-3 pt-3 border-top">
          <div>
            <span className="servigo-profile-price__label d-block">DESDE</span>
            <span className="servigo-profile-price__value fs-5">
              {formatearPrecio(
                servicioSeleccionado?.precioReferencial ?? precioReferencial
              )}
            </span>
          </div>
          <div className="text-sm-end">
            <button
              type="submit"
              className="btn servigo-booking-confirm text-white px-5 py-2"
              disabled={submitting || !fechaSeleccionada || !horaSeleccionada}
            >
              {submitting ? 'Registrando...' : 'Continuar'}
            </button>
            <p className="servigo-booking-secure mb-0 mt-2">
              <i className="bi bi-lock-fill me-1" aria-hidden="true" />
              Tu información está segura con ServiGo
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
