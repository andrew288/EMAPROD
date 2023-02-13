import axios from 'axios';
import config from '../.././../config';

export const getProductoById = async (idProducto) => {

    const domain = config.API_URL;
    const path = '/molienda/producto/view_producto.php';
    const url = domain + path;

    const { data } = await axios.post(
        url,
        {
            id: idProducto
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data.result;
}