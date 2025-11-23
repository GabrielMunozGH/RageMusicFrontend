
import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { publicLinks } from './data/navbarPublicLinks';
import { adminLinks } from './data/navbarAdminLinks';
import Navbar from './components/organisms/Navbar';
import { appRoutes } from './routes/config';

import { CartProvider } from './context/CartContext';

function Layout() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const currentRoute = appRoutes.find(route => route.path === location.pathname);
  const showNavbar = isAdminRoute || (currentRoute ? currentRoute.showNavbar !== false : true);
  const navbarLinks = isAdminRoute ? adminLinks : publicLinks;

  return (
    <>
      {showNavbar && <Navbar links={navbarLinks} />}

      <main className={showNavbar ? 'pt-16' : ''}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          }
        >
          <Routes>
            {appRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Layout />
    </CartProvider>
  );
}

export default App;
