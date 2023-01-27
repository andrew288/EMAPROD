import axios from 'axios';

export const getMateriaPrimaById = async (idMateriaPrima) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/materia_prima/view_materia_prima.php';
    const url = domain + path;

    const { data } = await axios.post(
        url,
        {
            id: idMateriaPrima
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data.result;
}