import React from "react";
import { Outlet } from "react-router-dom";

export const LayoutProductoNav = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};
