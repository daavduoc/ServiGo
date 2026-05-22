import React, { useEffect, useState } from 'react';
import AdminTable from '../ui/AdminTable';

const AdminSolicitudesView = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      // Implementar llamada al backend
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const columns = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'prestador', label: 'Prestador' },
    { key: 'servicio', label: 'Servicio' },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha', label: 'Fecha' }
  ];

  if (loading) return <p>Cargando solicitudes...</p>;

  return (
    <div>
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-clipboard-check" aria-hidden="true" />
        Gestión de Solicitudes
      </h2>
      <AdminTable
        columns={columns}
        data={solicitudes}
      />
    </div>
  );
};

export default AdminSolicitudesView;