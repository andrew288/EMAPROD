import React, { useEffect, useState } from "react";
import { getCategoriaProducto } from "../helpers/getCategoriaProducto";
import Select from "react-select";

export const FilterCategoriaProducto = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataCategoriaProducto = async () => {
    const resultPeticion = await getCategoriaProducto();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.id,
        label: `${element.desProdCat}`,
      };
    });
    setResult(formatSelect);
  };

  useEffect(() => {
    obtenerDataCategoriaProducto();
  }, []);

  const handledChange = ({ value, label }) => {
    onNewInput({ value, label });
  };

  return (
    <>
      {result && (
        <Select
          //   defaultInputValue={
          //     defaultInput === 0 ? result[0] : obtenerDefaultValue()
          //   }
          options={result}
          onChange={handledChange}
        />
      )}
    </>
  );
};
