import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarInicio from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BannerInicio from './components/ui/Banner';
import { RegisterView } from './components/view/RegisterView';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavbarInicio />
        
        <div className="container mt-4 flex-grow-1">
          <Routes>
            {/* Esta es tu parte (El inicio con tu Banner) */}
            <Route path="/" element={
              <>
                <BannerInicio />
                <div className="mt-5 text-center">
                  <h2>¡Bienvenida a ServiGo!</h2>
                </div>
              </>
            } />
            
            {/* Esta es la parte de tu compañero */}
            <Route path="/registro" element={<RegisterView />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;