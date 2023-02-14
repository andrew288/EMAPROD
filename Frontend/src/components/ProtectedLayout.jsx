import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import NavAlmacen from "./../almacen/components/NavAlmacen";

export const ProtectedLayout = () => {
  // OBTENEMOS INFORMACION DEL LOCALSTORAGE
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <NavAlmacen />
      <main>{outlet}</main>
      <footer></footer>;
    </>
  );
};
