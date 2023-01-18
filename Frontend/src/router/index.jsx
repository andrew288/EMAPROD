import React from 'react';
import { createBrowserRouter} from 'react-router-dom';
import Home from '../home/pages/Home';
import NotFound from '../pages/NotFound';
import LayoutAlmacenNav from './../layout/LayoutAlmacenNav';
import LayoutMoliendaNav from './../layout/LayoutMoliendaNav';
import HomeAlmacen from './../almacen/pages/HomeAlmacen';
import HomeMolienda from '../molienda/pages/HomeMolienda';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <NotFound/>
  },
  {
    path: "almacen",
    element: <LayoutAlmacenNav/>,
    children: [
      {
        path: "",
        element: <HomeAlmacen/>
      },
    ]
  },
  {
    path: "molienda",
    element: <LayoutMoliendaNav />,
    children: [
      {
        path: "",
        element: <HomeMolienda />,
      },
    ]
  },
]);
