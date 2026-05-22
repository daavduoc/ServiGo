import React from 'react';
import NavbarInicio from './Navbar';
import Footer from './Footer';
import { ScrollToTop } from './ScrollToTop';

export const MainLayout = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      <NavbarInicio />
      <div className="servigo-page d-flex flex-column min-vh-100">
        <div className="container mt-4 flex-grow-1">{children}</div>
        <Footer />
      </div>
    </>
  );
};
