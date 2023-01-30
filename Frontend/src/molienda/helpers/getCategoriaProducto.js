import axios from 'axios';

export const getCategoriaProducto = async () => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/molienda/producto-categoria/list-categoria-producto.php';
    const url = domain + path;
    const { data } = await axios.post(url);
    return data.result;
}