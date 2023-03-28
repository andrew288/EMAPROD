import React, { useState } from "react";
import FechaPicker from "../../../components/Fechas/FechaPicker";
import {
  DiaJuliano,
  FormatDateTimeMYSQLNow,
} from "../../../utils/functions/FormatDate";
import { useForm } from "./../../../hooks/useForm";
import { FilterMateriaPrima } from "./../../../components/ReferencialesFilters/Producto/FilterMateriaPrima";
import { FilterProveedor } from "./../../../components/ReferencialesFilters/Proveedor/FilterProveedor";

const ActualizarEntradaStock = () => {
  return (
    <>
      <div className="container"></div>
    </>
  );
};

export default ActualizarEntradaStock;
