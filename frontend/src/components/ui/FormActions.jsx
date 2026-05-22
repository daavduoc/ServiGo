import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonCustom } from './ButtonCustom';

export const FormActions = ({
  onCancel,
  onSave,
  submitLabel = 'Registrar',
  submitDisabled = false,
  showBackToSelection = true,
  backToSelectionPath = '/registro',
}) => (
  <div className="registro-cliente-actions">
    {showBackToSelection && (
      <Link to={backToSelectionPath} className="btn-volver-registro">
        <i className="bi bi-arrow-left" aria-hidden="true" />
        Volver al registro
      </Link>
    )}
    <div className="registro-cliente-actions__buttons">
      <button type="button" className="btn-cancelar" onClick={onCancel}>
        Cancelar
      </button>
      <button type="submit" className="btn btn-crear" disabled={submitDisabled} onClick={onSave}>
        <i className="bi bi-person-plus-fill" aria-hidden="true" />
        {submitLabel}
      </button>
    </div>
  </div>
);

export const FormActionsGeneric = ({ onCancel, onSave, textoSubmit = 'Aceptar' }) => (
  <div className="d-flex justify-content-end gap-2 mt-4 border-top pt-3">
    <ButtonCustom
      texto="Cancelar"
      color="light"
      className="border-dark px-4 w-auto"
      onClick={onCancel}
    />
    <ButtonCustom
      texto={textoSubmit}
      color="primary"
      className="px-5 shadow w-auto"
      tipo="submit"
      onClick={onSave}
    />
  </div>
);
