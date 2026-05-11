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

// 3. Importamos el Registro Modular
import { RegisterSelectionView } from './components/view/auth/RegisterSelectionView';
import { ClientRegisterView } from './components/view/auth/ClientRegisterView';
import { ProviderRegisterView } from './components/view/auth/ProviderRegisterView';

import { ClientDashboard } from './components/view/ClientDashboard';
import { ProviderDashboard } from './components/view/ProviderDashboard';


import { ClientLayout } from './components/ui/ClientLayout';


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

              {/* =========================================
                  2. RUTAS PRIVADAS DEL CLIENTE
                  (Todas estas páginas SÍ tendrán el Sidebar a la izquierda)
                  ========================================= */}
              <Route element={<ClientLayout />}>
                <Route path="/dashboard-cliente" element={<ClientDashboard />} />
                <Route path="/perfil" element={<ProfileView />} />
                {/* Dejamos tu SearchView real para que busque con el mapa */}
                <Route path="/buscar" element={<SearchView />} /> 
                <Route path="/editar-perfil" element={<h2>Aquí irá el formulario de edición</h2>} />
              </Route>
          
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;