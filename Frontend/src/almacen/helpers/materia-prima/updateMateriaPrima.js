import axios from 'axios';

export const updateMateriaPrima = async (idMateriaPrima, body) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/materia_prima/update_materia_prima.php';
    const url = domain + path;

    const { data } = await axios.put(
        url,
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