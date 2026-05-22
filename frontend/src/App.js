import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ServiceDetailView } from './components/view/ServiceDetailView';
import { ClientReservationsView } from './components/view/ClientReservationsView';
import { NotificationsView } from './components/view/NotificationsView';
import { NotFoundView } from './components/view/NotFoundView'; 

// Maneja la sesion del usuario
import { AuthProvider } from './context/AuthContext';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { ClientLayout } from './components/ui/ClientLayout';
import AdminLayout from './components/layout/AdminLayout';

// Vistas Públicas y Generales
import { HomeView } from './components/view/HomeView';
import { UneteComoEspecialistaView } from './components/view/UneteComoEspecialistaView';
import { PoliticasView } from './components/view/PoliticasView';
import { SearchView } from './components/view/SearchView';
import { ProfileView } from './components/view/ProfileView';

// Autenticación y Registro Modular
import { RegisterSelectionView } from './components/view/auth/RegisterSelectionView';
import { ClientRegisterView } from './components/view/auth/ClientRegisterView';
import { ProviderRegisterView } from './components/view/auth/ProviderRegisterView';
import { RecoverPasswordView } from './components/view/auth/RecoverPasswordView';
import { VerifyEmailView } from './components/view/auth/VerifyEmailView';

// --- VISTAS GENÉRICAS Y DE CLIENTE ---
import { UserDashboardView } from './components/view/UserDashboardView'; 
import SupportView from './components/view/SupportView'; 

// --- VISTAS DEL PRESTADOR ---
import { ProviderServicesView } from './components/view/ProviderServicesView'; 
import { ProviderProfileView } from './components/view/ProviderProfileView';   

// --- VISTAS DE ADMINISTRADOR ---
import AdminDashboard from './components/view/AdminDashboard';
import AdminUsuariosView from './components/view/AdminUsuariosView';
import AdminPrestadoresView from './components/view/AdminPrestadoresView';
import AdminServiciosView from './components/view/AdminServiciosView';
import AdminSolicitudesView from './components/view/AdminSolicitudesView';
import AdminReportesView from './components/view/AdminReportesView';
import AdminAuditoriaView from './components/view/AdminAuditoriaView';

// Cámara para Pruebas
import { CameraCaptureView } from './components/view/CameraCaptureView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* =========================================================
              1. VISTAS PÚBLICAS (Envueltas individualmente con MainLayout)
             ========================================================= */}
          <Route path="/" element={<MainLayout><HomeView /></MainLayout>} />
          <Route path="/recuperar-password" element={<MainLayout><RecoverPasswordView /></MainLayout>} />
          <Route path="/verificar-correo" element={<MainLayout><VerifyEmailView /></MainLayout>} />
          <Route path="/registro" element={<MainLayout><RegisterSelectionView /></MainLayout>} />
          <Route path="/registro/cliente" element={<MainLayout><ClientRegisterView /></MainLayout>} />
          <Route path="/registro/prestador" element={<MainLayout><ProviderRegisterView /></MainLayout>} />
          <Route path="/buscar" element={<MainLayout><SearchView /></MainLayout>} />
          <Route path="/unete-especialista" element={<MainLayout><UneteComoEspecialistaView /></MainLayout>} />
          <Route path="/unete-como-especialista" element={<MainLayout><UneteComoEspecialistaView /></MainLayout>} />
          <Route path="/politicas" element={<MainLayout><PoliticasView /></MainLayout>} />
          <Route path="/test-camara" element={<MainLayout><CameraCaptureView modo="verificacion" /></MainLayout>} />

          {/* =========================================================
              2 y 3. PANEL PRIVADO INTEGRADO (Hereda Navbar, Sidebar y Footer)
              Tanto el cliente como el prestador usan este contenedor global.
             ========================================================= */}
          <Route element={<ClientLayout />}>
            {/* Rutas específicas del Cliente */}
            <Route path="/dashboard-cliente" element={<UserDashboardView />} />
            <Route path="/perfil" element={<ProfileView />} />
            <Route path="/mis-reservas" element={<ClientReservationsView />} />
            <Route path="/soporte" element={<SupportView />} /> 
            <Route path="/servicio-detalle" element={<ServiceDetailView />} /> 
            <Route path="/notificaciones" element={<NotificationsView />} />

            {/* Rutas específicas del Prestador (¡Ahora protegidas dentro de la estructura!) */}
            <Route path="/dashboard-prestador" element={<UserDashboardView />} /> 
            <Route path="/prestador/mis-servicios" element={<ProviderServicesView />} /> 
            <Route path="/prestador/perfil" element={<ProviderProfileView />} /> 
          </Route>

          {/* =========================================================
              4. RUTAS DEL ADMINISTRADOR
             ========================================================= */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<AdminUsuariosView />} />
            <Route path="/admin/prestadores" element={<AdminPrestadoresView />} />
            <Route path="/admin/servicios" element={<AdminServiciosView />} />
            <Route path="/admin/solicitudes" element={<AdminSolicitudesView />} />
            <Route path="/admin/reportes" element={<AdminReportesView />} />
            <Route path="/admin/auditoria" element={<AdminAuditoriaView />} />
          </Route>

          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;