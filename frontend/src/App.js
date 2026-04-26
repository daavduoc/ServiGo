import React from 'react';
import NavbarInicio from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarInicio />
      <div className="container mt-4 flex-grow-1">
        <h2>¡Bienvenida a ServiGo!</h2>
        <p>Si ves esto, ¡por fin funcionó la barra!</p>
      </div>
      <Footer />
    </div>
  );
}

export default App;