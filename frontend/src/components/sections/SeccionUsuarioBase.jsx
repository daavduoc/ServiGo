import React from 'react';
import { FormRow } from '../ui';

const FieldCol = ({ children, wide = false }) => (
  <div className={wide ? 'col-12' : 'col-md-6'}>{children}</div>
);

export const SeccionUsuarioBase = ({
  handleChange,
  formData,
  layout = 'horizontal',
  showConfirmPassword = false,
  confirmContrasena = '',
  onConfirmPasswordChange,
}) => {
  const esEmpresa = formData.tipoPrestador === 'empresa';
  const isClient = layout === 'client';
  const isStacked = layout === 'stacked' || isClient;
  const fieldLayout = isClient ? 'stacked' : layout;
  const titleClass = isStacked
    ? 'registro-section-title'
    : 'text-primary mb-4 border-bottom pb-2';

  const formRowProps = { layout: fieldLayout, className: isClient ? 'mb-0' : '' };

  const personalFields = (
    <>
      <FieldCol wide>
        <FormRow
          {...formRowProps}
          label="RUT"
          name="rut"
          type="text"
          value={formData.rut}
          onChange={handleChange}
          placeholder="Ej: 12.345.678-9"
          required
        />
      </FieldCol>

      <FieldCol>
        <FormRow
          {...formRowProps}
          label={esEmpresa ? 'Nombre de la Empresa' : 'Nombres'}
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </FieldCol>

      {!esEmpresa && (
        <FieldCol>
          <FormRow
            {...formRowProps}
            label="Apellidos"
            name="apellido"
            type="text"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </FieldCol>
      )}

      <FieldCol>
        <FormRow
          {...formRowProps}
          label="Correo electrónico"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          placeholder="tu@correo.com"
          required
        />
      </FieldCol>

      {isClient ? (
        <FieldCol>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono <span className="text-danger">*</span>
            </label>
            <div className="input-group registro-cliente-input-lg">
              <span className="input-group-text">+56 9</span>
              <input
                id="telefono"
                name="telefono"
                type="text"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="1234 5678"
                required
              />
            </div>
          </div>
        </FieldCol>
      ) : (
        <FormRow
          layout={fieldLayout}
          label="Teléfono"
          name="telefono"
          type="text"
          value={formData.telefono}
          onChange={handleChange}
        />
      )}

      <FieldCol>
        <FormRow
          {...formRowProps}
          label="Contraseña"
          name="contrasena"
          type="password"
          value={formData.contrasena}
          onChange={handleChange}
          hint={isStacked && !isClient ? 'Mínimo 8 caracteres, con mayúscula, minúscula y número.' : undefined}
          required
        />
      </FieldCol>

      {showConfirmPassword && (
        <FieldCol>
          <FormRow
            {...formRowProps}
            label="Confirmar contraseña"
            name="confirmContrasena"
            type="password"
            value={confirmContrasena}
            onChange={onConfirmPasswordChange}
            required
          />
        </FieldCol>
      )}
    </>
  );

  const addressFields = (
    <>
      <FieldCol>
        <FormRow
          {...formRowProps}
          label="Región"
          name="region"
          type="text"
          value={formData.region}
          onChange={handleChange}
          placeholder="Ej: METROPOLITANA"
          required={isStacked}
        />
      </FieldCol>
      <FieldCol>
        <FormRow
          {...formRowProps}
          label="Comuna"
          name="comuna"
          type="text"
          value={formData.comuna}
          onChange={handleChange}
          placeholder="Ej: PROVIDENCIA"
          required={isStacked}
        />
      </FieldCol>
      <FieldCol wide>
        <FormRow
          {...formRowProps}
          label="Dirección / Calle"
          name="direccion"
          type="text"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Calle, número, depto."
          required={isStacked}
        />
      </FieldCol>
    </>
  );

  if (!isClient) {
    return (
      <>
        <h5 className={titleClass}>
          {esEmpresa ? 'Datos de la Empresa' : 'Datos Personales'}
        </h5>
        <div className={layout === 'horizontal' ? 'row' : ''}>{personalFields}</div>
        <h5 className={isStacked ? 'registro-section-title' : 'text-primary mb-4 mt-4 border-bottom pb-2'}>
          Dirección
        </h5>
        <div className={layout === 'horizontal' ? 'row' : ''}>{addressFields}</div>
      </>
    );
  }

  return (
    <>
      <h5 className={titleClass}>
        {esEmpresa ? 'Datos de la Empresa' : 'Datos Personales'}
      </h5>
      <div className="row g-3 mb-1">{personalFields}</div>

      <h5 className="registro-section-title">Dirección</h5>
      <div className="row g-3">{addressFields}</div>
    </>
  );
};
