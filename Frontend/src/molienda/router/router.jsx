import HomeMolienda from "./../pages/HomeMolienda";
import { LayoutProductoNav } from "./../../layout/producto/LayoutProductoNav";
import { RouterMoliendaProducto } from "../pages/producto/RouterMoliendaProducto";
import { RouterMoliendaFormula } from "./../pages/formula/RouterMoliendaFormula";

export const RouterMolienda = [
  {
    path: "",
    element: <HomeMolienda />,
  },
  {
    path: "producto",
    element: <LayoutProductoNav />,
    children: RouterMoliendaProducto,
  },
  {
    path: "formula",
    element: <LayoutProductoNav />,
    children: RouterMoliendaFormula,
  },
];
