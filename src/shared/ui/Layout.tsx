import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 