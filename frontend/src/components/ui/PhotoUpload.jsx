import React, { useState, useRef } from 'react';

export const PhotoUpload = ({
  label = 'Foto de Perfil',
  onImageSelect,
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

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">{label}</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg"
        style={{ display: 'none' }}
      />
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
};
