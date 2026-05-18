import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Maneja la sesion del usuario
import { AuthProvider } from './context/AuthContext';

// 1. Importamos tu nuevo Layout (El sándwich)
import { MainLayout } from './components/layout/MainLayout';

// 2. Importamos las Vistas (Las páginas)
import { HomeView } from './components/view/HomeView';
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

// --- VISTAS DE USUARIOS ---
import { ClientDashboard } from './components/view/ClientDashboard';
import { ProviderDashboard } from './components/view/ProviderDashboard';

import { ClientLayout } from './components/ui/ClientLayout';
// Importamos el layout y vistas del admin
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './components/view/AdminDashboard';
import AdminUsuariosView from './components/view/AdminUsuariosView';
import AdminPrestadoresView from './components/view/AdminPrestadoresView';
import AdminServiciosView from './components/view/AdminServiciosView';
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

            {/* --- REGISTRO MODULAR --- */}
            <Route path="/registro" element={<RegisterSelectionView />} />
            <Route path="/registro/cliente" element={<ClientRegisterView />} />
            <Route path="/registro/prestador" element={<ProviderRegisterView />} />

            {/* --- RUTA DE PRUEBA PARA LA CÁMARA --- 
                  Ingresa a http://localhost:3000/test-camara para probarla */}
            <Route path="/test-camara" element={<CameraCaptureView modo="verificacion" />} />

            {/* El dashboard del prestador va aparte, porque él tendrá su propia vista/menú */}
            <Route path="/dashboard-prestador" element={<ProviderDashboard />} />

            {/* Buscador público: accesible desde el banner sin estar registrado */}
            <Route path="/buscar" element={<SearchView />} />

            {/* =========================================
                  2. RUTAS PRIVADAS DEL CLIENTE
                  (Todas estas páginas SÍ tendrán el Sidebar a la izquierda)
                  ========================================= */}
            <Route element={<ClientLayout />}>
              <Route path="/dashboard-cliente" element={<ClientDashboard />} />
              <Route path="/perfil" element={<ProfileView />} />
              <Route path="/mis-reservas" element={<h2>Mis Horas y Reservas</h2>} />
            </Route>

            {/* Rutas para administrador */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminUsuariosView />} />
              <Route path="/admin/prestadores" element={<AdminPrestadoresView />} />
              <Route path="/admin/servicios" element={<AdminServiciosView />} />
              <Route path="/admin/solicitudes" element={<AdminSolicitudesView />} />
              <Route path="/admin/reportes" element={<AdminReportesView />} />
              <Route path="/admin/auditoria" element={<AdminAuditoriaView />} />
            </Route>

          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;