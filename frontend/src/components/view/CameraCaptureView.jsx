import React, { useState } from 'react';
// Importamos tu componente de cámara con llaves
import { CameraCapture } from '../camera/CameraCapture';

export const CameraCaptureView = ({ modo = 'perfil', onExito }) => {

    // Estado para guardar la foto. Inicia vacío (null)
    const [fotoCapturada, setFotoCapturada] = useState(null);
    const [cargando, setCargando] = useState(false);

    const titulos = {
        registro: "Registro Biométrico Inicial",
        perfil: "Actualizar Foto de Perfil",
        verificacion: "Validación de Seguridad"
    };

    // Esta función recibe la imagen SOLO cuando el usuario apretó el botón en CameraCapture
    const manejarCaptura = (imagenBase64) => {
        setFotoCapturada(imagenBase64);
    };

    // Función para enviar a Java
    const enviarAlBackend = async () => {
        // SEGURO ANTIFALLOS: Si no hay foto, detenemos todo aquí mismo.
        if (!fotoCapturada) {
            console.error("Intento de envío sin foto.");
            return;
        }

        setCargando(true);

        try {
            // Obtenemos la parte del string que contiene solo los datos de la imagen (quitamos el "data:image/jpeg;base64,")
            const partes = fotoCapturada.split(',');
            if (partes.length < 2) {
                throw new Error("El formato de la imagen no es válido");
            }

            const base64Puro = partes[1];

            const payload = {
                fotoBase64: base64Puro,
                tipoOperacion: modo,
                fecha: new Date().toISOString()
            };

            console.log(`Enviando a Java (Modo: ${modo}):`, payload);

            // Simulación de éxito (Aquí irá tu fetch al backend)
            setTimeout(() => {
                alert(`¡Proceso de ${modo} completado con éxito!`);
                setCargando(false);
                setFotoCapturada(null); // Limpiamos la pantalla
                if (onExito) onExito();
            }, 1000);

        } catch (error) {
            console.error("Error al procesar la imagen:", error);
            setCargando(false);
        }
    };

    return (
        <div className="container py-4 d-flex justify-content-center">
            <div className="card border-0 shadow-lg" style={{ maxWidth: '450px', width: '100%', borderRadius: '20px' }}>

                <div className="bg-primary p-3 text-white text-center" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                    <h5 className="mb-0">{titulos[modo]}</h5>
                </div>

                <div className="card-body p-4 text-center">

                    {/* Si NO hay foto, muestra la cámara. Si la HAY, muestra la vista previa */}
                    {!fotoCapturada ? (
                        <>
                            <p className="text-muted mb-4 small">
                                Ubique su rostro dentro del marco y presione el botón para capturar.
                            </p>
                            <CameraCapture onCapture={manejarCaptura} />
                        </>
                    ) : (
                        <div className="animate__animated animate__fadeIn">
                            <h6 className="text-success mb-3"><i className="bi bi-check-circle-fill"></i> ¡Captura exitosa!</h6>

                            <img
                                src={fotoCapturada}
                                alt="Vista previa"
                                className="img-thumbnail rounded-4 mb-4 shadow-sm"
                                style={{ width: '250px', height: '250px', objectFit: 'cover', transform: 'scaleX(-1)' }}
                            />

                            <div className="d-flex justify-content-center gap-3">
                                {/* Botón para cancelar (borra la foto y vuelve a encender la cámara) */}
                                <button
                                    className="btn btn-outline-secondary px-4 rounded-pill"
                                    onClick={() => setFotoCapturada(null)}
                                    disabled={cargando}
                                >
                                    Repetir
                                </button>

                                {/* Botón para enviar */}
                                <button
                                    className="btn btn-success px-4 rounded-pill shadow-sm"
                                    onClick={enviarAlBackend}
                                    disabled={cargando}
                                >
                                    {cargando ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : (
                                        <i className="bi bi-cloud-upload me-2"></i>
                                    )}
                                    {modo === 'verificacion' ? 'Validar' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};