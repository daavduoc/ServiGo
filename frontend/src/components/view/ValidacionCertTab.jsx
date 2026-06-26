import React from 'react';

const formatFecha = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return value; }
};

export const ValidacionCertTab = ({ certificaciones, loading, esEmpresa }) => {
  if (loading) return <p className="text-muted small text-center py-3"><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Cargando documentos...</p>;

  if (certificaciones.length === 0) {
    return (
      <p className="text-muted">
        {esEmpresa ? 'No adjuntó documentación empresarial (opcional en el registro).' : 'No adjuntó certificados obligatorios.'}
      </p>
    );
  }

  return certificaciones.map((cert) => (
    <div key={cert.idCertificacion} className="cert-item border rounded p-3 mb-2">
      <h4 className="h6 mb-2">{cert.nombreDocumento || 'Documento'}</h4>
      <p className="mb-1 small text-muted">
        Estado: <strong>{cert.estado || 'pendiente'}</strong>
        {cert.fechaSubida && <> · Subido: {formatFecha(cert.fechaSubida)}</>}
      </p>
      {cert.urlDocumento && (
        <a href={cert.urlDocumento} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success">
          <i className="bi bi-box-arrow-up-right me-1" aria-hidden="true" />Ver / descargar archivo
        </a>
      )}
    </div>
  ));
};
