// Componente de modales para la sección de perfil, incluyendo cambio de contraseña, preferencias de notificaciones y eliminación de cuenta, con diseño moderno y funcionalidad de cierre
import React from 'react';

export const ProfileModals = ({ modals, toggleModal }) => {
  return (
    <>
      {/* MODAL: CAMBIAR CONTRASEÑA */}
      {modals.password && (
        <div className="modal d-block custom-modal-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-lock text-success" aria-hidden="true" /> Cambiar Contraseña
                </h5>
                <button onClick={() => toggleModal('password', false)} className="btn-close"></button>
              </div>
              <div className="modal-body py-4">
                <label className="form-label small fw-bold text-muted">Contraseña Actual</label>
                <input type="password" placeholder="Ingresa tu contraseña actual" className="form-control mb-3 rounded-pill px-3 py-2" />
                
                <label className="form-label small fw-bold text-muted">Nueva Contraseña</label>
                <input type="password" placeholder="Ingresa la nueva contraseña" className="form-control mb-3 rounded-pill px-3 py-2" />
                
                <label className="form-label small fw-bold text-muted">Confirmar Nueva Contraseña</label>
                <input type="password" placeholder="Repite la nueva contraseña" className="form-control rounded-pill px-3 py-2" />
              </div>
              <div className="modal-footer border-0 pt-0">
                <button onClick={() => toggleModal('password', false)} className="btn btn-light rounded-pill px-4 fw-medium">Cancelar</button>
                <button onClick={() => toggleModal('password', false)} className="btn btn-success rounded-pill px-4 fw-bold">Actualizar Clave</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREFERENCIAS NOTIFICACIONES */}
      {modals.notifications && (
        <div className="modal d-block custom-modal-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-bell text-success" aria-hidden="true" /> Mis Notificaciones
                </h5>
                <button onClick={() => toggleModal('notifications', false)} className="btn-close"></button>
              </div>
              <div className="modal-body py-4">
                <p className="text-muted small mb-4">Elige cómo quieres que ServiGo se comunique contigo.</p>
                <div className="form-check form-switch mb-3 d-flex align-items-center gap-2">
                  <input className="form-check-input fs-5 mt-0" type="checkbox" defaultChecked />
                  <label className="form-check-label fw-medium">Notificaciones por Correo Electrónico</label>
                </div>
                <div className="form-check form-switch d-flex align-items-center gap-2">
                  <input className="form-check-input fs-5 mt-0" type="checkbox" />
                  <label className="form-check-label fw-medium">Alertas SMS a mi teléfono</label>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button onClick={() => toggleModal('notifications', false)} className="btn btn-success rounded-pill w-100 fw-bold py-2">Guardar Preferencias</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ELIMINAR CUENTA */}
      {modals.delete && (
        <div className="modal d-block custom-modal-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <button onClick={() => toggleModal('delete', false)} className="btn-close"></button>
              </div>
              <div className="modal-body text-center p-4 pt-0">
                <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block" aria-hidden="true" />
                <h4 className="fw-bold text-danger mb-3">Zona de Peligro</h4>
                <h6 className="fw-bold text-dark">¿Estás segura de eliminar tu cuenta?</h6>
                <p className="text-muted small mt-2">Esta acción es permanente y borrará todo tu historial de servicios, reservas y mensajes en ServiGo.</p>
              </div>
              <div className="modal-footer border-0 justify-content-center bg-light rounded-bottom-4">
                <button onClick={() => toggleModal('delete', false)} className="btn btn-secondary rounded-pill px-4 fw-medium">Me arrepentí</button>
                <button onClick={() => toggleModal('delete', false)} className="btn btn-danger rounded-pill px-4 fw-bold">Sí, Eliminar Todo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};