import React from "react";
import { useState, useEffect } from "react";
import { getProveedores } from "./../helpers/proveedor/getProveedores";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export const FilterProveedor = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataMateriPrima = async () => {
    const resultPeticion = await getProveedores();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.codProv,
        label: `${element.nomProv} ${element.apeProv}`,
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
