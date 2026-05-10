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

function App() {
  return (
    //  Envolvemos la app para que reconozca a los usuarios utilizando { ej: vista }
    <AuthProvider>
      <Router>
        {/* habilitacion del layout */}
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/registro" element={<RegisterSelectionView />} />
            <Route path="/registro/cliente" element={<ClientRegisterView />} />
            <Route path="/registro/prestador" element={<ProviderRegisterView />} />
            <Route path="/buscar" element={<SearchView />} />
            <Route path="/perfil" element={<ProfileView />} />
            <Route path="/dashboard-cliente" element={<ClientDashboard />} />
            <Route path="/dashboard-prestador" element={<ProviderDashboard />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;