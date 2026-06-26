import React, { useState, useMemo } from 'react';

const AdminTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onAction,
  sortable = true,
  editLabel = 'Ver detalle',
  actionLabel = 'Editar',
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <i className="bi bi-arrow-down-up ms-1 text-muted opacity-50" aria-hidden="true" />;
    }
    return sortConfig.direction === 'asc' ? (
      <i className="bi bi-sort-up ms-1 text-success" aria-hidden="true" />
    ) : (
      <i className="bi bi-sort-down ms-1 text-success" aria-hidden="true" />
    );
  };

  // Usar actionLabel si se proporciona, si no usar editLabel como fallback
  const labelBoton = actionLabel || editLabel || 'Editar';

  return (
    <div className="card shadow-sm border-0 admin-data-table">
      <div className="card-body p-4">
        <div className="mb-3" style={{ maxWidth: '320px' }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted" aria-hidden="true" />
            </span>
            <input
              type="search"
              className="form-control border-start-0"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              aria-label="Buscar en la tabla"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="small text-uppercase admin-table-th"
                    onClick={() => handleSort(col.key)}
                    style={{ cursor: sortable ? 'pointer' : 'default' }}
                  >
                    <span className="d-inline-flex align-items-center">
                      {col.label}
                      {sortable && renderSortIcon(col.key)}
                    </span>
                  </th>
                ))}
                {(onEdit || onAction || onDelete) && (
                  <th scope="col" className="small text-uppercase admin-table-th text-end">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onAction || onDelete ? 1 : 0)}
                    className="text-center text-muted py-5"
                  >
                    <i className="bi bi-inbox fs-4 d-block mb-2" aria-hidden="true" />
                    No hay registros para mostrar
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={item.idUsuario ?? item.idPrestador ?? item.id ?? idx}>
                    {columns.map((col) => (
                      <td key={col.key}>{item[col.key] ?? '—'}</td>
                    ))}
                    {(onEdit || onAction || onDelete) && (
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                          {onEdit && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success rounded-pill px-3"
                              onClick={() => onEdit(item)}
                              title={labelBoton}
                              aria-label={labelBoton}
                            >
                              <i className="bi bi-pencil-square me-1" aria-hidden="true" />
                              {labelBoton}
                            </button>
                          )}
                          {onAction && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                              onClick={() => onAction(item)}
                              title="Acciones"
                              aria-label="Acciones"
                            >
                              <i className="bi bi-gear" aria-hidden="true" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-pill px-3"
                              onClick={() => onDelete(item)}
                              title="Eliminar"
                              aria-label="Eliminar"
                            >
                              <i className="bi bi-trash" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mt-4 pt-3 border-top">
          <button
            type="button"
            className="btn btn-sm btn-outline-success rounded-pill px-3"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <i className="bi bi-chevron-left me-1" aria-hidden="true" />
            Anterior
          </button>
          <span className="text-muted small fw-medium">
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-success rounded-pill px-3"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1 || sortedData.length === 0}
          >
            Siguiente
            <i className="bi bi-chevron-right ms-1" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;
