import React, { useEffect, useState } from 'react';
import AdminTable from '../ui/AdminTable';

const AdminServiciosView = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      // Implementar llamada al backend
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'prestador', label: 'Prestador' },
    { key: 'estado', label: 'Estado' }
  ];

  if (loading) return <p>Cargando servicios...</p>;

  return (
    <div>
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-gear" aria-hidden="true" />
        Gestión de Servicios
      </h2>
      <AdminTable
        columns={columns}
        data={servicios}
      />
    </div>
  );
};

export default AdminServiciosView;