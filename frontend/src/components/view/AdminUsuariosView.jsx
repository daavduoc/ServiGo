import React, { useEffect, useState } from 'react';
import AdminTable from '../ui/AdminTable';
import FilterPanel from '../ui/FilterPanel';
import UsuarioDetalleModal from './UsuarioDetalleModal';
import { listarUsuarios } from '../../serviceFront/adminService';

const AdminUsuariosView = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalUsuario, setModalUsuario] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

const [error, setError] = useState(null);

const cargarUsuarios = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await listarUsuarios();
    console.log('Usuarios cargados:', data);
    setUsuarios(data);
    setUsuariosFiltrados(data);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    setError(error.message || 'Error al cargar usuarios');
    setUsuarios([]);
    setUsuariosFiltrados([]);
  } finally {
    setLoading(false);
  }
};

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'correo', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'rol', label: 'Rol' },
    { key: 'estado', label: 'Estado' }
  ];

  const handleFilterApply = (filters) => {
    let filtered = usuarios;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(user =>
          String(user[key]).toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });
    setUsuariosFiltrados(filtered);
  };

  const handleFilterClear = () => {
    setUsuariosFiltrados(usuarios);
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="admin-usuarios">
      <h1>Gestión de Usuarios</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      <FilterPanel 
        columns={columns}
        onApplyFilter={handleFilterApply}
        onClearFilter={handleFilterClear}
      />

      <AdminTable
        columns={columns}
        data={usuariosFiltrados}
        onEdit={(usuario) => setModalUsuario(usuario)}
      />

      {modalUsuario && (
        <UsuarioDetalleModal
          usuario={modalUsuario}
          onClose={() => setModalUsuario(null)}
          onActionComplete={cargarUsuarios}
        />
      )}
    </div>
  );
};

export default AdminUsuariosView;