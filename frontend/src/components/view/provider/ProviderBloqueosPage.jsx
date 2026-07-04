import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CardContainer } from '../../ui/CardContainer';
import { getTodosLosServicios } from '../../../serviceFront/servicioService';
import {
  actualizarBloqueoDisponibilidad,
  crearBloqueoDisponibilidad,
  eliminarBloqueoDisponibilidad,
  listarBloqueosPorServicio,
} from '../../../serviceFront/bloqueoDisponibilidadService';
import '../../../assets/css/provider-views.css';

const FORM_INICIAL = {
  fecha: '',
  tipo: 'DIA_COMPLETO',
  horaInicio: '',
  horaFin: '',
  motivo: '',
};

const normalizarHoraInput = (hora) => (hora ? hora.substring(0, 5) : '');
const horaParaApi = (hora) => (hora ? `${hora}:00` : null);

const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

const formatearHorario = (bloqueo) => {
  if (bloqueo.tipo === 'DIA_COMPLETO') return 'Todo el dia';
  return `${normalizarHoraInput(bloqueo.horaInicio)} - ${normalizarHoraInput(bloqueo.horaFin)}`;
};

const etiquetaTipo = (tipo) => (tipo === 'DIA_COMPLETO' ? 'Dia completo' : 'Intervalo horario');

