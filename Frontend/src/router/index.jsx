import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../home/pages/Home";
import NotFound from "../pages/NotFound";
import LayoutAlmacenNav from "./../layout/LayoutAlmacenNav";
import LayoutMoliendaNav from "./../layout/LayoutMoliendaNav";
import { RouterAlmacen } from "../almacen/router/router";
import { RouterMolienda } from "./../molienda/router/router";
import LayoutSeleccionNav from "./../layout/LayoutSeleccionNav";
import { RouterSeleccion } from "./../seleccion/router/router";
import { ProtectedRoute } from "../components/ProtectedLayout";
import { Login } from "./../auth/pages/Login";

export const router = createBrowserRouter([
  {
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />,
      },
      {
        path: "almacen",
        element: <LayoutAlmacenNav />,
        children: RouterAlmacen,
      },
      {
        path: "molienda",
        element: <LayoutMoliendaNav />,
        children: RouterMolienda,
      },
      {
        path: "seleccion",
        element: <LayoutSeleccionNav />,
        children: RouterSeleccion,
      },
    ]
  },
]);
