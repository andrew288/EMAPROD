import axios from 'axios';

export const updateMateriaPrima = async (idMateriaPrima, body) => {

    const urlPeticion = 'http://localhost/EMAPROD/Backend/almacen/materia_prima/update_materia_prima.php';
    const { data } = await axios.put(
        urlPeticion,
        {
            ...body,
            id: idMateriaPrima,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data;
}