export const ProviderBloqueosPage = () => {
  const { user } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [idServicioSeleccionado, setIdServicioSeleccionado] = useState('');
  const [bloqueos, setBloqueos] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [loadingBloqueos, setLoadingBloqueos] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [bloqueoEditando, setBloqueoEditando] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');

  const servicioSeleccionado = useMemo(
    () => servicios.find((srv) => String(srv.idServicio) === String(idServicioSeleccionado)),
    [servicios, idServicioSeleccionado]
  );

  const cargarServicios = useCallback(async () => {
    if (!user?.idUsuario) return;

    try {
      setLoadingServicios(true);
      setErrorMsg('');
      const todos = await getTodosLosServicios();
      const misServicios = todos.filter(
        (srv) => srv.prestador?.usuario?.idUsuario === user.idUsuario
      );

      setServicios(misServicios);
      setIdServicioSeleccionado((actual) => {
        if (actual && misServicios.some((srv) => String(srv.idServicio) === String(actual))) {
          return actual;
        }
        return misServicios[0]?.idServicio ? String(misServicios[0].idServicio) : '';
      });
    } catch (err) {
      setErrorMsg(err.message || 'Error al obtener tus servicios.');
    } finally {
      setLoadingServicios(false);
    }
  }, [user?.idUsuario]);

  const cargarBloqueos = useCallback(async () => {
    if (!idServicioSeleccionado) {
      setBloqueos([]);
      return;
    }

    try {
      setLoadingBloqueos(true);
      setErrorMsg('');
      const data = await listarBloqueosPorServicio(idServicioSeleccionado);
      const ordenados = [...data].sort((a, b) => {
        const fechaCompare = (a.fecha || '').localeCompare(b.fecha || '');
        if (fechaCompare !== 0) return fechaCompare;
        return (a.horaInicio || '').localeCompare(b.horaInicio || '');
      });
      setBloqueos(ordenados);
    } catch (err) {
      setErrorMsg(err.message || 'Error al cargar los bloqueos.');
    } finally {
      setLoadingBloqueos(false);
    }
  }, [idServicioSeleccionado]);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  useEffect(() => {
    cargarBloqueos();
  }, [cargarBloqueos]);

  const limpiarMensajes = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setFormError('');
  };

  const abrirCrear = () => {
    limpiarMensajes();
    setBloqueoEditando(null);
    setForm(FORM_INICIAL);
    setModalAbierto(true);
  };

  const abrirEditar = (bloqueo) => {
    limpiarMensajes();
    setBloqueoEditando(bloqueo);
    setForm({
      fecha: bloqueo.fecha || '',
      tipo: bloqueo.tipo || 'DIA_COMPLETO',
      horaInicio: normalizarHoraInput(bloqueo.horaInicio),
      horaFin: normalizarHoraInput(bloqueo.horaFin),
      motivo: bloqueo.motivo || '',
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (submitting) return;
    setModalAbierto(false);
    setBloqueoEditando(null);
    setForm(FORM_INICIAL);
    setFormError('');
  };

  const actualizarCampo = (campo, valor) => {
    setFormError('');
    setForm((actual) => {
      const siguiente = { ...actual, [campo]: valor };
      if (campo === 'tipo' && valor === 'DIA_COMPLETO') {
        siguiente.horaInicio = '';
        siguiente.horaFin = '';
      }
      return siguiente;
    });
  };

  const validarFormulario = () => {
    if (!idServicioSeleccionado) return 'Selecciona un servicio antes de crear un bloqueo.';
    if (!form.fecha) return 'Selecciona una fecha.';
    if (!form.motivo.trim()) return 'Ingresa el motivo del bloqueo.';

    if (form.tipo === 'INTERVALO') {
      if (!form.horaInicio || !form.horaFin) {
        return 'Para un intervalo debes indicar hora de inicio y hora de fin.';
      }
      if (form.horaFin <= form.horaInicio) {
        return 'La hora de fin debe ser mayor que la hora de inicio.';
      }
    }

    return '';
  };

  const construirPayload = () => ({
    fecha: form.fecha,
    tipo: form.tipo,
    motivo: form.motivo.trim(),
    ...(form.tipo === 'INTERVALO'
      ? {
          horaInicio: horaParaApi(form.horaInicio),
          horaFin: horaParaApi(form.horaFin),
        }
      : {}),
  });

  const guardarBloqueo = async (e) => {
    e.preventDefault();
    const error = validarFormulario();
    if (error) {
      setFormError(error);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      const payload = construirPayload();

      if (bloqueoEditando) {
        await actualizarBloqueoDisponibilidad(bloqueoEditando.idBloqueo, payload);
        setSuccessMsg('Bloqueo actualizado correctamente.');
      } else {
        await crearBloqueoDisponibilidad(idServicioSeleccionado, payload);
        setSuccessMsg('Bloqueo creado correctamente.');
      }

      setModalAbierto(false);
      setBloqueoEditando(null);
      setForm(FORM_INICIAL);
      await cargarBloqueos();
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar el bloqueo.');
    } finally {
      setSubmitting(false);
    }
  };

  const eliminarBloqueo = async (bloqueo) => {
    const confirmado = window.confirm(`Eliminar el bloqueo del ${formatearFecha(bloqueo.fecha)}?`);
    if (!confirmado) return;

    try {
      setErrorMsg('');
      setSuccessMsg('');
      await eliminarBloqueoDisponibilidad(bloqueo.idBloqueo);
      setSuccessMsg('Bloqueo eliminado correctamente.');
      await cargarBloqueos();
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo eliminar el bloqueo.');
    }
  };

  return (
    <CardContainer maxwidth="1120px">
      <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-calendar-x-fill text-success me-2" aria-hidden="true" />
            Bloqueos de disponibilidad
          </h2>
          <p className="text-muted mb-0 small">
            Bloquea fechas u horarios puntuales en los que no atenderas un servicio.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-success text-white fw-bold shadow-sm rounded-pill px-4"
          onClick={abrirCrear}
          disabled={!idServicioSeleccionado || loadingServicios}
        >
          <i className="bi bi-plus-lg me-2" />
          Agregar bloqueo
        </button>
      </div>

      {successMsg && <div className="alert alert-success text-center fw-bold shadow-sm mb-4">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger text-center fw-bold shadow-sm mb-4">{errorMsg}</div>}

      {loadingServicios ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando servicios...</span>
          </div>
        </div>
      ) : servicios.length === 0 ? (
        <div className="pv-empty-state">
          <i className="bi bi-briefcase" aria-hidden="true" />
          <h5 className="fw-bold text-dark">No tienes servicios publicados</h5>
          <p className="text-muted small mb-0">
            Primero registra un servicio para poder administrar sus bloqueos de disponibilidad.
          </p>
        </div>
      ) : (
        <>
          <div className="pv-card provider-blocks-selector mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-lg-7">
                <label className="form-label small fw-bold text-muted">Servicio</label>
                <select
                  className="form-select"
                  value={idServicioSeleccionado}
                  onChange={(e) => {
                    setSuccessMsg('');
                    setErrorMsg('');
                    setIdServicioSeleccionado(e.target.value);
                  }}
                >
                  {servicios.map((srv) => (
                    <option key={srv.idServicio} value={srv.idServicio}>
                      {srv.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-5">
                <div className="provider-blocks-service-summary">
                  <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                    {servicioSeleccionado?.estado || 'activo'}
                  </span>
                  <div>
                    <strong>{servicioSeleccionado?.nombre}</strong>
                    <small className="d-block text-muted">
                      {servicioSeleccionado?.modalidad || 'Modalidad no indicada'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pv-card p-0 overflow-hidden">
            <div className="provider-blocks-table-head">
              <div>
                <h5 className="fw-bold mb-1">Bloqueos del servicio</h5>
                <p className="text-muted small mb-0">
                  Estos bloqueos son excepciones puntuales, no horarios semanales de atencion.
                </p>
              </div>
              <span className="provider-blocks-count">{bloqueos.length}</span>
            </div>

            {loadingBloqueos ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando bloqueos...</span>
                </div>
              </div>
            ) : bloqueos.length === 0 ? (
              <div className="pv-empty-state">
                <i className="bi bi-calendar2-check" aria-hidden="true" />
                <h5 className="fw-bold text-dark">Sin bloqueos registrados</h5>
                <p className="text-muted small mb-4">
                  Este servicio no tiene fechas u horarios bloqueados.
                </p>
                <button type="button" className="btn btn-outline-success rounded-pill px-4 fw-bold" onClick={abrirCrear}>
                  <i className="bi bi-plus-lg me-2" />
                  Agregar bloqueo
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 provider-blocks-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Horario</th>
                      <th>Motivo</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloqueos.map((bloqueo) => (
                      <tr key={bloqueo.idBloqueo}>
                        <td className="fw-semibold text-dark">{formatearFecha(bloqueo.fecha)}</td>
                        <td>
                          <span className={`badge rounded-pill px-3 py-2 ${
                            bloqueo.tipo === 'DIA_COMPLETO'
                              ? 'bg-success-subtle text-success'
                              : 'bg-primary-subtle text-primary'
                          }`}>
                            {etiquetaTipo(bloqueo.tipo)}
                          </span>
                        </td>
                        <td>{formatearHorario(bloqueo)}</td>
                        <td className="text-muted">{bloqueo.motivo || '-'}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2 provider-blocks-actions">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success rounded-pill px-3"
                              onClick={() => abrirEditar(bloqueo)}
                            >
                              <i className="bi bi-pencil me-1" />
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-pill px-3"
                              onClick={() => eliminarBloqueo(bloqueo)}
                            >
                              <i className="bi bi-trash me-1" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {modalAbierto && (
        <div
          className="modal fade show d-block provider-blocks-modal"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.48)', zIndex: 1055 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg overflow-hidden">
              <div className="modal-header py-3">
                <h5 className="modal-title fw-bold text-white">
                  <i className="bi bi-calendar-x me-2" />
                  {bloqueoEditando ? 'Editar bloqueo' : 'Nuevo bloqueo'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={cerrarModal}
                  disabled={submitting}
                />
              </div>

              <form onSubmit={guardarBloqueo}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Servicio</label>
                    <input
                      type="text"
                      className="form-control"
                      value={servicioSeleccionado?.nombre || ''}
                      disabled
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Fecha</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.fecha}
                        onChange={(e) => actualizarCampo('fecha', e.target.value)}
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Tipo de bloqueo</label>
                      <select
                        className="form-select"
                        value={form.tipo}
                        onChange={(e) => actualizarCampo('tipo', e.target.value)}
                        disabled={submitting}
                      >
                        <option value="DIA_COMPLETO">Dia completo</option>
                        <option value="INTERVALO">Intervalo horario</option>
                      </select>
                    </div>
                  </div>

                  {form.tipo === 'INTERVALO' && (
                    <div className="row g-3 mt-1">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Hora inicio</label>
                        <input
                          type="time"
                          className="form-control"
                          value={form.horaInicio}
                          onChange={(e) => actualizarCampo('horaInicio', e.target.value)}
                          disabled={submitting}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Hora fin</label>
                        <input
                          type="time"
                          className="form-control"
                          value={form.horaFin}
                          onChange={(e) => actualizarCampo('horaFin', e.target.value)}
                          disabled={submitting}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <label className="form-label small fw-bold text-muted">Motivo</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.motivo}
                      onChange={(e) => actualizarCampo('motivo', e.target.value)}
                      placeholder="Ej: Vacaciones, reunion, tramite"
                      disabled={submitting}
                      required
                    />
                  </div>

                  {formError && (
                    <div className="alert alert-danger py-2 small mt-3 mb-0">
                      <i className="bi bi-exclamation-triangle-fill me-2" />
                      {formError}
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0 pt-0 px-4 pb-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 fw-bold"
                    onClick={cerrarModal}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success px-4 fw-bold text-white"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </CardContainer>
  );
};
