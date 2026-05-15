import React, { useState, useMemo } from 'react';

const AdminTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onAction,
  sortable = true
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="admin-table">
      <div className="table-filter">
        <input
          type="text"
          className="filter-input"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => sortable && handleSort(col.key)}
                  style={{ cursor: sortable ? 'pointer' : 'default' }}
                >
                  {col.label}
                  {sortable && sortConfig.key === col.key && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.key}>{item[col.key]}</td>
                ))}
                <td className="action-cell">
                  {onEdit && (
                    <button className="btn-action btn-edit" onClick={() => onEdit(item)}>
                      ✏️
                    </button>
                  )}
                  {onAction && (
                    <button className="btn-action" onClick={() => onAction(item)}>
                      ⚙️
                    </button>
                  )}
                  {onDelete && (
                    <button className="btn-action btn-delete" onClick={() => onDelete(item)}>
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          ← Anterior
        </button>
        <span className="pagination-info">
          Página {currentPage + 1} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default AdminTable;