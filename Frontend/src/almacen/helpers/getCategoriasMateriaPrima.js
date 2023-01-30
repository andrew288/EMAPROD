import axios from 'axios';

export const getCategoriasMateriaPrima = async () => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/materia-prima-categoria/list-categoria-materia-prima.php';
    const url = domain + path;
    const { data } = await axios.post(url);
    return data.result;
}