import React, { useState, useEffect } from "react";
import { getCategoriasMateriaPrima } from "./../helpers/getCategoriasMateriaPrima";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export const FilterCategoriaMateriaPrima = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataCategoriaMateriaPrima = async () => {
    const resultPeticion = await getCategoriasMateriaPrima();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.id,
        label: `${element.desMatPriCat}`,
        id: element.id,
      };
    });
    setResult(formatSelect);
  };

  useEffect(() => {
    obtenerDataCategoriaMateriaPrima();
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
