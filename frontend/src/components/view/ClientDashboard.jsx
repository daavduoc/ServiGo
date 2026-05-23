import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../serviceFront/userService';
import { getDisplayName } from '../../utils/userDisplay';

export const ClientDashboard = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Estados para la data del dashboard
  const [stats, setStats] = useState({ activas: 0, contratados: 0, nuevos: 0 });
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profileData = await getMyProfile();
        updateUserData({
          idUsuario: profileData.idUsuario,
          nombre: profileData.nombre,
          apellido: profileData.apellido,
          correo: profileData.correo,
          telefono: profileData.telefono,
          comuna: profileData.comuna,
          region: profileData.region,
          rut: profileData.rut,
          urlFotoCloud: profileData.urlFotoCloud,
          rol: profileData.rol,
        });

        // Simulamos la data para el dashboard
        setStats({ activas: 2, contratados: 3, nuevos: 1 });
        setCitas([
          {
            id: 'b-101',
            servicio: 'Limpieza de Hogar Profunda',
            profesional: 'María Loreto',
            fechaHora: '25 de Mayo, 2026 - 10:00 AM',
            estado: 'Confirmada'
          },
          {
            id: 'b-102',
            servicio: 'Gasfitería - Reparación de Fuga',
            profesional: 'Carlos Muñoz',
            fechaHora: '02 de Junio, 2026 - 15:30 PM',
            estado: 'Pendiente'
          }
        ]);
      } catch (error) {
        console.error("Error cargando el dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [updateUserData]);

  const nombreVisible = getDisplayName(user);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando Panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5 client-panel-content">
      {/* Encabezado del Dashboard */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
          ¡Hola, {nombreVisible}! 👋
        </h2>
        <p className="text-muted mb-0">
          Bienvenido a tu panel de control de <strong>ServiGo</strong>. Aquí puedes gestionar tus citas y servicios de manera rápida.
        </p>
      </div>

      {/* Tarjetas de Estadísticas integradas (Sin archivos extra) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="card border-0 bg-success bg-opacity-10 p-3 shadow-sm h-100">
            <div className="card-body p-2">
              <span className="text-muted fw-semibold small text-uppercase">Citas Activas</span>
              <h2 className="fw-bold text-success m-0 mt-1">{stats.activas}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="card border-0 bg-primary bg-opacity-10 p-3 shadow-sm h-100">
            <div className="card-body p-2">
              <span className="text-muted fw-semibold small text-uppercase">Servicios Contratados</span>
              <h2 className="fw-bold text-primary m-0 mt-1">{stats.contratados}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="card border-0 bg-warning bg-opacity-10 p-3 shadow-sm h-100">
            <div className="card-body p-2">
              <span className="text-muted fw-semibold small text-uppercase">Mensajes / Nuevos</span>
              <h2 className="fw-bold text-warning m-0 mt-1">{stats.nuevos}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Reservas integrada (Sin archivos extra) */}
      <div className="card border-0 shadow-sm p-4 bg-white rounded-3 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-dark m-0 fs-5">Próximas Reservas</h4>
          <button onClick={() => navigate('/mis-reservas')} className="btn btn-sm btn-outline-success px-3 rounded-pill fw-semibold">
            Ver todas mis reservas
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light text-secondary text-uppercase fs-7 small">
              <tr>
                <th className="border-0 py-3">Servicio</th>
                <th className="border-0 py-3">Profesional</th>
                <th className="border-0 py-3">Fecha y Hora</th>
                <th className="border-0 py-3">Estado</th>
                <th className="border-0 py-3 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td className="fw-semibold text-dark py-3">{cita.servicio}</td>
                  <td className="text-secondary py-3">{cita.profesional}</td>
                  <td className="text-secondary py-3">{cita.fechaHora}</td>
                  <td className="py-3">
                    <span className={`badge rounded-pill px-3 py-2 fs-7 ${cita.estado === 'Confirmada' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td className="py-3 text-end">
                    <button onClick={() => navigate(`/servicio-detalle/${cita.id}`)} className="btn btn-sm btn-light border text-primary fw-semibold px-3 rounded-pill">
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};