import axios from 'axios';
import config from '../.././../config';

export const deleteProducto = async (idProducto) => {

    const domain = config.API_URL;
    const path = '/molienda/producto/delete_producto.php';
    const url = domain + path;

    const { data } = await axios.delete(url,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                id: idProducto,
            },
        }
    );
    return data;
}