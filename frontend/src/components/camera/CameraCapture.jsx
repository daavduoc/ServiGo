import React, { useRef, useCallback, useState } from 'react';
// react-webcam es una libreria que permite tomar fotos con la camara
import Webcam from 'react-webcam';

export const CameraCapture = ({ onCapture }) => {
    // nos permite acceder a los controles internos de react-webcam (tomar foto).
    const webcamRef = useRef(null);
    const [error, setError] = useState(null);

    // Configuracion de la camara, ancho, alto y modo de camara
    const videoConstraints = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user"      // "user" obliga a usar la cámara frontal pensando en el celular o tablet
    };

    // Esta es la función que se ejecuta SOLO al hacer clic en el botón de la cámara.
    const capture = useCallback(() => {
        // getScreenshot() extrae el fotograma actual y lo convierte en String Base64.
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            // Si la foto es capturada correctamente, se la enviamos al componente padre.
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

            {/* Contenedor del visor cuadrado */}
            <div className="position-relative w-100 mb-3" style={{ maxWidth: '350px', aspectRatio: '1/1' }}>

                {/* El componente real de la cámara de la librería */}
                <Webcam
                    audio={false} // Apaga el micrófono por privacidad y evitar errores
                    ref={webcamRef} // Conecta la referencia a la cámara
                    screenshotFormat="image/jpeg" // Formato de la foto resultante
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

                {/* Capa visual: El cuadro estilo "escáner" que va por encima del video */}
                <div className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                    style={{
                        pointerEvents: 'none', // Permite hacer clic "a través" de esta capa
                        boxShadow: '0 0 0 999px rgba(0,0,0,0.4)', // Oscurece el fondo fuera del cuadrado
                        zIndex: 2,
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                    <div className="position-absolute top-0 start-0 border-top border-start border-primary border-4 m-2" style={{ width: '30px', height: '30px' }}></div>
                    <div className="position-absolute top-0 end-0 border-top border-end border-primary border-4 m-2" style={{ width: '30px', height: '30px' }}></div>
                    <div className="position-absolute bottom-0 start-0 border-bottom border-start border-primary border-4 m-2" style={{ width: '30px', height: '30px' }}></div>
                    <div className="position-absolute bottom-0 end-0 border-bottom border-end border-primary border-4 m-2" style={{ width: '30px', height: '30px' }}></div>
                </div>
            </div>

            {/* Botón para tomar la foto. El onClick={capture} asegura que solo pase al presionarlo */}
            <button
                onClick={capture}
                className="btn btn-primary btn-lg rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                style={{ width: '60px', height: '60px' }}
                disabled={!!error}
            >
                <i className="bi bi-camera-fill fs-3"></i>
            </button>
        </div>
    );
};