import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDisplayName } from '../../utils/userDisplay';
import { CardContainer } from '../ui/CardContainer';
import { ButtonCustom } from '../ui/ButtonCustom';

export const UserDashboardView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const esEmpresa = user?.tipoPrestador?.toLowerCase() === 'empresa';
  const nombreVisible = getDisplayName(user);

  return (
    <CardContainer
      titulo={esEmpresa ? `Panel Corporativo: ${nombreVisible}` : `¡Hola de nuevo, ${nombreVisible}!`}
      maxwidth="1100px"
    >
      <div className="alert alert-success shadow-sm border-0 mb-4 d-flex align-items-center rounded-3">
        <i className="bi bi-briefcase-fill fs-4 me-3 text-success" aria-hidden="true" />
        <div>
          <strong>Panel de Operaciones de {esEmpresa ? 'Empresa' : 'Particular'}.</strong>{' '}
          Gestiona tus solicitudes, trabajos y perfil profesional.
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-success mx-auto">
              <i className="bi bi-inbox fs-2" aria-hidden="true" />
            </div>
            <h5 className="fw-bold mb-2">Nuevas Solicitudes</h5>
            <p className="text-muted small mb-4">Revisa y responde solicitudes de clientes.</p>
            <ButtonCustom
              texto="Ver Solicitudes"
              color="outline-success"
              onClick={() => navigate('/prestador/solicitudes')}
            />
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-success mx-auto">
              <i className="bi bi-calendar-check fs-2" aria-hidden="true" />
            </div>
            <h5 className="fw-bold mb-2">Mis Trabajos</h5>
            <p className="text-muted small mb-4">Consulta tu agenda de servicios aceptados.</p>
            <ButtonCustom
              texto="Ver Trabajos"
              color="outline-success"
              onClick={() => navigate('/prestador/mis-servicios')}
            />
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-success mx-auto">
              <i className={`bi ${esEmpresa ? 'bi-building' : 'bi-person-badge'} fs-2`} aria-hidden="true" />
            </div>
            <h5 className="fw-bold mb-2">Ficha Pública</h5>
            <p className="text-muted small mb-4">Actualiza cómo te ven los clientes en ServiGo.</p>
            <ButtonCustom
              texto="Ver Ficha Técnica"
              color="success"
              onClick={() => navigate('/prestador/perfil')}
            />
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-success mx-auto">
              <i className="bi bi-headset fs-2" aria-hidden="true" />
            </div>
            <h5 className="fw-bold mb-2">Soporte</h5>
            <p className="text-muted small mb-4">¿Necesitas ayuda? Contacta al equipo ServiGo.</p>
            <ButtonCustom
              texto="Centro de Ayuda"
              color="outline-success"
              onClick={() => navigate('/prestador/soporte')}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 bg-white border rounded-4 shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h6 className="fw-bold mb-1">
            <i className="bi bi-shield-lock me-2 text-secondary" aria-hidden="true" />
            Configuración de Seguridad
          </h6>
          <p className="text-muted mb-0 small">Tu cuenta se encuentra protegida.</p>
        </div>
        <div style={{ minWidth: '180px' }}>
          <ButtonCustom
            texto="Editar Cuenta"
            color="outline-secondary"
            onClick={() => navigate('/prestador/perfil')}
          />
        </div>
      </div>
    </CardContainer>
  );
};
