import React, { useEffect, useState } from 'react';
import AdminTable from '../ui/AdminTable';
import FilterPanel from '../ui/FilterPanel';
import UsuarioDetalleModal from './UsuarioDetalleModal';
import { listarUsuariosAdmin } from '../../serviceFront/adminService';

const mapUsuarioParaTabla = (usuario) => ({
  ...usuario,
  nombre: [usuario.nombre, usuario.apellido].filter(Boolean).join(' ').trim() || '—',
});

const AdminUsuariosView = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalUsuario, setModalUsuario] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarUsuariosAdmin();
      const usuariosArray = Array.isArray(data) ? data.map(mapUsuarioParaTabla) : [];
      setUsuarios(usuariosArray);
      setUsuariosFiltrados(usuariosArray);
    } catch (err) {
      console.error('Error cargando usuarios admin:', err);
      setError(err.message || 'No se pudo cargar la lista de usuarios');
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
    { key: 'estado', label: 'Estado' },
  ];

  const handleFilterApply = (filters) => {
    let filtered = usuarios;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((user) =>
          String(user[key] ?? '').toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });
    setUsuariosFiltrados(filtered);
  };

  const handleFilterClear = () => {
    setUsuariosFiltrados(usuarios);
  };

  if (loading) {
    return (
      <div className="admin-usuarios text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-usuarios">
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-people" aria-hidden="true" />
        Gestión de Usuarios
      </h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!error && usuarios.length === 0 && (
        <div className="alert alert-info">No hay usuarios registrados en el sistema.</div>
      )}

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
