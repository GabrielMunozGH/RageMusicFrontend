import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { publicLinks } from './data/navbarPublicLinks';
import { adminLinks } from './data/navbarAdminLinks';
import Navbar from './components/organisms/Navbar';
import { appRoutes } from './routes/config';

function Layout() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const currentRoute = appRoutes.find(route => route.path === location.pathname);
  // Si currentRoute existe usa su propiedad showNavbar, si no (ej: 404), muestra por defecto
  const showNavbar = isAdminRoute || (currentRoute ? currentRoute.showNavbar : true);

  const navbarLinks = isAdminRoute ? adminLinks : publicLinks;
  
  // Eliminamos el prop 'title' porque ya está fijo dentro del componente Navbar
  
  return (
    <>
      {showNavbar && <Navbar links={navbarLinks} />}

      {/* AGREGAMOS 'pt-16' AQUÍ PARA QUE EL NAVBAR NO TAPE EL CONTENIDO */}
      <main className={showNavbar ? "pt-16" : ""}>
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
  return <Layout />;
}

export default App;