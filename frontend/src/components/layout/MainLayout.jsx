import React from 'react';
import { useLocation } from 'react-router-dom';
import NavbarInicio from './Navbar';
import Footer from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { isFullBleedPublicRoute } from '../../utils/layoutRoutes';

export const MainLayout = ({ children }) => {
  const { pathname } = useLocation();
  const fullBleed = isFullBleedPublicRoute(pathname);

  return (
    <>
      <ScrollToTop />
      <NavbarInicio />
      <div className="servigo-page d-flex flex-column min-vh-100">
        {fullBleed ? (
          <main className="flex-grow-1">{children}</main>
        ) : (
          <div className="container mt-4 flex-grow-1">{children}</div>
        )}
        <Footer />
      </div>
    </>
  );
};
