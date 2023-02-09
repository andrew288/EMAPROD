import HomeMolienda from "./../pages/HomeMolienda";
import { RouterMoliendaProducto } from "../pages/producto/RouterMoliendaProducto";
import { RouterMoliendaFormula } from "./../pages/formula/RouterMoliendaFormula";
import { RouterMoliendaRequisicion } from "./../pages/requisicion_molienda/RouterMoliendaRequisicion";
import LayoutModulo from "./../../layout/LayoutModulo";

export const RouterMolienda = [
  {
    path: "",
    element: <HomeMolienda />,
  },
  {
    path: "producto",
    element: <LayoutModulo />,
    children: RouterMoliendaProducto,
  },
  {
    path: "formula",
    element: <LayoutModulo />,
    children: RouterMoliendaFormula,
  },
  {
    path: "requisicion",
    element: <LayoutModulo />,
    children: RouterMoliendaRequisicion,
  },
];
