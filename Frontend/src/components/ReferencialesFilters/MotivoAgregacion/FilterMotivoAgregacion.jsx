import React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getMotivoAgregaciones } from "./../../../helpers/Referenciales/motivo_agregaciones/getMotivoAgregaciones";

export const FilterMotivoAgregacion = ({ onNewInput, disabled }) => {
  const [result, setResult] = useState([]);

  const obtenerDataMotivoAgregacion = async () => {
    const resultPeticion = await getMotivoAgregaciones();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.id,
        label: element.desProdAgrMot,
        id: element.id,
      };
    });
    setResult(formatSelect);
  };

  useEffect(() => {
    obtenerDataMotivoAgregacion();
  }, []);

  const handledChange = (event, value) => {
    onNewInput(value);
  };

  return (
    <>
      <Autocomplete
        disabled={disabled}
        options={result}
        disableClearable
        getOptionLabel={(option) => option.label}
        onChange={handledChange}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </>
  );
};
