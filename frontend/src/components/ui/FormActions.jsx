import React from 'react';
import { ButtonCustom } from './ButtonCustom';

// para los botones de cancelar y registrar en el formulario de registro

export const FormActions = ({ onCancel, onSave, submitLabel = 'Registrar', submitDisabled = false }) => {
  return (
    <div className="d-flex justify-content-end gap-2 mt-4 border-top pt-3">
      <ButtonCustom
        texto="Cancelar"
        color="light"
        className="border-dark px-4 w-auto"
        onClick={onCancel}
        disabled={submitDisabled}
      />
      <ButtonCustom
        texto={submitLabel}
        color="primary"
        className="px-5 shadow w-auto"
        tipo="submit"
        onClick={onSave}
        disabled={submitDisabled}
      />
    </div>
  );
};