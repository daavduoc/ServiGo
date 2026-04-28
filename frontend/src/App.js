import React from 'react';
import NavbarInicio from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BannerInicio from './components/ui/Banner';
function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarInicio />
      <BannerInicio/>
      <div className="container mt-4 flex-grow-1">
        <h2>¡Bienvenida a ServiGo!</h2>
        <p>Si ves esto, ¡por fin funcionó la barra!</p>
        
      </div>
      <Footer />
    </div>
  );
}

export default App;