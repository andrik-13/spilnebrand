import { Navigate, createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Product } from './pages/Product';
import { NotFound } from './pages/NotFound';
import { Admin } from './pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/ua" replace />,
  },
  {
    path: '/:locale',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'catalog', Component: Catalog },
      { path: 'catalog/:slug', Component: Product },
      { path: 'admin', Component: Admin },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/ua" replace />,
  },
]);
