import { ListProductosLoteProduccion } from "./ListProductosLoteProduccion";
import { AgregarProductosLoteProduccion } from "./AgregarProductosLoteProduccion";

export const RouterAlmacenProductosLote = [
  {
    path: "",
    element: <ListProductosLoteProduccion />,
  },
  {
    path: "agregar/:id",
    element: <AgregarProductosLoteProduccion />,
  },
];
