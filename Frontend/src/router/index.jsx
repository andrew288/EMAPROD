import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../home/pages/Home";
import NotFound from "../pages/NotFound";
import LayoutAlmacenNav from "./../layout/LayoutAlmacenNav";
import LayoutMoliendaNav from "./../layout/LayoutMoliendaNav";
import HomeMolienda from "../molienda/pages/HomeMolienda";
import { RouterAlmacen } from "../almacen/router/router";
import { RouterMolienda } from "./../molienda/router/router";

export const router = createBrowserRouter([
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
]);
