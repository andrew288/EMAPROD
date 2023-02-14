import axios from 'axios';
import config from '../.././../config';

export const createProducto = async (body) => {

    const domain = config.API_URL;
    const path = '/molienda/producto/create_producto.php';
    const url = domain + path;
    const { data } = await axios.post(url, {
        ...body,
    });
    return data;
}