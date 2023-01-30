import { ListProducto } from "./ListProducto";
import { AgregarProducto } from "./AgregarProducto";
import { ActualizarProducto } from "./ActualizarProducto";
export const RouterMoliendaProducto = [
  {
    path: "",
    element: <ListProducto />,
  },
  {
    path: "crear",
    element: <AgregarProducto />,
  },
  {
    path: "actualizar/:id",
    element: <ActualizarProducto />,
  },
];
