import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export const RowDetalleAgregacionLoteProduccion = ({ detalle }) => {
  return (
    <TableRow>
      <TableCell>{detalle.nomProd}</TableCell>
      <TableCell>{detalle.simMed}</TableCell>
      <TableCell>{detalle.nomAlm}</TableCell>
      <TableCell>{detalle.desProdAgrMot}</TableCell>
      <TableCell>{detalle.canProdAgr}</TableCell>
    </TableRow>
  );
};
