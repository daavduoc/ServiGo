//pagina para que el prestador de servicio controle sus servicios generados
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { CardContainer } from '../../ui/CardContainer';
import {
  getTodosLosServicios,
  actualizarServicioCompleto,
  eliminarServicio
} from '../../../serviceFront/servicioService';
import '../../../assets/css/provider-views.css';

export const ProviderGestionarServiciosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados para el Modal de Edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editModalidad, setEditModalidad] = useState('Domicilio');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cargarServicios = useCallback(async () => {
    if (!user?.idUsuario) return;
    try {
      setLoading(true);
      setErrorMsg('');
      const todos = await getTodosLosServicios();
      
      // Filtramos en el cliente para mostrar solo los servicios que pertenecen a este prestador
      const misServicios = todos.filter(
        (srv) => srv.prestador?.usuario?.idUsuario === user.idUsuario
      );
      
      setServicios(misServicios);
    } catch (err) {
      setErrorMsg(err.message || 'Error al obtener tus servicios.');
    } finally {
      setLoading(false);
    }
  }, [user?.idUsuario]);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  // Alternar Activo / Inactivo de un servicio
  const handleToggleEstado = async (servicio) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const nuevoEstado = servicio.estado === 'activo' ? 'inactivo' : 'activo';
      
      const payload = {
        ...servicio,
        estado: nuevoEstado
      };

      await actualizarServicioCompleto(servicio.idServicio, payload);
      setSuccessMsg(`El estado del servicio "${servicio.nombre}" ha sido actualizado.`);
      cargarServicios();
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo cambiar el estado del servicio.');
    }
  };

  // Abrir Modal de Edición
  const handleOpenEdit = (servicio) => {
    setEditingServicio(servicio);
    setEditNombre(servicio.nombre);
    setEditPrecio(servicio.precioReferencial);
    setEditModalidad(servicio.modalidad || 'Domicilio');
    setEditDescripcion(servicio.descripcion);
    setShowEditModal(true);
  };

  // Guardar Cambios del Modal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingServicio) return;

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');

      // Construimos el payload manteniendo el objeto completo de especialidad y prestador que venía de base de datos
      const payload = {
        ...editingServicio,
        nombre: editNombre.trim(),
        precioReferencial: parseFloat(editPrecio),
        modalidad: editModalidad,
        descripcion: editDescripcion.trim()
      };

      await actualizarServicioCompleto(editingServicio.idServicio, payload);
      setSuccessMsg('Servicio modificado con éxito.');
      setShowEditModal(false);
      setEditingServicio(null);
      cargarServicios();
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar servicio
  const handleDelete = async (idServicio, nombre) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`)) {
      return;
    }

    try {
      setErrorMsg('');
      setSuccessMsg('');
      await eliminarServicio(idServicio);
      setSuccessMsg(`Servicio "${nombre}" eliminado correctamente.`);
      cargarServicios();
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo eliminar el servicio.');
    }
  };

  return (
    <CardContainer maxwidth="1100px">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-briefcase-fill text-success me-2" aria-hidden="true" />
            Mis Servicios Publicados
          </h2>
          <p className="text-muted mb-0 small">
            Monitorea el estado, edita o elimina los servicios del catálogo que tienes vinculados a tu cuenta.
          </p>
        </div>
        <button
          onClick={() => navigate('/prestador/ingresar-servicio')}
          className="btn btn-success text-white fw-bold shadow-sm rounded-pill px-4"
        >
          <i className="bi bi-plus-circle me-2" />
          Crear Nuevo Servicio
        </button>
      </div>

      {successMsg && <div className="alert alert-success text-center fw-bold shadow-sm mb-4">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger text-center fw-bold shadow-sm mb-4">{errorMsg}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Buscando tus servicios...</span>
          </div>
        </div>
      ) : servicios.length === 0 ? (
        <div className="pv-empty-state">
          <i className="bi bi-folder-x" aria-hidden="true" />
          <h5 className="fw-bold text-dark">No se encontraron servicios</h5>
          <p className="text-muted small mb-4">No tienes servicios registrados a tu nombre en ServiGo.</p>
          <button
            onClick={() => navigate('/prestador/ingresar-servicio')}
            className="btn btn-outline-success rounded-pill px-4"
          >
            Crear servicio ahora
          </button>
        </div>
      ) : (
        <div className="row g-4 animate__animated animate__fadeIn">
          {servicios.map((srv) => {
            const esActivo = srv.estado === 'activo';
            return (
              <div key={srv.idServicio} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className={`badge rounded-pill ${esActivo ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} px-3 py-2 fw-bold text-capitalize`}>
                        {srv.estado || 'activo'}
                      </span>
                      <span className="text-success fw-bold fs-5">
                        ${new Intl.NumberFormat('es-CL').format(srv.precioReferencial)}
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark mb-1">{srv.nombre}</h5>
                    <div className="text-muted small mb-3">
                      <span className="me-2">
                        <i className="bi bi-tag-fill text-success me-1" />
                        {srv.especialidad?.nombre || 'Especialista'}
                      </span>
                      <span>
                        <i className="bi bi-geo-alt-fill text-secondary me-1" />
                        {srv.modalidad || 'Domicilio'}
                      </span>
                    </div>

                    <p className="text-muted small flex-grow-1 mb-4" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {srv.descripcion}
                    </p>

                    <div className="border-top pt-3 mt-auto d-flex gap-2">
                      <button
                        onClick={() => handleToggleEstado(srv)}
                        className={`btn btn-sm ${esActivo ? 'btn-outline-secondary' : 'btn-success text-white'} rounded-pill flex-fill fw-bold`}
                      >
                        <i className={`bi ${esActivo ? 'bi-pause-fill' : 'bi-play-fill'} me-1`} />
                        {esActivo ? 'Pausar' : 'Activar'}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="btn btn-sm btn-outline-success rounded-pill px-3"
                      >
                        <i className="bi bi-pencil" />
                      </button>

                      <button
                        onClick={() => handleDelete(srv.idServicio, srv.nombre)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="modal d-block custom-modal-backdrop" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold mb-0">Editar Servicio</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                  disabled={submitting}
                />
              </div>
              <form onSubmit={handleSaveEdit}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Nombre del Servicio</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-bold text-muted">Precio ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editPrecio}
                        onChange={(e) => setEditPrecio(e.target.value)}
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-bold text-muted">Modalidad</label>
                      <select
                        className="form-select"
                        value={editModalidad}
                        onChange={(e) => setEditModalidad(e.target.value)}
                        disabled={submitting}
                      >
                        <option value="Domicilio">A Domicilio</option>
                        <option value="Establecido">En Establecimiento</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-bold text-muted">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowEditModal(false)}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success rounded-pill px-4 fw-bold text-white"
                    disabled={submitting}
                  >
                    {submitting ? 'Guardando...' : 'Guardar Cambios'}
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