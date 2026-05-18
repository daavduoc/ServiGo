import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// manejo de auth y mantiene la secion activa 
import { AuthProvider } from './context/AuthContext';

// 1. Importamos tu nuevo Layout (El sándwich)
import { MainLayout } from './components/layout/MainLayout';

// 2. Importamos las Vistas (Las páginas)
import { HomeView } from './components/view/HomeView';
import { SearchView } from './components/view/SearchView';
import { ProfileView } from './components/view/ProfileView';
import SupportView from './components/view/SupportView';

// 3. Importamos el Registro Modular
import { RegisterSelectionView } from './components/view/auth/RegisterSelectionView';
import { ClientRegisterView } from './components/view/auth/ClientRegisterView';
import { ProviderRegisterView } from './components/view/auth/ProviderRegisterView';

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
              <Route path="/registro" element={<RegisterSelectionView />} />
              <Route path="/registro/cliente" element={<ClientRegisterView />} />
              <Route path="/registro/prestador" element={<ProviderRegisterView />} />
              
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
                <Route path="/soporte" element={<SupportView />} />
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