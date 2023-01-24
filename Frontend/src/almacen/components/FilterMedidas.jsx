import React, {useState, useEffect} from 'react';
import { getMedidas } from './../helpers/getMedidas';
import Select from 'react-select';

export const FilterMedidas = ({onNewInput}) => {
    const [result, setResult] = useState([]);

    const obtenerDataMedidas = async() => {
        const resultPeticion = await getMedidas();
        const formatSelect = resultPeticion.map((element) => {
            return {
                value: element.id,
                label: `${element.desMed} (${element.simMed})`,
            }
        })
        setResult(formatSelect);
    }

    useEffect(() => {
        obtenerDataMedidas();
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
