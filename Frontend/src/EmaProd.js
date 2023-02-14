import { createBrowserRouter, defer } from "react-router-dom";
import { AuthLayout } from "./components/AuthLayout";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { Login } from "./auth/pages/Login";
import Home from "./home/pages/Home";
import { RouterAlmacen } from './almacen/router/router';
import { RouterMolienda } from './molienda/router/router';
import { RouterSeleccion } from './seleccion/router/router';
import LayoutMoliendaNav from './layout/LayoutMoliendaNav';
import NotFound from './pages/NotFound';
import LayoutSeleccionNav from './layout/LayoutSeleccionNav';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/almacen",
        element: <ProtectedLayout />,
        children: RouterAlmacen,
      },
      {
        path: "/molienda",
        element: <LayoutMoliendaNav />,
        children: RouterMolienda,
      },
      {
        path: "/seleccion",
        element: <LayoutSeleccionNav />,
        children: RouterSeleccion,
      },
    ],
  },
]);
