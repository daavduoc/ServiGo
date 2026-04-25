import React from 'react';
import '../../App.css'; 

export const CardContainer = ({ titulo, children }) => {
    return (
        <div className="servigo-card shadow-sm p-4 rounded bg-white">
            {/* Si el título existe, lo dibuja; si no, lo omite */}
            {titulo && (
                <h2 className="text-center mb-4 text-servigo-title fw-bold">
                    {titulo}
                </h2>
            )}
            
            {/* children = Renderiza cualquier contenido (formularios, texto, etc.) enviado al componente */}
            {children}
        </div>
    );
};