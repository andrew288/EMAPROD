import React from "react";
import { useState, useEffect } from "react";
import { getMateriaPrima } from "./../helpers/materia-prima/getMateriasPrimas";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export const FilterMateriaPrima = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataMateriPrima = async () => {
    const resultPeticion = await getMateriaPrima();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.codProd,
        label: element.nomProd,
        id: element.id,
      };
    });
    setResult(formatSelect);
  };

  useEffect(() => {
    obtenerDataMateriPrima();
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
