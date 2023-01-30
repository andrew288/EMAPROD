import axios from 'axios';

export const getProductos = async () => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/molienda/producto/list_productos.php';
    const url = domain + path;

    const { data } = await axios.post(url);
    return data.result;
}