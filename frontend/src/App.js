import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ServiceDetailView } from './components/view/ServiceDetailView';
import { ClientReservationsView } from './components/view/ClientReservationsView';
import { NotificationsView } from './components/view/NotificationsView';
import { NotFoundView } from './components/view/NotFoundView'; 

// Maneja la sesion del usuario
import { AuthProvider } from './context/AuthContext';

// 1. Importamos tu nuevo Layout (El sándwich)
import { MainLayout } from './components/layout/MainLayout';

// 2. Importamos las Vistas (Las páginas)
import { HomeView } from './components/view/HomeView';
import { UneteComoEspecialistaView } from './components/view/UneteComoEspecialistaView';
import { PoliticasView } from './components/view/PoliticasView';
import { SearchView } from './components/view/SearchView';
import { ProfileView } from './components/view/ProfileView';

// --- IMPORTACIÓN DE LA CÁMARA PARA PRUEBAS ---
import { CameraCaptureView } from './components/view/CameraCaptureView';

// 3. Importamos el Registro Modular
import { RegisterSelectionView } from './components/view/auth/RegisterSelectionView';
import { ClientRegisterView } from './components/view/auth/ClientRegisterView';
import { ProviderRegisterView } from './components/view/auth/ProviderRegisterView';

// 4. Importamos la vista para recuperar contraseña
import { RecoverPasswordView } from './components/view/auth/RecoverPasswordView';
import { RecoverPasswordResetView } from './components/view/auth/RecoverPasswordResetView';
import { VerifyEmailView } from './components/view/auth/VerifyEmailView';
import { RegistroPrestadorConfirmacionView } from './components/view/auth/RegistroPrestadorConfirmacionView';

// --- VISTAS DE USUARIOS ---
import { ClientDashboard } from './components/view/ClientDashboard';
import SupportView from './components/view/SupportView';

// ===== NUEVAS VISTAS MODULARES DEL PRESTADOR DIRECTAS =====
import { ProviderResumenPage }          from './components/view/provider/ProviderResumenPage';
import { ProviderSolicitudesPage }      from './components/view/provider/ProviderSolicitudesPage';
import { ProviderTrabajosPage }         from './components/view/provider/ProviderTrabajosPage';
import { ProviderPerfilPage }           from './components/view/provider/ProviderPerfilPage';
// Importamos la vista para ingresar servicios del prestador
import { ProviderIngresarServicioPage } from './components/view/provider/ProviderIngresarServicioPage';

import { ClientLayout } from './components/ui/ClientLayout';
import { ProviderLayout } from './components/ui/ProviderLayout';
// Importamos el layout y vistas del admin
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './components/view/AdminDashboard';
import AdminUsuariosView from './components/view/AdminUsuariosView';
import AdminPrestadoresView from './components/view/AdminPrestadoresView';
import AdminSoporteView from './components/view/AdminSoporteView';
import AdminSolicitudesView from './components/view/AdminSolicitudesView';
import AdminReportesView from './components/view/AdminReportesView';
import AdminAuditoriaView from './components/view/AdminAuditoriaView';

/* =========================================================================
   GUÍA DE IMPLEMENTACIONES FUTURAS (CÁMARA MODULAR)
   -------------------------------------------------------------------------
   Actualmente la camara esta en una ruta separada solo para pruebas
   Cuando se tenga que unir la cámara a tus vistas reales, ya no se usará una ruta 
   separada. En su lugar, abrirás el archivo de la vista (ej: ProfileView.jsx), 
   importarás la cámara y la colocarás dentro del HTML así:
   
   1. Si el usuario quiere cambiar su foto de perfil en ProfileView.jsx: 
      <CameraCaptureView modo="perfil" />

   2. Para el Login Biométrico o control de seguridad: 
      <CameraCaptureView modo="verificacion" />

   3. Para capturar el rostro durante el registro (ClientRegisterView.jsx):
      <CameraCaptureView modo="registro" />
   ========================================================================= */

