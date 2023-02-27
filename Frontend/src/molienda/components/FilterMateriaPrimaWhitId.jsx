import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { getMateriaPrima } from "./../../helpers/Referenciales/producto/getMateriasPrimas";

export const FilterMateriaPrimaWhitId = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataMateriPrima = async () => {
    const resultPeticion = await getMateriaPrima();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.id,
        label: element.nomMatPri,
      };
    });
    setResult(formatSelect);
  };

  useEffect(() => {
    obtenerDataMateriPrima();
  }, []);

  const handledChange = ({ value }) => {
    onNewInput(value);
  };

  return (
    <>
      <Select options={result} onChange={handledChange} />
    </>
  );
};
