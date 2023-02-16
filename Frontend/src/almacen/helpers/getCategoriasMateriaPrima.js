import axios from 'axios';
import config from './../../config';

export const getCategoriasMateriaPrima = async () => {

    const domain = config.API_URL;
    const path = '/almacen/materia-prima-categoria/list-categoria-materia-prima.php';
    const url = domain + path;
    const { data } = await axios.post(url);
    return data.result;
}