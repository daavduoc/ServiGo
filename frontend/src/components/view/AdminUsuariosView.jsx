import React, { useEffect, useState } from 'react';
import AdminTable from '../ui/AdminTable';
import FilterPanel from '../ui/FilterPanel';
import UsuarioDetalleModal from './UsuarioDetalleModal';

const AdminUsuariosView = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalUsuario, setModalUsuario] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      // TODO: Conectar con endpoint /admin/usuarios cuando esté disponible
      // Por ahora, datos de ejemplo
      const usuariosEjemplo = [
        {
          idUsuario: 1,
          rut: '12345678-9',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan@servigo.cl',
          telefono: '912345678',
          rol: 'CLIENTE',
          estado: 'activo',
          region: 'Metropolitana',
          comuna: 'Santiago',
          correoValidado: true,
          fechaRegistro: new Date()
        },
        {
          idUsuario: 2,
          rut: '87654321-0',
          nombre: 'María',
          apellido: 'González',
          correo: 'maria@servigo.cl',
          telefono: '987654321',
          rol: 'PRESTADOR',
          estado: 'bloqueado',
          region: 'Metropolitana',
          comuna: 'Providencia',
          correoValidado: true,
          fechaRegistro: new Date()
        }
      ];
      setUsuarios(usuariosEjemplo);
      setUsuariosFiltrados(usuariosEjemplo);
    } catch (error) {
      console.error('Error:', error);
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
      <h2 className="mb-4 admin-page-title">
        <i className="bi bi-people" aria-hidden="true" />
        Gestión de Usuarios
      </h2>

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