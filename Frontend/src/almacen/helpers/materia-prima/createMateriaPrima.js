import axios from 'axios';

export const createMateriaPrima = async (body) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/materia_prima/create_materia_prima.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        ...body,
    });
    return data;
}