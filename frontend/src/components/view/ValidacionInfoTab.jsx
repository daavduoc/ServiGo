import React from 'react';

const DetailItem = ({ label, value, fullWidth }) => (
  <div className={`detail-item${fullWidth ? ' full-width' : ''}`}>
    <p className="detail-label">{label}</p>
    <p className="detail-value">{value ?? '—'}</p>
  </div>
);

const formatFecha = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return value; }
};

export const ValidacionInfoTab = ({ prestador, esEmpresa }) => (
  <>
    {prestador.urlFotoPerfil && (
      <div className="text-center mb-3">
        <img src={prestador.urlFotoPerfil} alt="Foto de perfil" className="rounded" style={{ maxWidth: 120, maxHeight: 120, objectFit: 'cover' }} loading="lazy" decoding="async" />
      </div>
    )}

    <div className="detail-grid">
      <DetailItem label="Estado" value={prestador.estadoValidacion} />
      <DetailItem label="Tipo" value={esEmpresa ? 'Prestador establecido (empresa)' : 'Prestador a domicilio'} />
      <DetailItem label="Correo" value={prestador.email} />
      <DetailItem label="Teléfono" value={prestador.telefono} />
      <DetailItem label="RUT (usuario)" value={prestador.rut} />
      <DetailItem label="Correo verificado" value={prestador.correoValidado ? 'Sí' : 'Pendiente'} />
      <DetailItem label="Categoría" value={prestador.categoriaPrestador} />
      <DetailItem label="Especialidad" value={prestador.especialidad || (prestador.especialidadesServicios?.length ? prestador.especialidadesServicios.join(', ') : '—')} />
      {!esEmpresa && <DetailItem label="Fecha de nacimiento" value={formatFecha(prestador.fechaNacimiento)} />}
      <DetailItem label="Región" value={prestador.region} />
      <DetailItem label="Comuna" value={prestador.comuna} />
      <DetailItem label="Dirección" value={prestador.direccion} fullWidth />
      <DetailItem label="Fecha de registro" value={formatFecha(prestador.fechaRegistro)} />
    </div>

    {esEmpresa && (
      <>
        <h4 className="h6 text-success mt-4 mb-3">Datos de empresa</h4>
        <div className="detail-grid">
          <DetailItem label="Razón social" value={prestador.empresa} />
          <DetailItem label="Nombre comercial" value={prestador.nombreComercial} />
          <DetailItem label="RUT empresa" value={prestador.rutEmpresa} />
          <DetailItem label="Giro comercial" value={prestador.giroComercial} />
          <DetailItem label="Estado empresa" value={prestador.estadoEmpresa} />
        </div>
      </>
    )}
  </>
);
