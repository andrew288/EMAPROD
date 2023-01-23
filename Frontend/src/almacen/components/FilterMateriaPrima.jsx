import React from 'react';
import { useState, useEffect } from 'react';
import { getMateriaPrima } from '../helpers/getMateriaPrima';
import Select from 'react-select';

export const FilterMateriaPrima = ({onNewInput}) => {
    
    const [result, setResult] = useState([]);

    const obtenerDataMateriPrima = async() => {
        const resultPeticion = await getMateriaPrima();
        const formatSelect = resultPeticion.map((element) => {
            return {
                value: element.refCodMatPri,
                label: element.nomMatPri,
            }
        })
        setResult(formatSelect);
    }

    useEffect(() => {
      obtenerDataMateriPrima();
    }, [])

    const handledChange = ({value}) => {
        onNewInput(value);
    }

  return (
    <>
        <Select options={result} onChange={handledChange} />
    </>
  )
}
