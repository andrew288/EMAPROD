import axios from 'axios';
import config from '../.././../config';

export const getProductos = async () => {
    const domain = config.API_URL;
    const path = '/molienda/producto/list_productos.php';
    const url = domain + path;

    const { data } = await axios.post(url);
    return data.result;
}