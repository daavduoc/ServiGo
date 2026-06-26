import React from 'react';

export const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mt-4 pt-3 border-top">
      <button type="button" className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => onPageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>
        <i className="bi bi-chevron-left me-1" aria-hidden="true" />
        Anterior
      </button>
      <span className="text-muted small fw-medium">
        Página {currentPage + 1} de {totalPages}
      </span>
      <button type="button" className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage >= totalPages - 1}>
        Siguiente
        <i className="bi bi-chevron-right ms-1" aria-hidden="true" />
      </button>
    </div>
  );
};
