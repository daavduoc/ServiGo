// modal para la validacion biometrica
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CameraCapture } from './CameraCapture';
import { verificarFotoBiometrica, obtenerFotoBiometricaRegistro, compararRostro } from '../../serviceFront/validacionService';
import '../../assets/css/facial-validation-modal.css';

// MEJORA: Función para convertir Base64 a File (en lugar de Blob).
// Esto le da a Spring Boot un archivo real con nombre y extensión (.jpg)
const base64ToFile = (base64Data, filename = 'captura_biometrica.jpg') => {
  if (!base64Data || typeof base64Data !== 'string') return null;
  const arr = base64Data.split(',');
  if (arr.length !== 2) return null;
  const mimeMatch = arr[0].match(/data:(.*?);base64/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  // Retornamos un File, que es lo que espera MultipartFile en el backend
  return new File([u8arr], filename, { type: mime });
};

// Componente Modal para Validación Facial
export const FacialValidationModal = ({
  isOpen,
  onClose,
  onValidationSuccess,
  idUsuario,
  tipoValidacion,
  idSolicitud,
}) => {
  const { user } = useAuth();
  const [stage, setStage] = useState('loading'); // 'loading', 'no-photo', 'ready', 'comparing', 'result'
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [statusMsg, setStatusMsg] = useState('Para realizar el reconocimiento facial, por favor encienda la cámara');
  const [comparisonResult, setComparisonResult] = useState(null); // 'aprobada' o 'rechazada'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && idUsuario) {
      checkPhotoExists();
    } else {
      setStage('loading');
      setCapturedPhoto(null);
      setPhotoUrl('');
      setComparisonResult(null);
      setErrorMsg('');
      setStatusMsg('Para realizar el reconocimiento facial, por favor encienda la cámara');
    }
  }, [isOpen, idUsuario]);

  // Verificar si el usuario tiene foto biométrica registrada y obtener su URL de acceso
  const checkPhotoExists = async () => {
    try {
      setStage('loading');
      setStatusMsg('Cargando foto de registro biométrico...');
      const data = await verificarFotoBiometrica(idUsuario);

      if (data && data.existe) {
        const acceso = await obtenerFotoBiometricaRegistro(idUsuario);
        setPhotoUrl(acceso?.signedUrl || '');
        setStage('ready');
      } else {
        setStage('no-photo');
        setErrorMsg('No tienes foto biométrica registrada en el sistema. Debes registrarla antes de continuar.');
      }
    } catch (error) {
      setStage('no-photo');
      setErrorMsg(error.message || 'Error al validar foto de registro');
    }
  };

  // Manejar la foto capturada desde la cámara
  const handleCapture = async (imageSrc) => {
    setCapturedPhoto(imageSrc);
    setStage('comparing');
    setStatusMsg('Comparando rostros...');
    setErrorMsg('');

    try {
      // MEJORA: Usar la nueva función para crear un File
      const imageFile = base64ToFile(imageSrc);
      const res = await compararRostro(idUsuario, imageFile, tipoValidacion, idSolicitud);
      
      if (res && res.resultado === 'aprobada') {
        setComparisonResult('aprobada');
        setStatusMsg('Reconocimiento exitoso');
      } else {
        setComparisonResult('rechazada');
        setStatusMsg('No se pudo reconocer a la persona');
      }
      setStage('result');
    } catch (error) {
      setComparisonResult('rechazada');
      setStatusMsg('Error de comparación biométrica');
      setErrorMsg(error.message || 'Error en el servidor de validación');
      setStage('result');
    }
  };

  // Manejar el reintento de reconocimiento facial
  const handleRetry = () => {
    setCapturedPhoto(null);
    setComparisonResult(null);
    setErrorMsg('');
    setStatusMsg('Para realizar el reconocimiento facial, por favor encienda la cámara');
    setStage('ready');
  };

  if (!isOpen) return null;

  return (
    <div className="facial-modal-backdrop" role="dialog" aria-modal="true">
      <div className="facial-modal-card bg-white rounded-4 shadow-lg overflow-hidden">
        <div className="bg-success text-white p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-white">Validación de Identidad</h5>
          <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar" />
        </div>

        {/* Contenido del Modal */}
        <div className="p-4 overflow-auto" style={{ flex: 1 }}>
          {stage === 'loading' && (
            <div className="text-center py-5">
              <div className="spinner-border text-success mb-3" role="status" />
              <p className="text-muted small">Cargando foto de registro biométrico...</p>
            </div>
          )}

          {stage === 'no-photo' && (
            <div className="text-center py-4 text-danger">
              <i className="bi bi-exclamation-octagon-fill fs-1 mb-3"></i>
              <p className="fw-semibold">{errorMsg}</p>
              <button type="button" className="btn btn-outline-secondary mt-3 rounded-pill" onClick={onClose}>
                Cerrar
              </button>
            </div>
          )}

          {(stage === 'ready' || stage === 'comparing' || stage === 'result') && (
            <>
              <div className="facial-modal-grid">
                <div>
                  <label className="form-label small fw-bold text-secondary mb-2 text-uppercase">Foto de Registro</label>
                  <div className="facial-photo-container">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Registro Biométrico" className="facial-photo-img shadow-sm" />
                    ) : (
                      <span className="small text-muted text-center p-3">Foto no disponible</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="form-label small fw-bold text-secondary mb-2 text-uppercase">Cámara en Vivo</label>
                  <div className="facial-photo-container">
                    {!capturedPhoto ? (
                      <CameraCapture onCapture={handleCapture} />
                    ) : (
                      <img
                        src={capturedPhoto}
                        alt="Foto Capturada"
                        className="facial-photo-img shadow-sm"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                {stage === 'comparing' && (
                  <div className="facial-status-box facial-status-loading">
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    {statusMsg}
                  </div>
                )}

                {stage === 'result' && comparisonResult === 'aprobada' && (
                  <div className="d-flex flex-column gap-3">
                    <div className="facial-status-box facial-status-success">
                      ✅ {statusMsg}
                    </div>
                    <div>
                      <label htmlFor="inputAceptado" className="form-label small fw-bold text-muted">Estado de Validación</label>
                      <input
                        id="inputAceptado"
                        type="text"
                        className="form-control text-success fw-bold bg-success bg-opacity-10 border-success"
                        value="Reconocimiento facial aceptado"
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {stage === 'result' && comparisonResult === 'rechazada' && (
                  <div className="d-flex flex-column gap-3">
                    <div className="facial-status-box facial-status-error text-danger">
                      ❌ {statusMsg}
                    </div>
                    {errorMsg && <p className="text-center small text-danger fw-semibold">{errorMsg}</p>}
                    <button type="button" className="btn btn-outline-warning w-100 rounded-pill" onClick={handleRetry}>
                      Reintentar Reconocimiento
                    </button>
                  </div>
                )}

                {stage === 'ready' && (
                  <div className="facial-status-box facial-status-loading">
                    <i className="bi bi-camera me-2" />
                    {statusMsg}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="modal-footer border-0 bg-light p-3 gap-2">
          <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-success rounded-pill px-4 fw-bold"
            disabled={stage !== 'result' || comparisonResult !== 'aprobada'}
            onClick={onValidationSuccess}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};