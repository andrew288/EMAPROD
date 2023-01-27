import axios from 'axios';

export const getMateriaPrima = async () => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/materia_prima/list_materias_primas.php';
    const url = domain + path;
    const { data } = await axios.post(url);
    return data.result;
}