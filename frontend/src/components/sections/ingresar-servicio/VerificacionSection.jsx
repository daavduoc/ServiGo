// seccion de la camara
import React, { useState } from 'react'; 
import { CameraCapture } from '../../camera/CameraCapture';

export const VerificacionSection = ({ fotoCapturada, setFotoCapturada }) => {
  const [mostrarModalCamara, setMostrarModalCamara] = useState(false);

  const handleCapturePhoto = (imagenBase64) => {
    setFotoCapturada(imagenBase64);
    setMostrarModalCamara(false);
  };

  return (
    <div className="card border-0 shadow-sm p-4 mb-4 bg-white animate__animated animate__fadeIn">
      <h4 className="profile-panel-title mb-4">
        <i className="bi bi-shield-check" />
        Validación de Seguridad
      </h4>

      <div className="d-flex align-items-center gap-4 flex-wrap flex-md-nowrap p-3 rounded bg-light border border-success border-opacity-10">
        <div>
          {fotoCapturada ? (
            <img
              src={fotoCapturada}
              alt="Foto tomada"
              className="rounded-3 shadow-sm border border-success border-2 animate__animated animate__zoomIn"
              style={{ width: '130px', height: '130px', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          ) : (
            <div 
              className="rounded-3 bg-white d-flex align-items-center justify-content-center text-muted border"
              style={{ width: '130px', height: '130px' }}
            >
              <i className="bi bi-camera fs-1"></i>
            </div>
          )}
        </div>

        <div className="flex-grow-1">
          <h5 className="fw-bold mb-1 text-dark">
            Foto de Verificación
            {!fotoCapturada && <span className="badge bg-warning text-dark ms-2" style={{ fontSize: '0.7rem' }}>Opcional</span>}
          </h5>
          <p className="text-secondary small mb-3">
            Tomarse una foto de verificación biométrica refuerza la confianza de sus clientes. Puede omitirla por ahora si lo desea.
          </p>
          <button
            type="button"
            className="btn btn-outline-success fw-bold px-3 py-2 btn-sm"
            onClick={() => setMostrarModalCamara(true)}
          >
            <i className="bi bi-camera-fill me-2"></i> Tomar foto actualizada
          </button>
        </div>
      </div>

      {/* modal de camara */}
      {mostrarModalCamara && (
        <div className="modal fade show d-block animate__animated animate__fadeIn" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg border-0 overflow-hidden">
              <div className="modal-header bg-success text-white py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-camera-fill me-2"></i> Capturar Rostro
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMostrarModalCamara(false)}
                ></button>
              </div>
              <div className="modal-body text-center p-4">
                <CameraCapture onCapture={handleCapturePhoto} />
                <p className="text-muted small mt-3 mb-0">
                  Por favor, sitúe su cara frente a la cámara y haga clic en el botón disparador.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};