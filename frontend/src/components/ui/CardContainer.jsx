import React from 'react';
import '../../App.css'; 

export const CardContainer = ({ titulo, children, maxWidth = '900px' }) => {
    return (
        /* ' card container responsivo*/
        <div className="container-fluid px-2 px-md-4">
            <div 
                className="servigo-card shadow-sm p-3 p-md-5 rounded bg-white mx-auto border-0" 
                style={{ 
                    maxWidth: maxWidth, 
                    width: '100%', // elemento que ajusta la vista al celular
                    marginTop: '1.5rem' 
                }}
            >
                {titulo && (
                    /* ajuste del titulo en celular*/
                    <h2 className="text-center mb-4 text-servigo-title fw-bold fs-3 fs-md-2">
                        {titulo}
                    </h2>
                )}
                
                {children}
            </div>
        </div>
    ); 
};