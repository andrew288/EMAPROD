import React from 'react';
import { createBrowserRouter} from 'react-router-dom';
import Home from '../home/pages/Home';
import NotFound from '../pages/NotFound';
import LayoutAlmacenNav from './../layout/LayoutAlmacenNav';
import LayoutMoliendaNav from './../layout/LayoutMoliendaNav';
import HomeAlmacen from './../almacen/pages/HomeAlmacen';
import HomeMolienda from '../molienda/pages/HomeMolienda';
import AgregarMateriaPrima from '../almacen/pages/materiaPrima/AgregarMateriaPrima';
import ListMateriaPrima from '../almacen/pages/materiaPrima/ListMateriaPrima';
import LayoutMateriaPrima from './../layout/materiaPrima/LayoutMateriaPrima';
import LayoutProveedor from './../layout/proveedor/LayoutProveedor';
import AgregarProveedor from './../almacen/pages/proveedor/AgregarProveedor';
import ListProveedor from './../almacen/pages/proveedor/ListProveedor';
import ActualizarProveedor from '../almacen/pages/proveedor/ActualizarProveedor';
import ActualizarMateriaPrima from '../almacen/pages/materiaPrima/ActualizarMateriaPrima';
import LayoutEntradaStock from '../layout/entradaStock/LayoutEntradaStock';
import ListEntradaStock from './../almacen/pages/entradasStock/ListEntradaStock';
import AgregarEntradaStock from '../almacen/pages/entradasStock/AgregarEntradaStock';
import ActualizarEntradaStock from '../almacen/pages/entradasStock/ActualizarEntradaStock';
import LayoutSalidaStock from '../layout/salidaStock/LayoutSalidaStock';
import ListSalidaStock from '../almacen/pages/salidasStocks/ListSalidaStock';
import AgregarSalidaStock from '../almacen/pages/salidasStocks/AgregarSalidaStock';
import ActualizarSalidaStock from '../almacen/pages/salidasStocks/ActualizarSalidaStock';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <NotFound/>,
  },
  {
    path: "almacen",
    element: <LayoutAlmacenNav/>,
    children: [
      {
        path: "",
        element: <HomeAlmacen/>,
      },
      {
        path: "materia-prima",
        element: <LayoutMateriaPrima/>,
        children: [
          {
            path: "",
            element: <ListMateriaPrima/>,
          },
          {
            path: "crear",
            element: <AgregarMateriaPrima/>,
          },
          {
            path: "actualizar",
            element: <ActualizarMateriaPrima/>,
          },
        ]
      },
      {
        path: "proveedor",
        element: <LayoutProveedor/>,
        children: [
          {
            path: "",
            element: <ListProveedor/>,
          },
          {
            path: "crear",
            element: <AgregarProveedor/>,
          },
          {
            path: "actualizar",
            element: <ActualizarProveedor/>,
          },
        ]
      },
      {
        path: "entradas-stock",
        element: <LayoutEntradaStock/>,
        children: [
          {
            path: "",
            element: <ListEntradaStock/>
          },
          {
            path: "crear",
            element: <AgregarEntradaStock/>
          },
          {
            path: "actualizar",
            element: <ActualizarEntradaStock/>
          },
        ]
      },
      {
        path: "salidas-stock",
        element: <LayoutSalidaStock/>,
        children: [
          {
            path: "",
            element: <ListSalidaStock/>
          },
          {
            path: "crear",
            element: <AgregarSalidaStock/>
          },
          {
            path: "actualizar",
            element: <ActualizarSalidaStock/>
          },
        ]
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
