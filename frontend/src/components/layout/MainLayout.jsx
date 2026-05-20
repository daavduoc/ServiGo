import React from 'react';
import NavbarInicio from './Navbar';
import Footer from './Footer';

export const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* El pan de arriba */}
      <NavbarInicio />
      
      {/* El relleno del sándwich (Aquí entrarán las vistas como HomeView o RegisterView) */}
      <div className="container mt-4 flex-grow-1">
        {children}
      </div>
      
      {/* El pan de abajo */}
      <Footer />
    </div>
  );
};