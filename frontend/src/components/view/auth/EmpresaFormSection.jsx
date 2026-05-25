import React from 'react';
import { Label, PasswordField } from './FormFields';
import { CertificacionDropzone } from './CertificacionDropzone';
import { GIROS } from './formConstants';

export const EmpresaFormSection = ({
  formData, handleChange, confirmContrasena, setConfirmContrasena,
  certificaciones, onCertFilesChange,
}) => (
  <>
    <h5 className="registro-section-title">Información de la Empresa</h5>
    <div className="row g-3">
      <div className="col-md-6">
        <Label htmlFor="rut" required>RUT de la empresa</Label>
        <input id="rut" name="rut" className="form-control" value={formData.rut} onChange={handleChange} placeholder="Ej: 76.123.456-7" required />
      </div>
      <div className="col-md-6">
        <Label htmlFor="nombre" required>Razón social</Label>
        <input id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <Label htmlFor="nombreFantasia">Nombre de fantasía (Opcional)</Label>
        <input id="nombreFantasia" name="nombreFantasia" className="form-control" value={formData.nombreFantasia} onChange={handleChange} />
      </div>
      <div className="col-md-6">
        <Label htmlFor="giro" required>Giro comercial</Label>
        <select id="giro" name="giro" className="form-select" value={formData.giro} onChange={handleChange} required>
          <option value="">Selecciona un giro</option>
          {GIROS.map((g) => (<option key={g} value={g}>{g}</option>))}
        </select>
      </div>
      <div className="col-md-6">
        <Label htmlFor="correo" required>Correo electrónico empresarial</Label>
        <input id="correo" name="correo" type="email" className="form-control" value={formData.correo} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <Label htmlFor="telefono" required>Teléfono empresarial</Label>
        <div className="input-group">
          <span className="input-group-text">+56 9</span>
          <input id="telefono" name="telefono" type="tel" className="form-control" value={formData.telefono} onChange={handleChange} placeholder="1234 5678" required />
        </div>
      </div>
      <div className="col-md-6">
        <PasswordField id="contrasena-emp" name="contrasena" label="Contraseña" value={formData.contrasena} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <PasswordField id="confirm-emp" name="confirmContrasena" label="Confirmar contraseña" value={confirmContrasena} onChange={(e) => setConfirmContrasena(e.target.value)} required />
      </div>
    </div>

    <div className="registro-prestador-hint-box registro-prestador-hint-box--yellow mt-3">
      <i className="bi bi-clock" aria-hidden="true" />
      <span>La información será revisada por un administrador antes de activar tu perfil público.</span>
    </div>

    <h5 className="registro-section-title mt-4">Documentación empresarial (Opcional)</h5>
    <div className="row g-3 align-items-start">
      <div className="col-md-7">
        <CertificacionDropzone certificaciones={certificaciones} onFilesChange={onCertFilesChange} />
      </div>
      <div className="col-md-5">
        <div className="registro-prestador-hint-box registro-prestador-hint-box--blue mb-0 h-100">
          <i className="bi bi-info-circle" aria-hidden="true" />
          <span>Ejemplos: patente comercial, inicio de actividades, certificado vigencia, etc.</span>
        </div>
      </div>
    </div>
  </>
);
