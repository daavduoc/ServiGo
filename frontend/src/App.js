import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Importamos tu nuevo Layout (El sándwich)
import { MainLayout } from './components/layout/MainLayout';

// 2. Importamos las Vistas (Las páginas)
import { HomeView } from './components/view/HomeView';

// Inicio Registro
// Importamos las nuevas piezas modulares del registro
import { RegisterSelectionView } from './components/view/auth/RegisterSelectionView';
import { ClientRegisterView } from './components/view/auth/ClientRegisterView';
import { ProviderRegisterView } from './components/view/auth/ProviderRegisterView';
// FIN DE REGISTRO

function App() {
  return (
    <Router>
      {/* Envolvemos todas las pantallas con el MainLayout para que siempre tengan Navbar y Footer */}
      <MainLayout>
        <Routes>
          {/* Ruta principal: Tu tarea T08 */}
          <Route path="/" element={<HomeView />} />

          {/* Ruta de registro: Modificada para ser modular */}
          {/* 1. Pantalla de decisión */}
          <Route path="/registro" element={<RegisterSelectionView />} />

          {/* 2. Caminos específicos (El RUT será el ID) */}
          <Route path="/registro/cliente" element={<ClientRegisterView />} />
          <Route path="/registro/prestador" element={<ProviderRegisterView />} />

        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;