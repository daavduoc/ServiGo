import React, { useRef } from 'react';

export const CertificacionDropzone = ({ certificaciones, onFilesChange }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesChange(files);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="d-none"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={handleChange}
      />
      <div
        className="registro-cert-dropzone"
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
        <p className="fw-semibold mb-1">Arrastra tus documentos aquí</p>
        <small>PDF, JPG o PNG · Máx. 5MB por archivo</small>
        {certificaciones.length > 0 && (
          <small className="d-block mt-2 text-success">
            {certificaciones.length} archivo(s) seleccionado(s)
          </small>
        )}
      </div>
    </>
  );
};
