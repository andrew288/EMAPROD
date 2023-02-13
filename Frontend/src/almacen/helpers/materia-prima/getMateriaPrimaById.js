import axios from 'axios';
import config from '../.././../config';

export const getMateriaPrimaById = async (idMateriaPrima) => {
    const domain = config.API_URL;
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