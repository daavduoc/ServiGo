// panel de control para los usuarios Clientes y prestador de servicio (generico)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isPrestadorUser } from '../../utils/userDisplay';

// -modulos de UI genericos utilizados desde la carpeta ui
import { Sidebar } from '../ui/Sidebar';
import { CardContainer } from '../ui/CardContainer';
import { ButtonCustom } from '../ui/ButtonCustom';

// IMPORTACIÓN EXACTA DE LAYOUTS PARA EL PRESTADOR DESDE LA CARPETA LAYOUT
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

export const UserDashboardView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Identifica el tipo de usuario para mostrar el contenido correcto
  const esPrestador = isPrestadorUser(user);
  const esEmpresa = user?.tipoPrestador?.toLowerCase() === 'empresa';

  // 2. Vista interna para el CLIENTE genérico
  const ClienteContent = () => (
    <>
      <div className="alert alert-success shadow-sm border-0 mb-4 d-flex align-items-center rounded-3">
        <i className="bi bi-check-circle-fill fs-4 me-3 text-success"></i>
        <div>
          <strong>Panel de Cliente Activo.</strong> Aquí puedes gestionar tus solicitudes y buscar profesionales contratados.
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-success mx-auto">
              <i className="bi bi-calendar-check fs-2"></i>
            </div>
            <h5 className="fw-bold mb-2">Mis Horas y Reservas</h5>
            <p className="text-muted small mb-4">Revisa el estado de tus servicios contratados agendados recientemente.</p>
            <ButtonCustom texto="Ver Agendamientos" color="outline-success" onClick={() => navigate('/mis-reservas')} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-success mx-auto">
              <i className="bi bi-search fs-2"></i>
            </div>
            <h5 className="fw-bold mb-2">Buscar Especialistas</h5>
            <p className="text-muted small mb-4">Encuentra técnicos, profesionales de salud y más servicios en tu zona.</p>
            <ButtonCustom texto="Explorar Catálogo" color="success" onClick={() => navigate('/buscar')} />
          </div>
        </div>
      </div>
    </>
  );

  // 3. Vista interna para el PRESTADOR de servicios (Particular o Empresa)
  const PrestadorContent = () => (
    <>
      <div className="alert alert-primary shadow-sm border-0 mb-4 d-flex align-items-center rounded-3">
        <i className="bi bi-briefcase-fill fs-4 me-3 text-primary"></i>
        <div>
          <strong>Panel de Operaciones de {esEmpresa ? 'Empresa' : 'Particular'}.</strong> Gestiona tus servicios ofrecidos a la comunidad.
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-primary mx-auto">
              <i className="bi bi-list-stars fs-2"></i>
            </div>
            <h5 className="fw-bold mb-2">Mis Servicios</h5>
            <p className="text-muted small mb-4">Configura los precios, áreas y catálogo de lo que ofreces.</p>
            <ButtonCustom texto="Gestionar Catálogo" color="outline-primary" onClick={() => navigate('/mis-servicios')} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-primary mx-auto">
              <i className="bi bi-calendar3 fs-2"></i>
            </div>
            <h5 className="fw-bold mb-2">Agenda de Trabajo</h5>
            <p className="text-muted small mb-4">Controla tus bloques de horas y días disponibles para recibir clientes.</p>
            <ButtonCustom texto="Configurar Agenda" color="outline-primary" onClick={() => navigate('/mi-agenda')} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 p-4 text-center rounded-4 bg-white">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-primary mx-auto">
              <i className={`bi ${esEmpresa ? 'bi-building-up' : 'bi-person-up'} fs-2`}></i>
            </div>
            <h5 className="fw-bold mb-2">Ficha Pública</h5>
            <p className="text-muted small mb-4">Visualiza cómo ven los clientes tus datos en el mapa y perfil.</p>
            <ButtonCustom texto="Ver Ficha Técnica" color="primary" onClick={() => navigate('/prestador/perfil')} />
          </div>
        </div>
      </div>
    </>
  );

  // --- CUERPO INTERNO DEL CONTENEDOR (CARD CONTAINER) ---
  const DashboardCore = () => (
    <CardContainer 
      titulo={esEmpresa ? `Panel Corporativo: ${user?.nombre}` : `¡Hola de nuevo, ${user?.nombre}!`} 
      maxwidth="1100px"
    >
      {/* Muestra dinámicamente las tarjetas según el rol */}
      {esPrestador ? <PrestadorContent /> : <ClienteContent />}

      {/* Configuración de Seguridad inferior común */}
      <div className="mt-5 p-4 bg-white border rounded-4 shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h6 className="fw-bold mb-1">
            <i className="bi bi-shield-lock me-2 text-secondary"></i>Configuración de Seguridad
          </h6>
          <p className="text-muted mb-0 small">Tu cuenta se encuentra protegida. Último acceso registrado hoy.</p>
        </div>
        <div style={{ minWidth: '180px' }}>
          <ButtonCustom 
            texto="Editar Cuenta" 
            color="outline-secondary" 
            onClick={() => navigate(esPrestador ? '/prestador/perfil' : '/perfil')} 
          />
        </div>
      </div>
    </CardContainer>
  );

  // 4. Renderizado Condicional de Maquetación según el Usuario Logueado
  // Si es Cliente, hereda la barra y footer desde ClientLayout (evita duplicar)
  if (!esPrestador) {
    return <DashboardCore />;
  }

  // Si es Prestador, monta aquí mismo su layout completo estructurado con Navbar, Sidebar y Footer
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Encabezado superior */}
      <Navbar />

      {/* Espacio medio del panel */}
      <div className="d-flex flex-grow-1" style={{ backgroundColor: '#f8f9fa', paddingTop: '75px' }}>
        {/* Barra lateral exclusiva del prestador */}
        <Sidebar usuario={user} />

        {/* Tarjetas centrales de operación */}
        <div className="flex-grow-1 p-3 p-md-4 p-lg-5">
          <DashboardCore />
        </div>
      </div>

      {/* Pie de página inferior */}
      <Footer />
    </div>
  );
};