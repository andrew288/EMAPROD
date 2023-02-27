import React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getProductosMolienda } from "./../../../helpers/Referenciales/producto/getProductosMolienda";

export const FilterProductoMolienda = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataProductoMolienda = async () => {
    const resultPeticion = await getProductosMolienda();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.codProd2,
        label: element.nomProd,
        id: element.id,
      };
    });
    setResult(formatSelect);
  };

  useEffect(() => {
    obtenerDataProductoMolienda();
  }, []);

  const handledChange = (event, value) => {
    onNewInput(value);
  };

  return (
    <>
      <Autocomplete
        options={result}
        disableClearable
        getOptionLabel={(option) => option.label}
        onChange={handledChange}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </>
  );
};
