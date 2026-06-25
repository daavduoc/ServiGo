import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

export const CameraCapture = ({ onCapture }) => {
    const webcamRef = useRef(null);
    const [error, setError] = useState(null);

    // MEJORA 1: Resolución forzada a 720x720. 
    // Al ser cuadrada y de alta resolución, la captura coincide exactamente 
    // con lo que ve el usuario en el visor 1:1, dándole al backend una imagen nítida.
    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: "user" 
    };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                onCapture(imageSrc);
            }
        }
    }, [webcamRef, onCapture]);

    const handleUserMediaError = useCallback((err) => {
        console.error("Error de cámara:", err);
        setError(err.toString());
    }, []);

    return (
        <div className="d-flex flex-column align-items-center w-100">

            {/* MEJORA 3: Tarjeta de consejos para mejorar la captura biométrica */}
            <div className="alert alert-info w-100 mb-3 shadow-sm" style={{ maxWidth: '350px' }}>
                <p className="mb-2 text-center" style={{ fontSize: '14px' }}>
                    💡 <strong>Consejos para la validación:</strong>
                </p>
                <ul className="mb-0 text-start" style={{ fontSize: '13px', paddingLeft: '20px' }}>
                    <li>Ubícate en un lugar con buena iluminación.</li>
                    <li>Mira directamente a la cámara.</li>
                    <li>Centra tu rostro dentro del recuadro.</li>
                </ul>
            </div>

            {/* Contenedor del visor cuadrado */}
            <div className="position-relative w-100 mb-4" style={{ maxWidth: '350px', aspectRatio: '1/1' }}>

                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={1} // MEJORA 2: Fuerza la máxima calidad de la foto (1.0)
                    videoConstraints={videoConstraints}
                    onUserMediaError={handleUserMediaError}
                    className="rounded-4 object-fit-cover shadow-lg w-100 h-100 bg-dark"
                    style={{
                        transform: 'scaleX(-1)', // Efecto espejo
                        position: 'relative',
                        zIndex: 1
                    }}
                />

                {/* Mensaje de error si falla la cámara */}
                {error && (
                    <div className="position-absolute top-50 start-50 translate-middle text-white text-center p-3 w-100" style={{ zIndex: 3 }}>
                        <i className="bi bi-exclamation-triangle-fill fs-1 text-warning mb-2"></i>
                        <p className="small mb-0">No se pudo acceder a la cámara.</p>
                        <p className="extra-small text-muted" style={{ fontSize: '10px' }}>{error}</p>
                    </div>
                )}

                {/* Capa visual: El cuadro estilo "escáner" */}
                <div className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                    style={{
                        pointerEvents: 'none', 
                        boxShadow: '0 0 0 999px rgba(0,0,0,0.4)', 
                        zIndex: 2,
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                    <div className="position-absolute top-0 start-0 border-top border-start border-primary border-4 m-2" style={{ width: '30px', height: '30px' }}></div>
                    <div className="position-absolute top-0 end-0 border-top border-end border-primary border-4 m-2" style={{ width: '30px', height: '30px' }}></div>
                    <div className="position-absolute bottom-0 start-0 border-bottom border-start border-primary border-4 m-2" style={{ width: '30px', height: '30px' }}></div>
                    <div className="position-absolute bottom-0 end-0 border-bottom border-end border-primary border-4 m-2" style={{ width: '30px', height: '30px' }}></div>
                </div>
            </div>

            {/* Botón para tomar la foto */}
            <button
                onClick={capture}
                className="btn btn-primary btn-lg rounded-circle shadow-lg d-flex align-items-center justify-content-center mb-2"
                style={{ width: '65px', height: '65px' }}
                disabled={!!error}
            >
                <i className="bi bi-camera-fill fs-3"></i>
            </button>
        </div>
    );
};