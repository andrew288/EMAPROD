import React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getAllProductos } from "./../../../helpers/Referenciales/producto/getAllProductos";

export const FilterAllProductos = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataProductos = async () => {
    const resultPeticion = await getAllProductos();
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
    obtenerDataProductos();
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
