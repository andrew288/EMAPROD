import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { getProveedor } from "../helpers/getProveedores";

export const FilterProveedor = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataMateriPrima = async () => {
    const resultPeticion = await getProveedor();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.refCodPro,
        label: `${element.nomPro} ${element.apePro}`,
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
