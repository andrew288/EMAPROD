import axios from 'axios';

export const getProductoById = async (idProducto) => {

    const domain = 'http://localhost/EMAPROD/Backend';
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