import React, { useState } from 'react';

const FilterPanel = ({ columns, onApplyFilter, onClearFilter }) => {
  const [filters, setFilters] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (columnKey, value) => {
    setFilters((prev) => ({ ...prev, [columnKey]: value }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    onClearFilter();
    setIsOpen(false);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v && v !== '').length;

  return (
    <div className="admin-filter-panel position-relative mb-3">
      <button
        type="button"
        className={`btn btn-sm rounded-pill fw-semibold d-inline-flex align-items-center gap-1 ${
          activeFiltersCount > 0 ? 'btn-success' : 'btn-outline-success'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <i className="bi bi-funnel" aria-hidden="true" />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="badge bg-white text-success rounded-pill ms-1">{activeFiltersCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="card border-0 shadow-sm admin-filter-dropdown mt-2">
          <div className="card-body p-3">
            <div className="row g-3">
              {columns.map((col) => (
                <div key={col.key} className="col-12 col-md-6">
                  <label htmlFor={`filter-${col.key}`} className="form-label small fw-semibold text-muted mb-1">
                    {col.label}
                  </label>
                  <input
                    id={`filter-${col.key}`}
                    type="text"
                    className="form-control form-control-sm"
                    placeholder={`Filtrar por ${col.label.toLowerCase()}`}
                    value={filters[col.key] || ''}
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
              <button type="button" className="btn btn-sm btn-success rounded-pill px-3 fw-semibold" onClick={handleApply}>
                <i className="bi bi-check-lg me-1" aria-hidden="true" />
                Aplicar
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                onClick={handleClear}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
