//dentifica el tipo de registro (cliente o prestador) y permite seleccionar uno de las dos opciones
import React from 'react';

export const TipoRegistroCard = ({ option, selected, onSelect }) => (
  <div className="col-md-6">
    <button
      type="button"
      className={`registro-type-card${selected ? ' is-selected' : ''}`}
      onClick={() => onSelect(option.value)}
      aria-pressed={selected}
    >
      <span className="registro-type-card__check" aria-hidden="true">
        {selected && <i className="bi bi-check-lg" />}
      </span>
      <i className={`bi ${option.icon} registro-type-card__icon`} aria-hidden="true" />
      <span className="registro-type-card__title">{option.title}</span>
      <span className="registro-type-card__sub">{option.subtitle}</span>
    </button>
  </div>
);
