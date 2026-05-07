import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <Router>
      {/* Envolvemos todas las pantallas con el MainLayout para que siempre tengan Navbar y Footer */}
      <MainLayout>
        <Routes>
          {/* Ruta principal: Tu tarea T08 */}
          <Route path="/" element={<HomeView />} />

          {/* Rutas de registro modular */}
          <Route path="/registro" element={<RegisterSelectionView />} />
          <Route path="/registro/cliente" element={<ClientRegisterView />} />
          <Route path="/registro/prestador" element={<ProviderRegisterView />} />

          {/* NUEVA RUTA: Tu buscador (Tarea T11) */}
          <Route path="/buscar" element={<SearchView />} />

          <Route path="/perfil" element={<ProfileView />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;