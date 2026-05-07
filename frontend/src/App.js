import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Importamos tu nuevo Layout (El sándwich)
import { MainLayout } from './components/layout/MainLayout';

// 2. Importamos las Vistas (Las páginas)
import { HomeView } from './components/view/HomeView';
import { RegisterView } from './components/view/RegisterView';
// ¡Ruta corregida aquí abajo!
import { SearchView } from './components/view/SearchView'; 
import { ProfileView } from './components/view/ProfileView';

function App() {
  return (
    <Router>
      {/* Envolvemos todas las pantallas con el MainLayout para que siempre tengan Navbar y Footer */}
      <MainLayout>
        <Routes>
          {/* Ruta principal: Tu tarea T08 */}
          <Route path="/" element={<HomeView />} />
          
          {/* Ruta de registro */}
          <Route path="/registro" element={<RegisterView />} />

          {/* NUEVA RUTA: Tu buscador (Tarea T11) */}
          <Route path="/buscar" element={<SearchView />} />
          
          <Route path="/perfil" element={<ProfileView />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;