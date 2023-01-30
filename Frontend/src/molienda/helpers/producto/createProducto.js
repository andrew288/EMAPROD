import axios from 'axios';

export const createProducto = async (body) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/molienda/producto/create_producto.php';
    const url = domain + path;
    const { data } = await axios.post(url, {
        ...body,
    });
    return data;
}