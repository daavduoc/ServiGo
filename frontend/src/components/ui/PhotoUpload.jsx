import React, { useState, useRef, useEffect } from 'react';

export const PhotoUpload = ({
  label = 'Foto de Perfil',
  onImageSelect,
  dropzoneTitle = 'Sube tu foto de perfil',
  variant = 'person',
  initialPreview = null,
  disabled = false,
}) => {
  const isEmpresa = variant === 'empresa';
  const [preview, setPreview] = useState(initialPreview || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialPreview) {
      setPreview(initialPreview);
    }
  }, [initialPreview]);

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const dropzoneClass = [
    'registro-photo-dropzone',
    disabled ? 'registro-photo-dropzone--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">{label}</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg"
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <div
        className={dropzoneClass}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleButtonClick}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleButtonClick();
          }
        }}
        style={disabled ? { cursor: 'default', opacity: 0.95 } : undefined}
      >
        {preview ? (
          <img
            src={preview}
            alt="Vista previa"
            className={`registro-photo-dropzone__preview${isEmpresa ? ' registro-photo-dropzone__preview--square' : ''}`}
          />
        ) : (
          <span
            className={`registro-photo-dropzone__avatar${isEmpresa ? ' registro-photo-dropzone__avatar--building' : ''}`}
            aria-hidden="true"
          >
            <i className={`bi ${isEmpresa ? 'bi-building' : 'bi-person'}`} />
          </span>
        )}
        <p className="registro-photo-dropzone__title">{dropzoneTitle}</p>
        <p className="registro-photo-dropzone__meta">Formato JPG o PNG · Máx. 5MB</p>
      </div>
      {!disabled && (
        <button type="button" className="registro-photo-btn-select" onClick={handleButtonClick}>
          Seleccionar archivo
        </button>
      )}
    </div>
  );
};