function App() {
  return (
    //  Envolvemos la app para que reconozca a los usuarios utilizando { ej: vista }
    <AuthProvider>
      <Router>
        {/* habilitacion del layout */}
        <MainLayout>
          <Routes>

            {/* =========================================
                  1. RUTAS PÚBLICAS Y GENERALES
                  (Aquí NO se muestra el Sidebar del cliente)
                  ========================================= */}
            <Route path="/" element={<HomeView />} />

            {/* --- LOGIN Y RECUPERACIÓN --- */}
            {/* <Route path="/login" element={<LoginView />} /> - IMPORTANTE: LoginView no está definido. Comentado para evitar crasheo */}
            <Route path="/recuperar-password" element={<RecoverPasswordView />} />
            <Route
              path="/recuperar-password/restablecer"
              element={<RecoverPasswordResetView />}
            />
            <Route path="/verificar-correo" element={<VerifyEmailView />} />

            {/* --- REGISTRO MODULAR --- */}
            <Route path="/registro" element={<RegisterSelectionView />} />
            <Route path="/registro/cliente" element={<ClientRegisterView />} />
            <Route path="/registro/prestador" element={<ProviderRegisterView />} />
            <Route
              path="/registro/prestador/confirmacion"
              element={<RegistroPrestadorConfirmacionView />}
            />

            {/* --- RUTA DE PRUEBA PARA LA CÁMARA --- 
                  Ingresa a http://localhost:3000/test-camara para probarla */}
            <Route path="/test-camara" element={<CameraCaptureView modo="verificacion" />} />

            {/* Buscador público: accesible desde el banner sin estar registrado */}
            <Route path="/buscar" element={<SearchView />} />
            <Route path="/servicio-detalle/:id" element={<ServiceDetailView />} />
            <Route path="/unete-especialista" element={<UneteComoEspecialistaView />} />
            {/* Alias por si el enlace antiguo apuntaba al formulario directo desde el menú */}
            <Route path="/unete-como-especialista" element={<UneteComoEspecialistaView />} />
            <Route path="/politicas" element={<PoliticasView />} />

            {/* =========================================
                  2. RUTAS PRIVADAS DEL CLIENTE
                  (Todas estas páginas SÍ tendrán el Sidebar a la izquierda)
                  ========================================= */}
            <Route element={<ClientLayout />}>
              <Route path="/dashboard-cliente" element={<ClientDashboard />} />
              <Route path="/perfil" element={<ProfileView />} />
               {/* Reemplaza la que tiene el <h2> por esta: */}
              <Route path="/mis-reservas" element={<ClientReservationsView />} />
              <Route path="/soporte" element={<SupportView />} /> {/* <-- CAMBIO 2: Conectamos la ruta con tu formulario */}
              <Route path="/notificaciones" element={<NotificationsView />} />
            </Route>

            {/* Prestado De servicio Panel privado del prestador (sidebar y rutas propias) */}
            <Route element={<ProviderLayout />}>
              <Route path="/dashboard-prestador" element={<ProviderResumenPage />} />
              <Route path="/prestador/solicitudes" element={<ProviderSolicitudesPage />} />
              
              {/*  formulario para ingresar servicio */}
              <Route path="/prestador/ingresar-servicio" element={<ProviderIngresarServicioPage />} />
              
              <Route path="/prestador/mis-servicios" element={<ProviderTrabajosPage />} />
              <Route path="/prestador/perfil" element={<ProviderPerfilPage />} />
              <Route path="/prestador/soporte" element={<SupportView />} />
              <Route path="/prestador/notificaciones" element={<NotificationsView />} />
            </Route>
            {/*fin rutas del prestador de servicio */}

            {/* Rutas para administrador */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminUsuariosView />} />
              <Route path="/admin/prestadores" element={<AdminPrestadoresView />} />
              <Route path="/admin/soporte" element={<AdminSoporteView />} />
              <Route path="/admin/solicitudes" element={<AdminSolicitudesView />} />
              <Route path="/admin/reportes" element={<AdminReportesView />} />
              <Route path="/admin/auditoria" element={<AdminAuditoriaView />} />
            </Route>

            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;