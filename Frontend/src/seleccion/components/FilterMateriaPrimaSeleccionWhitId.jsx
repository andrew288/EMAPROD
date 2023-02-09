import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { getMateriaPrima } from "../helpers/requisicion/getMateriasPrimas";

export const FilterMateriaPrimaSeleccionWhitId = ({ onNewInput }) => {
  const [result, setResult] = useState([]);

  const obtenerDataMateriPrima = async () => {
    const resultPeticion = await getMateriaPrima();
    const formatSelect = resultPeticion.map((element) => {
      return {
        value: element.id,
        label: element.nomMatPri,
        idMatPriCat: element.idMatPriCat,
      };
    });

    const filterData = formatSelect.filter((element) => {
      if (element.idMatPriCat === 3) {
        return true;
      } else {
        return false;
      }
    });
    setResult(filterData);
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
