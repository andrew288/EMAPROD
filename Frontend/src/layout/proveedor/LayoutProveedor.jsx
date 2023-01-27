import React from "react";
import { Outlet } from "react-router-dom";

const LayoutProveedor = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default LayoutProveedor;
