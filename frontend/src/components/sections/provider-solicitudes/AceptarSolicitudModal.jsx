import React, { useEffect, useState } from 'react';

export const AceptarSolicitudModal = ({
  show,
  solicitud,
  direccionInicial,
  onClose,
  onConfirm,
  submitting,
}) => {
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    if (show) {
      setDireccion(direccionInicial || '');
    }
  }, [show, direccionInicial]);

  if (!show || !solicitud) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(direccion.trim());
  };

  return (
    <div className="modal d-block custom-modal-backdrop">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="fw-bold mb-0">Confirmar cita</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body py-4">
              <p className="text-muted small mb-3">
                Cliente: <strong>{solicitud.clienteNombre}</strong>
                <br />
                Teléfono: <strong>{solicitud.clienteTelefono || 'No registrado'}</strong>
                <br />
                Correo: <strong>{solicitud.clienteCorreo || 'No registrado'}</strong>
                <br />
                Dirección del Cliente: <strong>{solicitud.clienteDireccion || 'No registrada'}</strong>
                <hr className="my-2" />
                Servicio: <strong>{solicitud.servicioNombre}</strong>
                <br />
                Fecha: <strong>{solicitud.fechaPreferida}</strong>
              </p>
              <label htmlFor="direccionAtencion" className="form-label small fw-bold text-muted">
                Dirección de atención
              </label>
              <input
                id="direccionAtencion"
                type="text"
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Av. Principal 123, Santiago"
                required
                disabled={submitting}
              />
              <p className="form-text small mb-0">
                Indica dónde realizarás el servicio. Si ya tienes dirección en tu perfil, puedes
                ajustarla aquí.
              </p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success rounded-pill px-4 fw-bold"
                disabled={submitting}
              >
                {submitting ? 'Confirmando...' : 'Confirmar cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
