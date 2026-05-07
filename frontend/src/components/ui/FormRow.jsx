export const FormRow = ({ label, name, value, onChange, placeholder, tipo = "text" }) => (
    <div className="row mb-3 align-items-center">
        <label className="col-md-3 fw-bold text-secondary">{label}</label>
        <div className="col-md-9">
            <input
                type={tipo}
                name={name}
                value={value}
                onChange={onChange}
                className="form-control"
                placeholder={placeholder}
                style={{ borderRadius: '8px' }}
            />
        </div>
    </div>
);