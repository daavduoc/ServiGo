import React from 'react';
import { useNavigate }   from 'react-router-dom';
import { useAuth }       from '../../../context/AuthContext';
import { getDisplayName } from '../../../utils/userDisplay';
import { CardContainer } from '../../ui/CardContainer';
import { ButtonCustom }  from '../../ui/ButtonCustom';
import '../../../assets/css/provider-views.css';

// Componente local — solo se usa en esta vista
const AccesoCard = ({ icon, title, description, buttonText, buttonColor, onClick }) => (
  <div className="col-md-6 col-lg-3">
    <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
      <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-success mx-auto">
        <i className={`bi ${icon} fs-2`} aria-hidden="true" />
      </div>
      <h5 className="fw-bold mb-2">{title}</h5>
      <p className="text-muted small mb-4">{description}</p>
      <ButtonCustom texto={buttonText} color={buttonColor} onClick={onClick} />
    </div>
  </div>
);

export const ProviderResumenPage = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const esEmpresa     = user?.tipoPrestador?.toLowerCase() === 'empresa';
  const nombreVisible = getDisplayName(user);

  return (
    <CardContainer
      titulo={esEmpresa ? `Panel Corporativo: ${nombreVisible}` : `¡Hola de nuevo, ${nombreVisible}!`}
      maxwidth="1100px"
    >
      {/* Inicio seccion de banner informativo */}
      <div className="alert alert-success shadow-sm border-0 mb-4 d-flex align-items-center rounded-3">
        <i className="bi bi-briefcase-fill fs-4 me-3 text-success" aria-hidden="true" />
        <div>
          <strong>Panel de Operaciones de {esEmpresa ? 'Empresa' : 'Particular'}.</strong>{' '}
          Gestiona tus solicitudes, trabajos y perfil profesional.
        </div>
      </div>
      {/* Fin seccion de banner informativo */}

      {/* Inicio seccion de accesos rápidos */}
      <div className="row g-4">
        <AccesoCard
          icon="bi-inbox"
          title="Nuevas Solicitudes"
          description="Revisa y responde solicitudes de clientes."
          buttonText="Ver Solicitudes"
          buttonColor="outline-success"
          onClick={() => navigate('/prestador/solicitudes')}
        />
        <AccesoCard
          icon="bi-calendar-check"
          title="Mis Trabajos"
          description="Consulta tu agenda de servicios aceptados."
          buttonText="Ver Trabajos"
          buttonColor="outline-success"
          onClick={() => navigate('/prestador/mis-servicios')}
        />
        <AccesoCard
          icon={esEmpresa ? 'bi-building' : 'bi-person-badge'}
          title="Ficha Pública"
          description="Actualiza cómo te ven los clientes en ServiGo."
          buttonText="Ver Ficha Técnica"
          buttonColor="success"
          onClick={() => navigate('/prestador/perfil')}
        />
        <AccesoCard
          icon="bi-headset"
          title="Soporte"
          description="¿Necesitas ayuda? Contacta al equipo ServiGo."
          buttonText="Centro de Ayuda"
          buttonColor="outline-success"
          onClick={() => navigate('/prestador/soporte')}
        />
      </div>
      {/* Fin seccion de accesos rápidos */}

      {/* Inicio seccion de configuración de seguridad */}
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
      {/* Fin seccion de configuración de seguridad */}
    </CardContainer>
  );
};
