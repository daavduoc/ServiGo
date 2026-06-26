import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/form-actions-generic.css';

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

export const FormActionsGeneric = ({
  onCancel,
  onSave,
  textoSubmit = 'Aceptar',
  submitDisabled = false,
}) => (
  <div className="form-actions-generic d-flex justify-content-end flex-wrap gap-2 mt-4 border-top pt-3">
    <button type="button" className="btn form-actions-generic__cancel" onClick={onCancel}>
      Cancelar
    </button>
    <button
      type="submit"
      className="btn form-actions-generic__submit"
      disabled={submitDisabled}
      onClick={onSave}
    >
      {textoSubmit}
    </button>
  </div>
);
