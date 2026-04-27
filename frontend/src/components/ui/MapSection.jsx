import React from 'react';

export const MapSection = ({ label }) => {
    return (
        <div className="row mb-4">
            {/* Etiqueta lateral */}
            <label className="col-md-3 fw-bold text-secondary">
                {label || "Mapa"}
            </label>

            <div className="col-md-9">
                {/* Contenedor del Mapa con el estilo de tu foto */}
                <div 
                    className="d-flex align-items-center justify-content-center border" 
                    style={{ 
                        height: '300px', 
                        width: '100%', 
                        backgroundColor: '#fdfdfd', // Fondo casi blanco
                        borderWidth: '1px',
                        borderColor: '#ccc' 
                    }}
                >
                    {/* El cuadro interno con la X o el símbolo */}
                    <div 
                        className="d-flex align-items-center justify-content-center border"
                        style={{ 
                            width: '120px', 
                            height: '120px', 
                            backgroundColor: '#f8f9fa' 
                        }}
                    >
                        {/* Puedes poner una X roja como en tu foto o un emoji de mapa */}
                        <span style={{ fontSize: '50px', color: '#ff5c5c', fontWeight: 'light' }}>
                            ✕
                        </span>
                    </div>
                </div>
                
                {/* Texto informativo debajo (opcional, como en tu foto) */}
                <div className="mt-2">
                    <small className="text-primary" style={{ fontSize: '0.85rem' }}>
                        Se solicita ubicación para el registro de cobertura de servicio
                    </small>
                </div>
            </div>
        </div>
    );
};