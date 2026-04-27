export const FormRow = ({ label, name, placeholder, onChange, tipo = "text" }) => (
    <div className="row mb-3 align-items-center">
        <label className="col-md-3 fw-bold text-secondary">{label}</label>
        <div className="col-md-9">
            <input 
                name={name} 
                type={tipo} 
                onChange={onChange} 
                className="form-control shadow-sm" 
                placeholder={placeholder} 
            />
        </div>
    </div>
);