import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminTable from '../ui/AdminTable';
import FilterPanel from '../ui/FilterPanel';
import PrestadorValidacionModal from './PrestadorValidacionModal';
import { listarPrestadoresValidacion } from '../../serviceFront/adminService';

const formatTipo = (tipo) => {
  if (!tipo) return '-';
  const t = String(tipo).toLowerCase();
  if (t === 'empresa') return 'Empresa / Local';
  if (t === 'particular') return 'A domicilio';
  return tipo;
};

const AdminPrestadoresView = () => {
  const [prestadores, setPrestadores] = useState([]);
  const [prestadoresFiltrados, setPrestadoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalPrestador, setModalPrestador] = useState(null);

  useEffect(() => {
    cargarPrestadores();
  }, []);

  const cargarPrestadores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarPrestadoresValidacion();
      const prestadoresArray = Array.isArray(data) ? data : [];
      setPrestadores(prestadoresArray);
      setPrestadoresFiltrados(prestadoresArray);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'No se pudo cargar la lista de prestadores');
      setPrestadores([]);
      setPrestadoresFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'nombrePrestador', label: 'Nombre / Razón social' },
    { key: 'tipoPrestador', label: 'Tipo' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'categoriaPrestador', label: 'Categoría' },
    { key: 'email', label: 'Email' },
    { key: 'certificacionesCount', label: 'Docs.' },
    { key: 'estadoValidacion', label: 'Estado' },
  ];

  const tableData = prestadoresFiltrados.map((p) => ({
    ...p,
    tipoPrestador: formatTipo(p.tipoPrestador),
    especialidad: p.especialidad || (p.especialidadesServicios?.length ? p.especialidadesServicios.join(', ') : '—'),
    certificacionesCount: p.certificacionesCount ?? 0,
  }));

  const handleFilterApply = (filters) => {
    let filtered = prestadores;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((prestador) =>
          String(prestador[key] ?? '').toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });
    setPrestadoresFiltrados(filtered);
  };

  const handleFilterClear = () => {
    setPrestadoresFiltrados(prestadores);
  };

  if (loading) {
    return (
      <div className="admin-prestadores">
        <h2 className="mb-4 admin-page-title">
          <i className="bi bi-person-badge" aria-hidden="true" />
          Validación de prestadores
        </h2>
        <div className="placeholder-glow">
          <span className="placeholder col-12 mb-2" style={{ height: 48 }} />
          <span className="placeholder col-12 mb-2" style={{ height: 320 }} />
        </div>
        <p className="text-muted small mt-2">Cargando solicitudes pendientes...</p>
      </div>
    );
  }

  return (
    <div className="admin-prestadores">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="mb-1 admin-page-title">
            <i className="bi bi-person-badge" aria-hidden="true" />
            Validación de prestadores
          </h2>
          <p className="text-muted mb-0 small">
            Revisa los registros enviados desde{' '}
            <Link to="/registro/prestador">/registro/prestador</Link> y aprueba o rechaza cada
            solicitud.
          </p>
        </div>
        {prestadores.length > 0 && (
          <span className="badge bg-warning text-dark fs-6">
            {prestadores.length} pendiente{prestadores.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}. Inicia sesión como administrador y verifica que el backend esté en ejecución.
        </div>
      )}

      {!error && prestadores.length === 0 && (
        <div className="alert alert-success" role="status">
          No hay prestadores pendientes de validación en este momento.
        </div>
      )}

      {prestadores.length > 0 && (
        <>
          <FilterPanel
            columns={columns}
            onApplyFilter={handleFilterApply}
            onClearFilter={handleFilterClear}
          />

          <AdminTable
            columns={columns}
            data={tableData}
            editLabel="Validar"
            onEdit={(prestador) => setModalPrestador(prestador)}
          />
        </>
      )}

      {modalPrestador && (
        <PrestadorValidacionModal
          prestador={modalPrestador}
          onClose={() => setModalPrestador(null)}
          onActionComplete={cargarPrestadores}
        />
      )}
    </div>
  );
};

export default AdminPrestadoresView;
