import axios from 'axios';
import config from './../../config';

export const getAlmacenes = async () => {

    const domain = config.API_URL;
    const path = '/almacen/materia-prima-categoria/list-almacenes.php';
    const url = domain + path;
    const { data } = await axios.post(url);
    return data.result;
}