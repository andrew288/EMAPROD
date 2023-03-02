import LayoutModulo from "./../../layout/LayoutModulo";
import { HomeProduccion } from "./../pages/HomeProduccion";
import { RouterProduccionLote } from "./../pages/produccion_lote/RouterProduccionLote";

export const RouterProduccion = [
  {
    path: "",
    element: <HomeProduccion />,
  },
  {
    path: "produccion-lote",
    element: <LayoutModulo />,
    children: RouterProduccionLote,
  },
];
