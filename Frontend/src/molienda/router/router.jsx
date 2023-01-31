import HomeMolienda from "./../pages/HomeMolienda";
import { LayoutProductoNav } from "./../../layout/producto/LayoutProductoNav";
import { RouterMoliendaProducto } from "../pages/producto/RouterMoliendaProducto";
import { RouterMoliendaFormula } from "./../pages/formula/RouterMoliendaFormula";
import { RouterMoliendaRequisicion } from "./../pages/requisicion_molienda/RouterMoliendaRequisicion";

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
  {
    path: "requisicion",
    element: <LayoutProductoNav />,
    children: RouterMoliendaRequisicion,
  },
];
