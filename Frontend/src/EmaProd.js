import { createBrowserRouter } from "react-router-dom";

// PAGES IMPORTADOS
import { Login } from "./auth/pages/Login";
import Home from "./home/pages/Home";

// ROUTERS IMPORTADOS
import { RouterAlmacen } from './almacen/router/router';
import { RouterMolienda } from './molienda/router/router';
import { RouterSeleccion } from './seleccion/router/router';
import { RouterProduccion } from './produccion/router/router';

// PLANTILLA NOT FOUND
import NotFound from './pages/NotFound';

// PROTECCION DE RUTAS PERSONALIZADAS
import { AuthLayout } from "./components/AuthLayout";
import { ProtectedLayoutAlmacen } from "./components/ProtectedLayoutAlmacen";
import { ProtectedLayoutMolienda } from './components/ProtectedLayoutMolienda';
import { ProtectedLayoutSeleccion } from './components/ProtectedLayoutSeleccion';
import { ProtectedLayoutProduccion } from "./components/ProtectedLayoutProduccion";

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
        element: <ProtectedLayoutAlmacen />,
        children: RouterAlmacen,
      },
      {
        path: "/molienda",
        element: <ProtectedLayoutMolienda />,
        children: RouterMolienda,
      },
      {
        path: "/seleccion",
        element: <ProtectedLayoutSeleccion />,
        children: RouterSeleccion,
      },
      {
        path: "/produccion",
        element: <ProtectedLayoutProduccion />,
        children: RouterProduccion
      }
    ],
  },
]);
