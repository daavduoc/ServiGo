import React, { useState, useRef } from 'react';
import { ButtonCustom } from './ButtonCustom';

export const PhotoUpload = ({ label = "Foto de Perfil", onImageSelect }) => {
  // muestra una miniatura (previsualización) 
  const [preview, setPreview] = useState(null);
  // Referencia para hacer clic en el input oculto
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Crear previsualización para el cuadrito
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // 2. Enviar el archivo real al componente Padre (View)
      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  };

  return (
    <div className="row mb-4 align-items-start">
      <label className="col-md-3 fw-bold text-secondary">{label}</label>
      <div className="col-md-9">
        <div className="d-flex align-items-center gap-3">

          {/* Input real pero invisible */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Cuadro de previsualización */}
          <div
            className="border d-flex align-items-center justify-content-center bg-light overflow-hidden"
            style={{ width: '100px', height: '100px', minWidth: '100px' }}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span className="text-danger fs-2">✕</span>
            )}
          </div>

          <div>
            <ButtonCustom
              texto={preview ? "Cambiar foto" : "Cargar tu foto"}
              color="dark"
              className="btn-sm px-4 mb-2 w-auto"
              onClick={handleButtonClick}
            />
            <p className="text-primary small mb-0" style={{ lineHeight: '1.2' }}>
              Se solicita subir una foto actualizada para el registro de reconocimiento facial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};