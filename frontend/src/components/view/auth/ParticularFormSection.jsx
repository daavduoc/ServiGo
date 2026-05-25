import React from 'react';
import { Label, PasswordField } from './FormFields';
import { CertificacionDropzone } from './CertificacionDropzone';
import { ESPECIALIDADES_POR_TIPO } from './formConstants';

export const ParticularFormSection = ({
  formData, handleChange, handleTipoServicio,
  confirmContrasena, setConfirmContrasena,
  certificaciones, onCertFilesChange,
}) => (
  <>
    <h5 className="registro-section-title">Información Personal</h5>
    <div className="row g-3">
      <div className="col-md-6">
        <Label htmlFor="rut" required>RUT</Label>
        <input id="rut" name="rut" className="form-control" value={formData.rut} onChange={handleChange} placeholder="Ej: 12.345.678-9" required />
      </div>
      <div className="col-md-6">
        <Label htmlFor="fechaNacimiento" required>Fecha de nacimiento</Label>
        <input id="fechaNacimiento" name="fechaNacimiento" type="date" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <Label htmlFor="nombre" required>Nombres</Label>
        <input id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <Label htmlFor="apellido" required>Apellidos</Label>
        <input id="apellido" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <Label htmlFor="correo" required>Correo electrónico</Label>
        <input id="correo" name="correo" type="email" className="form-control" value={formData.correo} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <Label htmlFor="telefono" required>Teléfono</Label>
        <div className="input-group">
          <span className="input-group-text">+56 9</span>
          <input id="telefono" name="telefono" type="tel" className="form-control" value={formData.telefono} onChange={handleChange} required />
        </div>
      </div>
      <div className="col-md-6">
        <PasswordField id="contrasena" name="contrasena" label="Contraseña" value={formData.contrasena} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <PasswordField id="confirm" name="confirmContrasena" label="Confirmar contraseña" value={confirmContrasena} onChange={(e) => setConfirmContrasena(e.target.value)} required />
      </div>
    </div>

    <h5 className="registro-section-title mt-4">¿Qué tipo de servicio ofreces?</h5>
    <div className="registro-servicio-cards">
      <button
        type="button"
        className={`registro-servicio-card${formData.tipoServicio === 'tecnico' ? ' is-selected' : ''}`}
        onClick={() => handleTipoServicio('tecnico')}
        aria-pressed={formData.tipoServicio === 'tecnico'}
      >
        <i className="bi bi-wrench" aria-hidden="true" />
        <span>Técnico</span>
      </button>
      <button
        type="button"
        className={`registro-servicio-card${formData.tipoServicio === 'profesional' ? ' is-selected' : ''}`}
        onClick={() => handleTipoServicio('profesional')}
        aria-pressed={formData.tipoServicio === 'profesional'}
      >
        <i className="bi bi-person-workspace" aria-hidden="true" />
        <span>Profesional</span>
      </button>
    </div>

    <Label htmlFor="especialidad" required>Especialidad</Label>
    <select id="especialidad" name="especialidad" className="form-select mb-3" value={formData.especialidad} onChange={handleChange} required>
      <option value="">Selecciona tu especialidad</option>
      {(ESPECIALIDADES_POR_TIPO[formData.tipoServicio] || []).map((esp) => (
        <option key={esp} value={esp}>{esp}</option>
      ))}
    </select>

    <div className="registro-prestador-hint-box registro-prestador-hint-box--green">
      <i className="bi bi-tools" aria-hidden="true" />
      <span><strong>Técnicos:</strong> Gasfitería, Electricista.</span>
    </div>
    <div className="registro-prestador-hint-box registro-prestador-hint-box--blue">
      <i className="bi bi-mortarboard" aria-hidden="true" />
      <span><strong>Profesionales:</strong> Kinesiología, Psicología, Profesor Particular.</span>
    </div>

    <h5 className="registro-section-title mt-4">Documentación obligatoria</h5>
    <CertificacionDropzone certificaciones={certificaciones} onFilesChange={onCertFilesChange} />
  </>
);
