import { ListLoteProduccion } from "./ListLoteProduccion";
import { ViewLoteProduccion } from "./ViewLoteProduccion";

export const RouterAlmacenLoteProduccion = [
  {
    path: "",
    element: <ListLoteProduccion />,
  },
  {
    path: "/:id",
    element: <ViewLoteProduccion />,
  },
];
