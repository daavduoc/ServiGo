import React from 'react';

// botones tipo marca para usarlos en registro.
export const SelectionGroup = ({ label, options, activeValue, onChange }) => {
    return (
        <div className="row mb-4 align-items-center bg-light p-3 rounded border mx-0 shadow-sm">
            <label className="col-md-3 fw-bold text-secondary mb-2 mb-md-0">{label}</label>
            <div className="col-md-9">
                <div className="btn-group w-100" role="group">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`btn ${activeValue === opt.value ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => onChange(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};