import React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getPresentacionFinal } from "../../../helpers/Referenciales/producto/getPresentacionFinal";

export const FilterPresentacionFinal = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataProductos = async () => {
    const resultPeticion = await getPresentacionFinal();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.codProd2 === null ? "000000" : element.codProd2,
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
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          );
        }}
        onChange={handledChange}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </>
  );
};