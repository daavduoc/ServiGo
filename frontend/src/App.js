import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Importamos tu nuevo Layout (El sándwich)
import { MainLayout } from './components/layout/MainLayout';

// 2. Importamos las Vistas (Las páginas)
import { HomeView } from './components/view/HomeView';
<<<<<<< HEAD
import { RegisterView } from './components/view/RegisterView';
// ¡Ruta corregida aquí abajo!
import { SearchView } from './components/view/SearchView'; 
import { ProfileView } from './components/view/ProfileView';
=======

// Inicio Registro
// Importamos las nuevas piezas modulares del registro
import { RegisterSelectionView } from './components/view/auth/RegisterSelectionView';
import { ClientRegisterView } from './components/view/auth/ClientRegisterView';
import { ProviderRegisterView } from './components/view/auth/ProviderRegisterView';
// FIN DE REGISTRO
>>>>>>> feature/registro

function App() {
  return (
    <Router>
      {/* Envolvemos todas las pantallas con el MainLayout para que siempre tengan Navbar y Footer */}
      <MainLayout>
        <Routes>
          {/* Ruta principal: Tu tarea T08 */}
          <Route path="/" element={<HomeView />} />
<<<<<<< HEAD
          
          {/* Ruta de registro */}
          <Route path="/registro" element={<RegisterView />} />

          {/* NUEVA RUTA: Tu buscador (Tarea T11) */}
          <Route path="/buscar" element={<SearchView />} />
          
          <Route path="/perfil" element={<ProfileView />} />
=======

          {/* Ruta de registro: Modificada para ser modular */}
          {/* 1. Pantalla de decisión */}
          <Route path="/registro" element={<RegisterSelectionView />} />

          {/* 2. Caminos específicos (El RUT será el ID) */}
          <Route path="/registro/cliente" element={<ClientRegisterView />} />
          <Route path="/registro/prestador" element={<ProviderRegisterView />} />

>>>>>>> feature/registro
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;