import React, { useState } from 'react';

const FilterPanel = ({ columns, onApplyFilter, onClearFilter }) => {
  const [filters, setFilters] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (columnKey, value) => {
    const newFilters = { ...filters, [columnKey]: value };
    setFilters(newFilters);
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

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

  return (
    <div className="filter-panel">
      <button 
        className={`filter-toggle ${activeFiltersCount > 0 ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        🔍 Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-content">
            {columns.map(col => (
              <div key={col.key} className="filter-item">
                <label htmlFor={`filter-${col.key}`}>{col.label}:</label>
                <input
                  id={`filter-${col.key}`}
                  type="text"
                  placeholder={`Filtrar por ${col.label.toLowerCase()}`}
                  value={filters[col.key] || ''}
                  onChange={(e) => handleFilterChange(col.key, e.target.value)}
                  className="filter-input"
                />
              </div>
            ))}
          </div>

          <div className="filter-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleApply}
            >
              Aplicar
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleClear}
            >
              Limpiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
