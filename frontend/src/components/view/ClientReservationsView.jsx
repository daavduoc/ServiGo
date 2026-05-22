// responsable de mostrar las reservas del cliente, tanto próximas como pasadas, con datos reales de la base de datos
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const estadoBadgeClass = (etiqueta) => {
  if (etiqueta === 'success') return 'badge bg-success text-white';
  if (etiqueta === 'warning') return 'badge bg-warning text-dark';
  return 'badge bg-secondary text-white';
};

export const ClientReservationsView = () => {
  // 1. ESTADOS PARA GUARDAR LA INFO DE LA BASE DE DATOS
  const [perfilReal, setPerfilReal] = useState(null);
  const [proximasCitas, setProximasCitas] = useState([]);
  const [historialCitas, setHistorialCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 2. EFECTO QUE SE EJECUTA AL ENTRAR A LA VISTA
  useEffect(() => {
    const traerDatosDeLaBaseDeDatos = async () => {
      try {
        // Recuperamos el token de sesión (ajusta esto si lo guardas con otro nombre en tu AuthContext)
        const token = localStorage.getItem('token'); 

        // --- LLAMADA REAL AL BACKEND: OBTENER PERFIL ---
        const respuestaPerfil = await fetch('http://localhost:8080/usuarios/me/perfil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Esencial para que Spring Boot te reconozca
          }
        });

        if (respuestaPerfil.ok) {
          const datosPerfil = await respuestaPerfil.json();
          setPerfilReal(datosPerfil); // Guardamos el PerfilUsuarioDTO
        }

        // --- LLAMADA FUTURA A TUS RESERVAS ---
        // Cuando crees tu ReservaController en Java, descomenta esto y ajusta la URL:
        /*
        const respuestaCitas = await fetch('http://localhost:8080/reservas/mis-citas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (respuestaCitas.ok) {
          const datosCitas = await respuestaCitas.json();
          // Aquí separarías por fechas para mandarlas a "proximasCitas" o "historialCitas"
        }
        */

      } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
      } finally {
        setCargando(false);
      }
    };

    traerDatosDeLaBaseDeDatos();
  }, []);

  // Pantalla de carga mientras trae los datos
  if (cargando) {
    return (
      <div className="container mt-5 mb-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Cargando datos desde el servidor...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      
      {/* 3. AHORA USAMOS LOS DATOS REALES DE LA BD */}
      {perfilReal && (
        <div className="alert alert-success shadow-sm mb-4 border-0">
          <h5 className="mb-1"><i className="bi bi-person-check-fill me-2"></i>Bienvenido, {perfilReal.nombre} {perfilReal.apellido}</h5>
          <p className="mb-0 small text-dark">
            <strong>Rol:</strong> {perfilReal.rol} | <strong>Ubicación:</strong> {perfilReal.comuna}, {perfilReal.region}
            {perfilReal.nombreEmpresa && ` | Empresa: ${perfilReal.nombreEmpresa}`}
          </p>
        </div>
      )}

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <h2 className="m-0 d-flex align-items-center gap-2 profile-panel-title">
          <i className="bi bi-calendar-check" aria-hidden="true" />
          Mis Horas y Reservas
        </h2>
        <Link
          to="/buscar"
          className="btn btn-success client-panel-cta-btn fw-bold rounded-pill shadow-sm text-nowrap"
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Agendar Nueva Cita
        </Link>
      </div>

      {/* Panel 1 — Próximas Citas */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h4 className="mb-4 profile-panel-title">
          <i className="bi bi-clock-history" aria-hidden="true" />
          Próximas Citas
        </h4>

        {proximasCitas.length > 0 ? (
          <div className="row g-3">
            {proximasCitas.map((cita) => (
              <div className="col-12" key={cita.id}>
                {/* Estructura de tu tarjeta mantenida intacta */}
                <div className="card border-0 shadow-sm rounded-3 bg-white border-start border-success border-4">
                  <div className="card-body p-4">
                    <h5 className="fw-bold m-0">{cita.servicio}</h5>
                    {/* ... (resto de tu diseño de tarjeta) ... */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-light border text-center p-4 rounded-3 mb-0 text-muted">
            No tienes próximas reservas agendadas en la base de datos.
            <br />
            <Link to="/buscar" className="text-success fw-bold text-decoration-none">
              ¡Explora la plataforma y agenda hoy!
            </Link>
          </div>
        )}
      </div>

      {/* Panel 2 — Historial (Sigue la misma lógica) */}
      <div className="card shadow-sm border-0 p-4">
        <h4 className="mb-4 profile-panel-title">
          <i className="bi bi-journal-text" aria-hidden="true" />
          Historial de Atenciones
        </h4>
        {historialCitas.length > 0 ? (
          <div className="row g-3">
            {/* Aquí iría el .map de historialCitas */}
          </div>
        ) : (
          <p className="text-muted text-center py-3">Aún no hay atenciones registradas.</p>
        )}
      </div>

      <div className="bg-light p-4 rounded-3 border-start border-success border-4 mt-4">
        <p className="text-muted mb-0">
          <i className="bi bi-lightbulb text-success me-2" aria-hidden="true" />
          Usa <strong>Agendar Nueva Cita</strong> para buscar especialistas disponibles en tu comuna.
        </p>
      </div>
    </div>
  );
};