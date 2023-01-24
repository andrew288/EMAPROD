import React, {useState, useEffect} from 'react';
import { getCategoriasMateriaPrima } from './../helpers/getCategoriasMateriaPrima';
import Select from 'react-select';

export const FilterCategoriaMateriaPrima = ({onNewInput}) => {
    const [result, setResult] = useState([]);

    const obtenerDataCategoriaMateriaPrima = async() => {
        const resultPeticion = await getCategoriasMateriaPrima();
        const formatSelect = resultPeticion.map((element) => {
            return {
                value: element.id,
                label: `${element.desMatPriCat}`,
            }
        })
        setResult(formatSelect);
    }

    useEffect(() => {
        obtenerDataCategoriaMateriaPrima();
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
