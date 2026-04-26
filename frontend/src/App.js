import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarInicio from './components/layout/Navbar';
import { RegisterView } from './components/view/RegisterView'; 

function App() {
  return (
    <Router>
      <div>
        <NavbarInicio />
        
        <Routes>
          {/* VISTA DE INICIO: Solo se ve en el link "/" */}
          <Route path="/" element={
            <div className="container mt-4">
              <h2>¡Bienvenida a ServiGo!</h2>
              <p>Si ves esto, ¡por fin funcionó la barra!</p>
            </div>
          } />

          {/* vista registrar: Solo se vera en el link "/registro" */}
          <Route path="/registro" element={<RegisterView />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;