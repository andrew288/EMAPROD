import axios from 'axios';

export const createMateriaPrima = async (body) => {

    const url = 'http://localhost/EMAPROD/Backend/almacen/materia_prima/create_materia_prima.php';
    const { data } = await axios.post(url, {
        ...body,
    });
    return data;
}