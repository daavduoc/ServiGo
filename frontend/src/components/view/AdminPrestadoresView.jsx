import React, { useEffect, useState } from 'react';
import AdminTable from '../ui/AdminTable';
import FilterPanel from '../ui/FilterPanel';
import PrestadorValidacionModal from './PrestadorValidacionModal';
import { listarPrestadoresValidacion } from '../../serviceFront/adminService';

const AdminPrestadoresView = () => {
  const [prestadores, setPrestadores] = useState([]);
  const [prestadoresFiltrados, setPrestadoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalPrestador, setModalPrestador] = useState(null);

  useEffect(() => {
    cargarPrestadores();
  }, []);

  const cargarPrestadores = async () => {
    try {
      setLoading(true);
      const data = await listarPrestadoresValidacion();
      const prestadoresArray = Array.isArray(data) ? data : [];
      setPrestadores(prestadoresArray);
      setPrestadoresFiltrados(prestadoresArray);
    } catch (error) {
      console.error('Error:', error);
      setPrestadores([]);
      setPrestadoresFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'nombrePrestador', label: 'Nombre' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'email', label: 'Email' },
    { key: 'estadoValidacion', label: 'Estado' }
  ];

  const handleFilterApply = (filters) => {
    let filtered = prestadores;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(prestador =>
          String(prestador[key]).toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });
    setPrestadoresFiltrados(filtered);
  };

  const handleFilterClear = () => {
    setPrestadoresFiltrados(prestadores);
  };

  if (loading) return <p>Cargando prestadores...</p>;

  return (
    <div className="admin-prestadores">
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-person-badge" aria-hidden="true" />
        Validación de Prestadores
      </h2>

      <FilterPanel
        columns={columns}
        onApplyFilter={handleFilterApply}
        onClearFilter={handleFilterClear}
      />

      <AdminTable
        columns={columns}
        data={prestadoresFiltrados}
        onEdit={(prestador) => setModalPrestador(prestador)}
      />

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