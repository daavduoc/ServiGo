// modal para el registro biometrico, almacena  la foto capturada y los datos para almacenar 
import React, { useEffect, useState } from 'react';
import { CameraCapture } from './CameraCapture';

export const BiometricCaptureModal = ({ isOpen, onClose, onConfirm, onReject }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [stage, setStage] = useState('intro');

  useEffect(() => {
    if (!isOpen) {
      setCapturedPhoto(null);
      setStage('intro');
    }
  }, [isOpen]);

  const handleAccept = () => setStage('capture');

  const handleReject = () => {
    setCapturedPhoto(null);
    setStage('intro');
    if (typeof onClose === 'function') onClose();
    if (typeof onReject === 'function') onReject();
  };

  const handleCancelCapture = () => {
    setCapturedPhoto(null);
    setStage('intro');
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onConfirm(capturedPhoto);
      setCapturedPhoto(null);
      setStage('intro');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="biometric-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,
        padding: '1rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="biometric-modal-card bg-white rounded-4 shadow-lg overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="bg-primary text-white p-4" style={{ position: 'relative' }}>
          <h4 className="mb-1">Foto biométrica</h4>
          <p className="mb-0 small opacity-90">
            Esta foto es privada y solo se usará para validar tu identidad. Nadie más la verá.
          </p>
          <button
            type="button"
            onClick={handleReject}
            className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-3"
            aria-label="Cerrar modal de foto biométrica"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="p-4 overflow-auto" style={{ flex: 1 }}>
          {stage === 'intro' ? (
            <>
              <p className="small text-muted mb-4">
                Para continuar con el registro, debes aceptar capturar una foto de tu rostro. Esta imagen no reemplaza tu foto de perfil.
              </p>
              <div className="d-flex flex-column gap-2">
                <button type="button" className="btn btn-success" onClick={handleAccept}>
                  Aceptar
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleReject}>
                  Rechazar
                </button>
              </div>
            </>
          ) : (
            <>
              {!capturedPhoto ? (
                <>
                  <p className="small text-muted mb-4">
                    Mantén tu rostro dentro del marco y presiona el botón de la cámara para capturar la foto.
                  </p>
                  <CameraCapture onCapture={setCapturedPhoto} />
                  <div className="d-flex justify-content-between gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={handleCancelCapture}
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={handleReject}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-3">
                    <p className="fw-semibold mb-2">Revisa tu foto</p>
                    <img
                      src={capturedPhoto}
                      alt="Vista previa biométrica"
                      className="img-fluid rounded-4 shadow-sm"
                      style={{ width: '260px', height: '260px', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />
                  </div>
                  <p className="small text-muted mb-3">
                    Si no te gusta la foto, puedes volver a tomarla. Si está bien, confirma para guardarla.
                  </p>
                  <div className="d-flex justify-content-between gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => setCapturedPhoto(null)}
                    >
                      Repetir
                    </button>
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={handleConfirm}
                    >
                      Confirmar foto
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
