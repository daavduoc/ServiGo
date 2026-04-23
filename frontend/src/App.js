import React from 'react';
import NavbarInicio from './components/Navbar';

function App() {
  return (
    <div>
      <NavbarInicio />
      <div className="container mt-4">
        <h2>¡Bienvenida a ServiGo!</h2>
        <p>Si ves esto, ¡por fin funcionó la barra!</p>
      </div>
    </div>
  );
}

export default App;