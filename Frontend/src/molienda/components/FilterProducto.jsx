import React, { useState, useEffect } from "react";
import { getProductos } from "./../helpers/producto/getProductos";
import Select from "react-select";

export const FilterProducto = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataProducto = async () => {
    const resultPeticion = await getProductos();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.id,
        label: `${element.nomProd}`,
      };
    });
    setResult(formatSelect);
  };

  useEffect(() => {
    obtenerDataProducto();
  }, []);

  const handledChange = ({ value, label }) => {
    onNewInput({ value, label });
  };

  return <>{result && <Select options={result} onChange={handledChange} />}</>;
};
