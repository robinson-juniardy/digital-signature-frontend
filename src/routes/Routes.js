import { useRoutes, Navigate } from 'react-router-dom';
import SuratKeluar from '../pages/Surat/keluar';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import OperatorHome from '../pages/operator/home';
import SuratMasuk from '../pages/Surat/masuk';
import AdminHome from '../pages/admin/home';
import EselonHome from '../pages/eselon/Home';
import Login from '../components/Login';
import PrivateRoute from '../components/guard/PrivateRoute';
import PublicRoute from '../components/guard/PublicRoute';
import OpdHome from '../pages/ka_opd/Home';
import DataManagement from '../pages/admin/management/DataManagement';

const Routes = () => {
  return useRoutes([
    {
      path: '/operator',
      element: <PrivateRoute />,
      children: [
        {
          path: '/operator',
          element: <MainLayout />,
          children: [
            {
              path: 'home',
              element: <OperatorHome />,
              //   index: true,
            },
            {
              path: 'suratmasuk',
              element: <SuratMasuk />,
            },
            {
              path: 'suratKeluar',
              element: <SuratKeluar />,
            },
          ],
        },
      ],
    },
    {
      path: '/admin',
      element: <PrivateRoute />,
      children: [
        {
          path: '/admin',
          element: <MainLayout />,
          children: [
            {
              path: 'home',
              element: <AdminHome />,
              //   index: true,
            },
            {
              path: 'suratmasuk',
              element: <SuratMasuk />,
            },
            {
              path: 'suratKeluar',
              element: <SuratKeluar />,
            },
            {
              path: 'data-management',
              element: <DataManagement />,
            },
          ],
        },
      ],
    },
    {
      path: '/staff',
      element: <PrivateRoute />,
      children: [
        {
          path: '/staff',
          element: <MainLayout />,
          children: [
            {
              path: 'home',
              element: <EselonHome />,
              //   index: true,
            },
          ],
        },
      ],
    },
    {
      path: '/es',
      element: <PrivateRoute />,
      children: [
        {
          path: '/es',
          element: <MainLayout />,
          children: [
            {
              path: 'home',
              element: <EselonHome />,
              //   index: true,
            },
          ],
        },
      ],
    },
    {
      path: '/opd',
      element: <PrivateRoute />,
      children: [
        {
          path: '/opd',
          element: <MainLayout />,
          children: [
            {
              path: 'home',
              element: <OpdHome />,
              //   index: true,
            },
            {
              path: 'suratmasuk',
              element: <SuratMasuk />,
            },
            {
              path: 'suratKeluar',
              element: <SuratKeluar />,
            },
          ],
        },
      ],
    },

    {
      path: '/',
      element: <PublicRoute />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },

        {
          path: '/',
          element: <Navigate to="/login" />,
        },
      ],
    },
  ]);
};

export default Routes;
