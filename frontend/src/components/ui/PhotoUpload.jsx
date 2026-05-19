import React, { useState, useRef } from 'react';
import { ButtonCustom } from './ButtonCustom';

export const PhotoUpload = ({
  label = 'Foto de Perfil',
  onImageSelect,
  variant = 'default',
  dropzoneTitle = 'Sube tu foto de perfil',
}) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  };

  const fileInput = (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept="image/jpeg,image/png,image/jpg"
      style={{ display: 'none' }}
    />
  );

  if (variant === 'dropzone') {
    return (
      <div className="mb-4">
        <label className="form-label fw-bold">{label}</label>
        {fileInput}
        <div
          className="registro-photo-dropzone"
          role="button"
          tabIndex={0}
          onClick={handleButtonClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleButtonClick();
            }
          }}
        >
          {preview ? (
            <img src={preview} alt="Vista previa" className="registro-photo-dropzone__preview" />
          ) : (
            <span className="registro-photo-dropzone__avatar" aria-hidden="true">
              <i className="bi bi-person" />
            </span>
          )}
          <p className="registro-photo-dropzone__title">{dropzoneTitle}</p>
          <p className="registro-photo-dropzone__meta">Formato JPG o PNG · Máx. 5MB</p>
        </div>
        <button type="button" className="registro-photo-btn-select" onClick={handleButtonClick}>
          Seleccionar archivo
        </button>
      </div>
    );
  }

  return (
    <div className="row mb-4 align-items-start">
      <label className="col-md-3 fw-bold text-secondary">{label}</label>
      <div className="col-md-9">
        <div className="d-flex align-items-center gap-3">
          {fileInput}
          <div
            className="border d-flex align-items-center justify-content-center bg-light overflow-hidden"
            style={{ width: '100px', height: '100px', minWidth: '100px' }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span className="text-danger fs-2">✕</span>
            )}
          </div>
          <div>
            <ButtonCustom
              texto={preview ? 'Cambiar foto' : 'Cargar tu foto'}
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
