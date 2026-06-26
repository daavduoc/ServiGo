import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../serviceFront/userService';

// Avatar por defecto dibujado en código (nunca se rompe)
const PLACEHOLDER_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" fill="#f8f9fa"/>' +
      '<circle cx="50" cy="38" r="18" fill="#ced4da"/>' +
      '<ellipse cx="50" cy="78" rx="28" ry="18" fill="#ced4da"/>' +
      '</svg>'
  );

export const ClientDashboard = () => {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Error cargando el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [updateUserData]);

  if (loading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-success" role="status" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Cargando tu perfil...</span>
        </div>
        <p className="text-muted mt-3 fw-medium">Cargando tus datos de ServiGo...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5 client-panel-content">
      {/* Encabezado Principal */}
      <div className="mb-4 pb-2 border-bottom">
        <h2 className="fw-extrabold text-dark mb-1 display-6">Mi Perfil</h2>
        <p className="text-muted mb-0 fs-6">
          Gestiona tu información personal y verifica los datos de tu cuenta en ServiGo.
        </p>
      </div>

      {/* TARJETA DE PERFIL PREMIUM */}
      <div className="card border-0 shadow rounded-4 bg-white overflow-hidden">
        {/* Banner decorativo superior suave */}
        <div className="bg-success bg-opacity-10 py-3 border-bottom border-success border-opacity-25"></div>
        
        <div className="card-body p-4 p-md-5">
          <div className="row g-5 align-items-center">
            
            {/* COLUMNA IZQUIERDA: Avatar y Nombre */}
            <div className="col-12 col-md-4 text-center border-end-md pe-md-5">
              <div className="position-relative d-inline-block mb-4">
                <img
                  src={user?.urlFotoCloud || PLACEHOLDER_AVATAR}
                  alt="Perfil"
                  className="rounded-circle object-fit-cover shadow-sm p-1 bg-white border border-2 border-success"
                  style={{ width: '130px', height: '130px' }}
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_AVATAR;
                  }}
                />
                <span className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '35px', height: '35px', border: '3px solid white' }} title="Cliente Verificado">
                  <i className="bi bi-patch-check-fill fs-6"></i>
                </span>
              </div>
              
              <h3 className="fw-bold text-dark mb-1">
                {user?.nombre} {user?.apellido}
              </h3>
              <p className="text-primary small mb-0 fw-semibold">
                Cliente Activo ServiGo
              </p>
              <p className="text-muted small">Miembro desde 2024</p>
            </div>

            {/* COLUMNA DERECHA: Grilla de Información Detallada */}
            <div className="col-12 col-md-8">
              <h5 className="fw-bold text-secondary text-uppercase small mb-4 tracking-wider">Información de Contacto y Cuenta</h5>
              
              <div className="row g-4">
                
                {/* Caja Correo */}
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border">
                    <div className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px' }}>
                      <i className="bi bi-envelope-fill fs-5"></i>
                    </div>
                    <div>
                      <label className="text-muted small fw-bold text-uppercase d-block mb-0">Correo Electrónico</label>
                      <span className="fw-medium text-dark">{user?.correo || 'No registrado'}</span>
                    </div>
                  </div>
                </div>

                {/* Caja Teléfono */}
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border">
                    <div className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px' }}>
                      <i className="bi bi-telephone-fill fs-5"></i>
                    </div>
                    <div>
                      <label className="text-muted small fw-bold text-uppercase d-block mb-0">Teléfono</label>
                      <span className="fw-medium text-dark">{user?.telefono || 'No registrado'}</span>
                    </div>
                  </div>
                </div>

                {/* Caja Ubicación */}
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border">
                    <div className="bg-white text-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px' }}>
                      <i className="bi bi-geo-alt-fill fs-5"></i>
                    </div>
                    <div>
                      <label className="text-muted small fw-bold text-uppercase d-block mb-0">Ubicación principal</label>
                      <span className="fw-medium text-dark">
                        {[user?.comuna, user?.region].filter(Boolean).join(', ') || 'No registrada'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Caja RUT */}
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border">
                    <div className="bg-white text-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px' }}>
                      <i className="bi bi-card-text fs-5"></i>
                    </div>
                    <div>
                      <label className="text-muted small fw-bold text-uppercase d-block mb-0">RUT / Identificación</label>
                      <span className="fw-medium text-dark">{user?.rut || 'No registrado'}</span>
                    </div>
                  </div>
                </div>

              </div> {/* Fin grilla info */}
              
            </div> {/* Fin columna derecha */}
            
          </div> {/* Fin row principal */}
        </div> {/* Fin card-body */}
        
        {/* Pie de tarjeta con mensaje de seguridad */}
        <div className="card-footer bg-light border-0 py-3 px-5 text-center text-md-start">
          <small className="text-muted">
            <i className="bi bi-shield-lock-fill text-success me-2"></i>
            Tus datos personales están protegidos bajo nuestras políticas de seguridad y privacidad. ServiGo nunca compartirá tu información sin tu consentimiento.
          </small>
        </div>
      </div>
    </div>
  );
};