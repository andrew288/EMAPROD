import React, { useState, useEffect } from "react";
import Select from "react-select";
import { getAlmacenes } from "./../helpers/getAlmacenes";

export const FilterAlmacen = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const getDataAlmacenes = async () => {
    const resultPeticion = await getAlmacenes();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.codAlm,
        label: `${element.nomAlm}`,
        id: element.id,
      };
    });
    setResult(formatSelect);
  };

  useEffect(() => {
    getDataAlmacenes();
  }, []);

  const handledChange = (value) => {
    onNewInput(value);
  };

  return (
    <>
      <Select options={result} onChange={handledChange} />
    </>
  );
};
