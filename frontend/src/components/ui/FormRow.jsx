export const FormRow = ({
  label,
  name,
  placeholder,
  onChange,
  type,
  tipo,
  value,
  layout = 'horizontal',
  hint,
  required = false,
  className = '',
}) => {
  const inputType = type || tipo || 'text';

  if (layout === 'stacked') {
    return (
      <div className={`mb-3 ${className}`.trim()}>
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
        <input
          id={name}
          name={name}
          type={inputType}
          value={value ?? ''}
          onChange={onChange}
          className="form-control"
          placeholder={placeholder}
          required={required}
        />
        {hint && <small className="text-muted d-block mt-1">{hint}</small>}
      </div>
    );
  }

  return (
    <div className={`row mb-3 align-items-center ${className}`.trim()}>
      <label htmlFor={name} className="col-md-3 fw-bold text-secondary">
        {label}
      </label>
      <div className="col-md-9">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value ?? ''}
          onChange={onChange}
          className="form-control shadow-sm"
          placeholder={placeholder}
          required={required}
        />
        {hint && <small className="text-muted d-block mt-1">{hint}</small>}
      </div>
    </div>
  );
};
