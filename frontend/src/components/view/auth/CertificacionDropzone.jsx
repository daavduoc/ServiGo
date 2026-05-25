// zona para subir certificaciones, con previsualización de archivos seleccionados
import React, { useRef } from 'react';

// seccion de dropzone de certificaciones
export const CertificacionDropzone = ({ certificaciones, onFilesChange, label, hint }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesChange(files);
  };

  const getIconForFile = (file) => {
    if (file.type === 'application/pdf') return 'bi-file-earmark-pdf';
    if (file.type.startsWith('image/')) return 'bi-file-earmark-image';
    return 'bi-file-earmark';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="cert-dropzone-wrapper">
      {/* Input oculto que sirve para la selección de archivos */}
      <input
        ref={inputRef}
        type="file"
        className="d-none"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={handleChange}
      /> 

      {/* Inicio seccion de boton de carga de archivos */}
      <button
        type="button"
        className="cert-dropzone-btn"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="Seleccionar archivos"
      >
        <i className="bi bi-cloud-arrow-up cert-dropzone-btn__icon" aria-hidden="true" />
        <span className="cert-dropzone-btn__text">
          {label || 'Arrastra o selecciona documentos'}
        </span>
        <small className="cert-dropzone-btn__hint">
          {hint || 'PDF, JPG o PNG · Máx. 5 MB por archivo'}
        </small>
      </button>
      {/* Fin seccion de boton de carga de archivos */}

      {/* Inicio seccion de previsualización de archivos */}
      {certificaciones.length > 0 && (
        <ul className="cert-dropzone-preview">
          {certificaciones.map((file, idx) => (
            <li key={idx} className="cert-dropzone-preview__item">
              <i className={`bi ${getIconForFile(file)} cert-dropzone-preview__icon`} aria-hidden="true" />
              <span className="cert-dropzone-preview__name" title={file.name}>
                {file.name}
              </span>
              <span className="cert-dropzone-preview__size">
                {formatSize(file.size)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {/* fin de seccion de previsualización de archivos */}
    </div>
  );
};
// fin de zona para subir certificaciones, con previsualización de archivos seleccionados