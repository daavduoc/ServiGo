// modal para el registro biometrico y comparacion 
import { CameraCaptureView } from './CameraCaptureView'; 
import '../../assets/css/genServiceView.css'; // ruta al css

export const BiometricModal = ({ mostrar, onCerrar, onExito }) => {
  if (!mostrar) return null;

  return (
    <div 
      className="modal fade show d-block bg-dark bg-opacity-75 modal-biometrico-overlay" 
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-biometrico-dialogo">
        <div className="modal-content rounded-4 border-0 shadow-lg animate__animated animate__zoomIn animate__fast">
          
          <div className="modal-header border-0 bg-success text-white p-3 rounded-top-4">
            <h5 className="modal-title fw-bold fs-5 d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill" />
              verificación biométrica
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCerrar} />
          </div>

          <div className="modal-body p-3 bg-light rounded-bottom-4">
            <div className="text-center mb-3 px-2">
              <p className="text-secondary small mb-0">
                para poder prestar tu servicio, necesitamos validar tu identidad en tiempo real. por favor enfoca tu rostro.
              </p>
            </div>
            <CameraCaptureView modo="verificacion" onExito={() => onExito()} />
          </div>

        </div>
      </div>
    </div>
  );
};