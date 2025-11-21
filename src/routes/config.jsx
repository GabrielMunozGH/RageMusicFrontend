import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';



const Home = lazy(() => import('../pages/user/Home'));

const Login = lazy(() => import('../pages/auth/login'));

const CreateUser = lazy(() => import('../pages/auth/create-user'));

const HomeAdmin = lazy(() => import('../pages/admin/HomeAdmin'));

const HomeFacciones = lazy(() => import('../pages/admin/Facciones/HomeFacciones'));

const Productos = lazy(() => import('../pages/user/Productos'));

const Perfil = lazy(() => import('../pages/user/Perfil'));

const MisCompras = lazy(() => import('../pages/user/MisCompras'));



const ProtectedRoute = ({ children, adminOnly = false }) => {

  const { user, loading } = useAuth();



  if (loading) {

    return <div className="p-10 text-center">Verificando sesión...</div>;

  }



  if (!user) {

    return <Navigate to="/login" replace />;

  }



  const esAdmin = user.rol?.id === 1 || user.rol?.id === 2 || user.rol === 'ADMIN';

 

  if (adminOnly && !esAdmin) {

    return <Navigate to="/" replace />;

  }



  return children;

};



const publicRoutes = [

  { path: '/', element: <Home />, showNavbar: true },

  { path: '/login', element: <Login />, showNavbar: false },

  { path: '/auth/login', element: <Login />, showNavbar: false },

  { path: '/create-user', element: <CreateUser />, showNavbar: false },

  { path: '/productos', element: <Productos />, showNavbar: true },

];



const userRoutes = [

  {

    path: '/perfil',

    element: (

      <ProtectedRoute>

        <Perfil />

      </ProtectedRoute>

    ),

    showNavbar: true

  },

  {

    path: '/mis-compras',

    element: (

      <ProtectedRoute>

        <MisCompras />

      </ProtectedRoute>

    ),

    showNavbar: true

  }

];



const adminRoutes = [

  {

    path: '/admin/dashboard',

    element: (

      <ProtectedRoute adminOnly={true}>

        <HomeAdmin />

      </ProtectedRoute>

    ),

    isAdmin: true

  },

  {

    path: '/admin/facciones',

    element: (

      <ProtectedRoute adminOnly={true}>

        <HomeFacciones />

      </ProtectedRoute>

    ),

    isAdmin: true

  },

];



const notFoundRoute = {

  path: '*',

  element: <div className="text-center py-10 text-2xl">404 - Página no encontrada u.u</div>,

  showNavbar: false,

};



export const appRoutes = [...publicRoutes, ...userRoutes, ...adminRoutes, notFoundRoute];