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
      <h1>Gestión de Servicios</h1>
      <AdminTable
        columns={columns}
        data={servicios}
      />
    </div>
  );
};

export default AdminServiciosView;