import HomeAlmacen from "./../pages/HomeAlmacen";
import LayoutMateriaPrima from "./../../layout/materiaPrima/LayoutMateriaPrima";
import LayoutProveedor from "./../../layout/proveedor/LayoutProveedor";
import LayoutEntradaStock from "./../../layout/entradaStock/LayoutEntradaStock";
import LayoutSalidaStock from "./../../layout/salidaStock/LayoutSalidaStock";
import { RouterAlmacenEntradaStock } from "./../pages/entradasStock/RouterAlmacenEntradas";
import { RouterAlmacenMateriaPrima } from "./../pages/materiaPrima/RouterAlmacenMateriaPrima";
import { RouterAlmacenProveedor } from "./../pages/proveedor/RouterAlmacenProveedor";
import { RouterAlmacenSalidasStock } from "./../pages/salidasStocks/RouterAlmacenSalida";

export const RouterAlmacen = [
  {
    path: "",
    element: <HomeAlmacen />,
  },
  {
    path: "materia-prima",
    element: <LayoutMateriaPrima />,
    children: RouterAlmacenMateriaPrima,
  },
  {
    path: "proveedor",
    element: <LayoutProveedor />,
    children: RouterAlmacenProveedor,
  },
  {
    path: "entradas-stock",
    element: <LayoutEntradaStock />,
    children: RouterAlmacenEntradaStock,
  },
  {
    path: "salidas-stock",
    element: <LayoutSalidaStock />,
    children: RouterAlmacenSalidasStock,
  },
];
