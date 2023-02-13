import axios from 'axios';
import config from '../.././../config';

export const updateProducto = async (idProd, body) => {

    const domain = config.API_URL;
    const path = '/molienda/producto/update_producto.php';
    const url = domain + path;

    const { data } = await axios.put(
        url,
        {
            ...body,
            id: idProd,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data;
}