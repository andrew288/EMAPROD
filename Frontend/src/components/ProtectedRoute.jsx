import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ redirectTo = "" }) => {
  // OBTENEMOS INFORMACION DEL LOCALSTORAGE
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));
    console.log(userLocalStorage);
    if (userLocalStorage) {
      setUser(userLocalStorage);
    }
  }, []);

  if (!user) {
    return <Navigate to={redirectTo} />;
  }
  return <Outlet />;
};
